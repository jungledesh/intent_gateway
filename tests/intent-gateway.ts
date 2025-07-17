import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { IntentGateway } from "../target/types/intent_gateway";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as crypto from "crypto";

import { expect } from "chai";

// Test suite
describe("intent_gateway", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  // Get program instance from IDL
  const program = anchor.workspace.IntentGateway as Program<IntentGateway>;

  // Get Tella pubkey
  const tellaKey = program.provider.publicKey;

  // Test dummy instruction - should succeed
  it("Calls dummy successfully", async () => {
    await program.methods.dummy().rpc();
  });

  // Test PDA init - verifies creation and data
  it("Initializes a user PDA and ATA", async () => {
    // Fake user ID - test input
    const userId = "+1234567890";

    // Get raw 32-byte SHA-256 hash using Node's crypto
    const userIdHashBytes = crypto.createHash("sha256").update(userId).digest();
    const userIdHashHex = userIdHashBytes.toString("hex");

    // Compute PDA/bump - mirrors Rust seeds
    const [userPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), userIdHashBytes],
      program.programId
    );

    // USDC mint for devnet
    const usdcMint = new anchor.web3.PublicKey(
      "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
    );

    // Compute ATA address
    const userTokenAccount = anchor.web3.PublicKey.findProgramAddressSync(
      [userPda.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), usdcMint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )[0];

    // Call initialize_user - pass hash, specify accounts, send tx
    await program.methods
      .initializeUser(Array.from(userIdHashBytes))
      .accounts({
        tellaSigner: program.provider.publicKey, // payer
        userAccount: userPda,
        userTokenAccount,
        tokenMint: usdcMint, // TypeScript doesn't recognize it due to stale types
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Fetch account data - check on-chain state
    const userAccount = await program.account.userAccount.fetch(userPda);

    // Assert hash matches - .toString("hex") compares arrays
    expect(Buffer.from(userAccount.userIdHash).toString("hex")).to.equal(
      userIdHashHex
    );

    // Assert bump matches - verifies PDA
    expect(userAccount.bump).to.equal(bump);

    // Check ATA exists and is valid
    const tokenAccount = await program.provider.connection.getAccountInfo(
      userTokenAccount
    );
    expect(tokenAccount).to.not.be.null; // ATA created
    expect(tokenAccount.owner.toBase58()).to.equal(TOKEN_PROGRAM_ID.toBase58()); // Owned by Token Program
  });

  // Test re-initialization fail - checks guard
  it("Fails re-initialization", async () => {
    // Fake user ID - same as init test
    const userId = "+1234567890";

    // Get raw 32-byte SHA-256 hash using Node's crypto
    const userIdHashBytes = crypto.createHash("sha256").update(userId).digest();
    const userIdHashHex = userIdHashBytes.toString("hex");

    // Compute PDA/bump - mirrors Rust seeds
    const [userPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), userIdHashBytes],
      program.programId
    );

    // USDC mint for devnet
    const usdcMint = new anchor.web3.PublicKey(
      "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
    );

    // Compute ATA address
    const userTokenAccount = anchor.web3.PublicKey.findProgramAddressSync(
      [userPda.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), usdcMint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )[0];

    // Try call again - expect fail
    try {
      await program.methods
        .initializeUser(Array.from(userIdHashBytes))
        .accounts({
          tellaSigner: program.provider.publicKey, // payer
          userAccount: userPda,
          userTokenAccount,
          tokenMint: usdcMint, // TypeScript doesn't recognize it due to stale types
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.error.errorMessage).to.equal("Account already initialized"); // Matches Rust msg
    }
  });
});
