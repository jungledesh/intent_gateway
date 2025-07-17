import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { IntentGateway } from "../target/types/intent_gateway";
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
  it("Initializes a user PDA", async () => {
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

    // Call initialize_user - pass hash, specify accounts, send tx
    await program.methods
      .initializeUser(Array.from(userIdHashBytes))
      .accounts({
        tellaSigner: program.provider.publicKey, // payer
        // @ts-ignore
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
  });

  it("Fails re-initialization", async () => {
    const userId = "+1234567890";
  
    // Use Node crypto to hash correctly as raw bytes
    const userIdHashBytes = crypto.createHash("sha256").update(userId).digest();
  
    // Derive PDA
    const [userPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), userIdHashBytes],
      program.programId
    );
  
    try {
      // Call initializeUser again with the same userIdHashBytes (as array)
      await program.methods
        .initializeUser(Array.from(userIdHashBytes))
        .accounts({
          tellaSigner: program.provider.publicKey,
          // @ts-ignore
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
  
      // Fail if no error thrown
      expect.fail("Should have failed with AlreadyInitialized");
    } catch (err) {
      // Check the error contains our expected Anchor error code message
      expect(err.toString()).to.contain("AlreadyInitialized");
    }
  });
});
