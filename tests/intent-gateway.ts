import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { IntentGateway } from "../target/types/intent_gateway";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createMint,
  mintTo,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import * as crypto from "crypto";
import { expect } from "chai";
import BN from "bn.js";

// Test suite
describe("intent_gateway", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  // Get program instance from IDL
  const program = anchor.workspace.IntentGateway as Program<IntentGateway>;

  let mint: anchor.web3.PublicKey; // Declare here for scope

  before(async () => {
    const mintAuthority = program.provider.publicKey;
    mint = await createMint(
      program.provider.connection,
      program.provider.wallet.payer, // Payer
      mintAuthority, // Mint authority
      null, // Freeze authority
      6, // Decimals
      undefined, // Mint keypair (random)
      undefined, // Confirm opts
      TOKEN_PROGRAM_ID,
    );
  });

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
      program.programId,
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      mint,
      userPda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    // Call initialize_user - pass hash, specify accounts, send tx
    await program.methods
      .initializeUser(Array.from(userIdHashBytes))
      .accounts({
        tellaSigner: program.provider.publicKey, // payer
        userAccount: userPda,
        userTokenAccount,
        tokenMint: mint, // TypeScript doesn't recognize it due to stale types
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Fetch account data - check on-chain state
    const userAccount = await program.account.userAccount.fetch(userPda);

    // Assert hash matches - .toString("hex") compares arrays
    expect(Buffer.from(userAccount.userIdHash).toString("hex")).to.equal(
      userIdHashHex,
    );

    // Assert bump matches - verifies PDA
    expect(userAccount.bump).to.equal(bump);
    expect(userAccount.isInitialized).to.be.true;

    // Check ATA exists and is valid
    const tokenAccount =
      await program.provider.connection.getAccountInfo(userTokenAccount);
    expect(tokenAccount).to.not.be.null; // ATA created
    expect(tokenAccount.owner.toBase58()).to.equal(TOKEN_PROGRAM_ID.toBase58()); // Owned by Token Program
  });

  // Unauthorized signer (bad actor)
  it("Fails initialization with unauthorized signer", async () => {
    const userId = "+unauthorized";
    const userIdHashBytes = crypto.createHash("sha256").update(userId).digest();

    const [userPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), userIdHashBytes],
      program.programId,
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      mint,
      userPda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    const unauthorizedSigner = anchor.web3.Keypair.generate();

    // Airdrop SOL to the unauthorized signer to cover tx fees and rent
    const airdropSignature = await program.provider.connection.requestAirdrop(
      unauthorizedSigner.publicKey,
      anchor.web3.LAMPORTS_PER_SOL, // 1 SOL should be sufficient
    );

    await program.provider.connection.confirmTransaction({
      signature: airdropSignature,
      blockhash: (await program.provider.connection.getLatestBlockhash())
        .blockhash,
      lastValidBlockHeight: (
        await program.provider.connection.getLatestBlockhash()
      ).lastValidBlockHeight,
    });

    try {
      await program.methods
        .initializeUser(Array.from(userIdHashBytes))
        .accounts({
          tellaSigner: unauthorizedSigner.publicKey,
          userAccount: userPda,
          userTokenAccount,
          tokenMint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([unauthorizedSigner]) // Sign with unauthorized keypair
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("Unauthorized");
    }
  });

  // Special case: Init with zero user_id_hash
  it("Initializes with zero user_id_hash", async () => {
    const zeroHash = new Uint8Array(32).fill(0);
    const zeroHex = zeroHash.toString("hex");

    const [userPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), zeroHash],
      program.programId,
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      mint,
      userPda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    await program.methods
      .initializeUser(Array.from(zeroHash))
      .accounts({
        tellaSigner: program.provider.publicKey,
        userAccount: userPda,
        userTokenAccount,
        tokenMint: mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Fetch account data - check on-chain state
    const userAccount = await program.account.userAccount.fetch(userPda);

    // Assert hash matches - .toString("hex") compares arrays
    expect(userAccount.userIdHash).to.deep.equal(Array.from(zeroHash));

    // Assert bump matches - verifies PDA
    expect(userAccount.bump).to.equal(bump);
    expect(userAccount.isInitialized).to.be.true;

    // Check ATA exists and is valid
    const tokenAccount =
      await program.provider.connection.getAccountInfo(userTokenAccount);
    expect(tokenAccount).to.not.be.null; // ATA created
    expect(tokenAccount.owner.toBase58()).to.equal(TOKEN_PROGRAM_ID.toBase58()); // Owned by Token Program
  });

  it("Fails initialization with wrong user_token_account", async () => {
    const userId = "+wrongata";
    const userIdHashBytes = crypto.createHash("sha256").update(userId).digest();

    const [userPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), userIdHashBytes],
      program.programId,
    );

    const wrongUserTokenAccount = anchor.web3.Keypair.generate().publicKey;

    try {
      await program.methods
        .initializeUser(Array.from(userIdHashBytes))
        .accounts({
          tellaSigner: program.provider.publicKey,
          userAccount: userPda,
          userTokenAccount: wrongUserTokenAccount,
          tokenMint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.error.errorMessage).to.equal(
        "Invalid token account (must be ATA)",
      );
    }
  });

  // Edge: Re-init with zero hash
  it("Re-initialization with zero user_id_hash", async () => {
    const zeroHash = new Uint8Array(32).fill(0);

    const [userPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), zeroHash],
      program.programId,
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      mint,
      userPda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    try {
      await program.methods
        .initializeUser(Array.from(zeroHash))
        .accounts({
          tellaSigner: program.provider.publicKey,
          userAccount: userPda,
          userTokenAccount,
          tokenMint: mint,
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

  // Test re-initialization fail - checks guard
  it("Fails re-initialization", async () => {
    // Fake user ID - same as init test
    const userId = "+1234567890";

    // Get raw 32-byte SHA-256 hash using Node's crypto
    const userIdHashBytes = crypto.createHash("sha256").update(userId).digest();

    // Compute PDA/bump - mirrors Rust seeds
    const [userPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), userIdHashBytes],
      program.programId,
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      mint,
      userPda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    // Try call again - expect fail
    try {
      await program.methods
        .initializeUser(Array.from(userIdHashBytes))
        .accounts({
          tellaSigner: program.provider.publicKey, // payer
          userAccount: userPda,
          userTokenAccount,
          tokenMint: mint, // TypeScript doesn't recognize it due to stale types
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

  // Test P2P transfer - verifies USDC move between PDAs
  it("Transfers USDC between users", async () => {
    // Fake users
    const user1Id = "+1234567890"; // From
    const user1HashBytes = crypto.createHash("sha256").update(user1Id).digest();

    const user2Id = "+0987654321"; // To
    const user2HashBytes = crypto.createHash("sha256").update(user2Id).digest();

    const [user1Pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user1HashBytes],
      program.programId,
    );
    const [user2Pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), user2HashBytes],
      program.programId,
    );

    const user1TokenAccount = await getAssociatedTokenAddress(
      mint,
      user1Pda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    const user2TokenAccount = await getAssociatedTokenAddress(
      mint,
      user2Pda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    // Check if users initialized, init if not (idempotent)
    const user1Acc = await program.provider.connection.getAccountInfo(user1Pda);
    if (!user1Acc) {
      await program.methods
        .initializeUser(Array.from(user1HashBytes))
        .accounts({
          tellaSigner: program.provider.publicKey,
          userAccount: user1Pda,
          userTokenAccount: user1TokenAccount,
          tokenMint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc({ commitment: "confirmed" });
    }

    const user2Acc = await program.provider.connection.getAccountInfo(user2Pda);
    if (!user2Acc) {
      await program.methods
        .initializeUser(Array.from(user2HashBytes))
        .accounts({
          tellaSigner: program.provider.publicKey,
          userAccount: user2Pda,
          userTokenAccount: user2TokenAccount,
          tokenMint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc({ commitment: "confirmed" });
    }

    // Mint tokens to user1 ATA (1 token)
    await mintTo(
      program.provider.connection,
      program.provider.wallet.payer,
      mint,
      user1TokenAccount,
      program.provider.publicKey, // Mint authority
      1000000, // Amount (1 with decimals=6)
      [],
      { commitment: "confirmed" },
      TOKEN_PROGRAM_ID,
    );

    const fromTokenAccountInfo =
      await program.provider.connection.getParsedAccountInfo(user1TokenAccount);

    // Call p2p_transfer - 0.5 USDC (500000 units)
    await program.methods
      .p2PTransfer(
        Array.from(user1HashBytes),
        Array.from(user2HashBytes),
        new BN(1000000),
      )
      .accounts({
        tellaSigner: program.provider.publicKey,
        fromUserAccount: user1Pda,
        fromTokenAccount: user1TokenAccount,
        toUserAccount: user2Pda,
        toTokenAccount: user2TokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    // Check balances post transfer
    const user1Balance =
      await program.provider.connection.getTokenAccountBalance(
        user1TokenAccount,
      );
    const user2Balance =
      await program.provider.connection.getTokenAccountBalance(
        user2TokenAccount,
      );

    // Assert balances changed exactly
    expect(user1Balance.value.uiAmount).to.equal(0.0);
    expect(user2Balance.value.uiAmount).to.equal(1.0);
  });
});
