import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { IntentGateway } from "../target/types/intent_gateway";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  transfer,
  getAssociatedTokenAddress,
  getAccount,
  createAssociatedTokenAccount,
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

  const user1Id = "+1234567890_" + Date.now(); // From
  const user1HashBytes = crypto.createHash("sha256").update(user1Id).digest();
  const user1HashHex = user1HashBytes.toString("hex");

  const user2Id = "+0987654321_" + Date.now(); // To
  const user2HashBytes = crypto.createHash("sha256").update(user2Id).digest();

  const [user1Pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user"), user1HashBytes],
    program.programId,
  );
  const [user2Pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user"), user2HashBytes],
    program.programId,
  );

  let mint: anchor.web3.PublicKey; // Declare here for scope
  let user1TokenAccount: anchor.web3.PublicKey;
  let user2TokenAccount: anchor.web3.PublicKey;

  before(async () => {
    // const mintAuthority = program.provider.publicKey;
    // mint = await createMint(
    //   program.provider.connection,
    //   program.provider.wallet.payer, // Payer
    //   mintAuthority, // Mint authority
    //   null, // Freeze authority
    //   6, // Decimals
    //   undefined, // Mint keypair (random)
    //   undefined, // Confirm opts
    //   TOKEN_PROGRAM_ID,
    // );

    // For devnet
    mint = new anchor.web3.PublicKey(
      "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
    );

    user1TokenAccount = await getAssociatedTokenAddress(
      mint,
      user1Pda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    user2TokenAccount = await getAssociatedTokenAddress(
      mint,
      user2Pda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    console.log("user1TokenAccount: ", user1TokenAccount.toBase58()); 
  });

  // Test dummy instruction - should succeed
  it("Calls dummy successfully", async () => {
    await program.methods.dummy().rpc();
  });

  // Test PDA init - verifies creation and data
  it("Initializes a user PDA and ATA", async () => {
    const userTokenAccount = await getAssociatedTokenAddress(
      mint,
      user1Pda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    // Call initialize_user - pass hash, specify accounts, send tx
    await program.methods
      .initializeUser(Array.from(user1HashBytes))
      .accounts({
        tellaSigner: program.provider.publicKey, // payer
        userAccount: user1Pda,
        userTokenAccount,
        tokenMint: mint, // TypeScript doesn't recognize it due to stale types
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Fetch account data - check on-chain state
    const userAccount = await program.account.userAccount.fetch(user1Pda);

    // Assert hash matches - .toString("hex") compares arrays
    expect(Buffer.from(userAccount.userIdHash).toString("hex")).to.equal(
      user1HashHex,
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
    const userId = "+unauthorized" + Date.now();
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

    // Attempt airdrop; if fails, log and skip (for devnet limits)
    try {
      const airdropSignature = await program.provider.connection.requestAirdrop(
        unauthorizedSigner.publicKey,
        anchor.web3.LAMPORTS_PER_SOL, // 1 SOL
      );
      await program.provider.connection.confirmTransaction({
        signature: airdropSignature,
        blockhash: (await program.provider.connection.getLatestBlockhash())
          .blockhash,
        lastValidBlockHeight: (
          await program.provider.connection.getLatestBlockhash()
        ).lastValidBlockHeight,
      });
    } catch (airdropErr) {
      console.log("Airdrop failed: ", airdropErr.message); // Log for debugging
      expect.fail(
        "Airdrop failed due to limit; use alternative faucet or wait 24 hours",
      );
    }

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

    // Check if already initialized
    const userAcc = await program.provider.connection.getAccountInfo(userPda);
    if (userAcc) {
      console.log(
        "Zero hash PDA already initialized on devnet; skipping init assertion",
      );
      return; // Skip the test if already initialized (persistent state)
    }

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
    const userId = "+wrongata" + Date.now();
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

  // Verifying ATA details post-init
  it("Verifies ATA details after initialization", async () => {
    const userId = "+atadetails" + Date.now();
    const userIdHashBytes = crypto.createHash("sha256").update(userId).digest();

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

    await program.methods
      .initializeUser(Array.from(userIdHashBytes))
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

    // Fetch and verify UserAccount
    const userAccount = await program.account.userAccount.fetch(userPda);
    expect(userAccount.userIdHash).to.deep.equal(Array.from(userIdHashBytes));
    expect(userAccount.isInitialized).to.be.true;
    expect(userAccount.bump).to.equal(bump);

    // Fetch and verify ATA details
    const ataInfo = await getAccount(
      program.provider.connection,
      userTokenAccount,
    );
    expect(ataInfo.mint.toBase58()).to.equal(mint.toBase58()); // Matches mint
    expect(ataInfo.owner.toBase58()).to.equal(userPda.toBase58()); // Owned by PDA
    expect(ataInfo.amount).to.equal(0n); // Initial balance is 0
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
    const userTokenAccount = await getAssociatedTokenAddress(
      mint,
      user1Pda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    // Try call again - expect fail
    try {
      await program.methods
        .initializeUser(Array.from(user1HashBytes))
        .accounts({
          tellaSigner: program.provider.publicKey, // payer
          userAccount: user1Pda,
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

  // Idempotent ATA creation
  it("Idempotently initializes when ATA already exists", async () => {
    const userId = "+idempotent" + Date.now();
    const userIdHashBytes = crypto.createHash("sha256").update(userId).digest();

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

    // First call: Initialize user and create ATA
    await program.methods
      .initializeUser(Array.from(userIdHashBytes))
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

    // Verify ATA after first call
    const ataInfoFirst = await getAccount(
      program.provider.connection,
      userTokenAccount,
    );
    expect(ataInfoFirst.mint.toBase58()).to.equal(mint.toBase58());
    expect(ataInfoFirst.owner.toBase58()).to.equal(userPda.toBase58());
    expect(ataInfoFirst.amount).to.equal(0n);

    // Second call: Should fail due to re-init, but ATA remains unchanged
    try {
      await program.methods
        .initializeUser(Array.from(userIdHashBytes))
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
      expect(err.error.errorCode.code).to.equal("AlreadyInitialized");
    }

    // Verify ATA unchanged after second call
    const ataInfoSecond = await getAccount(
      program.provider.connection,
      userTokenAccount,
    );
    expect(ataInfoSecond.mint.toBase58()).to.equal(mint.toBase58());
    expect(ataInfoSecond.owner.toBase58()).to.equal(userPda.toBase58());
    expect(ataInfoSecond.amount).to.equal(0n);
  });

  it("Fails initialization with invalid token_mint", async () => {
    const userId = "+invalidmint" + Date.now();
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

    const invalidMint = anchor.web3.Keypair.generate().publicKey; // Random key, not a mint

    try {
      await program.methods
        .initializeUser(Array.from(userIdHashBytes))
        .accounts({
          tellaSigner: program.provider.publicKey,
          userAccount: userPda,
          userTokenAccount,
          tokenMint: invalidMint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.error.errorCode.code).to.be.oneOf([
        "ConstraintAddress",
        "InvalidTokenAccount",
      ]);
    }
  });

  it("Fails initialization when payer has insufficient SOL", async () => {
    const userId = "+lowsol" + Date.now();
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

    // Create a low-balance signer
    const lowBalanceSigner = anchor.web3.Keypair.generate();
    const minLamports = 100000; // Minimal SOL for tx fees, too low for rent

    // Attempt airdrop; handle 429 limit
    try {
      const airdropSignature = await program.provider.connection.requestAirdrop(
        lowBalanceSigner.publicKey,
        minLamports,
      );
      await program.provider.connection.confirmTransaction({
        signature: airdropSignature,
        blockhash: (await program.provider.connection.getLatestBlockhash())
          .blockhash,
        lastValidBlockHeight: (
          await program.provider.connection.getLatestBlockhash()
        ).lastValidBlockHeight,
      });
    } catch (airdropErr) {
      console.log("Airdrop failed: ", airdropErr.message); // Log for debugging
      console.log(
        "Airdrop failed due to limit; use alternative faucet or wait 24 hours",
      );
      return;
    }

    try {
      await program.methods
        .initializeUser(Array.from(userIdHashBytes))
        .accounts({
          tellaSigner: lowBalanceSigner.publicKey,
          userAccount: userPda,
          userTokenAccount,
          tokenMint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([lowBalanceSigner])
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.toString().toLowerCase()).to.include("insufficient lamports");
    }
  });

  // Test P2P transfer - verifies USDC move between PDAs
  it("Transfers USDC between users", async () => {
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

    // // Mint tokens to user1 ATA (1 token)
    // await mintTo(
    //   program.provider.connection,
    //   program.provider.wallet.payer,
    //   mint,
    //   user1TokenAccount,
    //   program.provider.publicKey, // Mint authority
    //   1000000, // Amount (1 with decimals=6)
    //   [],
    //   { commitment: "confirmed" },
    //   TOKEN_PROGRAM_ID,
    // );

    // Get provider's ATA for USDC
    const providerAta = await getAssociatedTokenAddress(
      mint,
      program.provider.publicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    // Create provider's ATA if it doesn't exist
    const providerAtaInfo =
      await program.provider.connection.getAccountInfo(providerAta);
    if (!providerAtaInfo) {
      await createAssociatedTokenAccount(
        program.provider.connection,
        program.provider.wallet.payer,
        mint,
        program.provider.publicKey,
        program.provider.publicKey, // Signer
        { commitment: "confirmed" },
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );
    }

    // Transfer 10 USDC (10,000,000 units) from provider's ATA to user1TokenAccount
    await transfer(
      program.provider.connection,
      program.provider.wallet.payer, // Payer
      providerAta, // From (provider's ATA)
      user1TokenAccount, // To (user1's ATA)
      program.provider.publicKey, // Authority (provider's wallet)
      10000000, // Amount (10 USDC with 6 decimals)
      [], // Signers (none needed beyond payer)
      { commitment: "confirmed" },
      TOKEN_PROGRAM_ID,
    );

    // Verify funding (optional, for debugging)
    const user1BalanceAfterFund =
      await program.provider.connection.getTokenAccountBalance(
        user1TokenAccount,
      );
    expect(user1BalanceAfterFund.value.uiAmount).to.be.at.least(10);

    // Call p2p_transfer - 1 USDC (1000000 units)
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
    expect(user1Balance.value.uiAmount).to.equal(9.0);
    expect(user2Balance.value.uiAmount).to.equal(1.0);
  });

  it("Fails p2p transfer with unauthorized signer", async () => {
    // Create a low-balance signer
    const unauthorizedSigner = anchor.web3.Keypair.generate();
    const minLamports = 100000; // Minimal SOL for tx fees, too low for rent

    // Attempt airdrop; handle 429 limit
    try {
      const airdropSignature = await program.provider.connection.requestAirdrop(
        unauthorizedSigner.publicKey,
        minLamports,
      );
      await program.provider.connection.confirmTransaction({
        signature: airdropSignature,
        blockhash: (await program.provider.connection.getLatestBlockhash())
          .blockhash,
        lastValidBlockHeight: (
          await program.provider.connection.getLatestBlockhash()
        ).lastValidBlockHeight,
      });
    } catch (airdropErr) {
      console.log("Airdrop failed: ", airdropErr.message); // Log for debugging
      console.log(
        "Airdrop failed due to limit; use alternative faucet or wait 24 hours",
      );
      return;
    }

    try {
      await program.methods
        .p2PTransfer(
          Array.from(user1HashBytes),
          Array.from(user2HashBytes),
          new BN(500000),
        )
        .accounts({
          tellaSigner: unauthorizedSigner.publicKey,
          fromUserAccount: user1Pda,
          fromTokenAccount: user1TokenAccount,
          toUserAccount: user2Pda,
          toTokenAccount: user2TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([unauthorizedSigner])
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("Unauthorized");
    }
  });

  it("Fails p2p transfer with invalid hashes", async () => {
    const invalidHash = crypto
      .createHash("sha256")
      .update("+invalid" + Date.now())
      .digest();

    try {
      await program.methods
        .p2PTransfer(
          Array.from(invalidHash),
          Array.from(user2HashBytes),
          new BN(5000000),
        )
        .accounts({
          tellaSigner: program.provider.publicKey,
          fromUserAccount: user1Pda,
          fromTokenAccount: user1TokenAccount,
          toUserAccount: user2Pda,
          toTokenAccount: user2TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }
  });

  it("Fails p2p transfer with zero amount", async () => {
    try {
      await program.methods
        .p2PTransfer(
          Array.from(user1HashBytes),
          Array.from(user2HashBytes),
          new BN(0),
        )
        .accounts({
          tellaSigner: program.provider.publicKey,
          fromUserAccount: user1Pda,
          fromTokenAccount: user1TokenAccount,
          toUserAccount: user2Pda,
          toTokenAccount: user2TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("InvalidAmount");
    }
  });

  it("Fails p2p transfer to the same user", async () => {
    try {
      await program.methods
        .p2PTransfer(
          Array.from(user1HashBytes),
          Array.from(user1HashBytes),
          new BN(500000),
        )
        .accounts({
          tellaSigner: program.provider.publicKey,
          fromUserAccount: user1Pda,
          fromTokenAccount: user1TokenAccount,
          toUserAccount: user1Pda,
          toTokenAccount: user1TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("SelfTransferNotAllowed");
    }
  });

  it("Fails p2p transfer with insufficient funds", async () => {
    try {
      await program.methods
        .p2PTransfer(
          Array.from(user1HashBytes),
          Array.from(user2HashBytes),
          new BN(50000000),
        )
        .accounts({
          tellaSigner: program.provider.publicKey,
          fromUserAccount: user1Pda,
          fromTokenAccount: user1TokenAccount,
          toUserAccount: user2Pda,
          toTokenAccount: user2TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.toString()).to.include("insufficient funds");
    }
  });
});
