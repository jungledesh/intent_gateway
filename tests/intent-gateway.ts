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

describe("intent_gateway", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.IntentGateway as Program<IntentGateway>;

  // Test users: user1 sends, user2 receives
  const user1Id = "+1234567890_" + Date.now();
  const user1HashBytes = crypto.createHash("sha256").update(user1Id).digest();
  const user1HashHex = user1HashBytes.toString("hex");

  const user2Id = "+0987654321_" + Date.now();
  const user2HashBytes = crypto.createHash("sha256").update(user2Id).digest();

  // Derive PDAs from user hashes
  const [user1Pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user"), user1HashBytes],
    program.programId,
  );
  const [user2Pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user"), user2HashBytes],
    program.programId,
  );

  // Token accounts (devnet USDC)
  let mint: anchor.web3.PublicKey;
  let user1TokenAccount: anchor.web3.PublicKey;
  let user2TokenAccount: anchor.web3.PublicKey;

  before(async () => {
    // Use devnet USDC mint
    mint = new anchor.web3.PublicKey(
      "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
    );

    // Get ATAs for both users
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

  // Smoke test: verify program is accessible
  it("Calls dummy successfully", async () => {
    await program.methods.dummy().rpc();
  });

  // Creates user PDA and associated token account
  it("Initializes a user PDA and ATA", async () => {
    const userTokenAccount = await getAssociatedTokenAddress(
      mint,
      user1Pda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    // Initialize user account with hash
    await program.methods
      .initializeUser(Array.from(user1HashBytes))
      .accounts({
        tellaSigner: program.provider.publicKey,
        userAccount: user1Pda,
        userTokenAccount,
        tokenMint: mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Verify PDA data
    const userAccount = await program.account.userAccount.fetch(user1Pda);
    expect(Buffer.from(userAccount.userIdHash).toString("hex")).to.equal(
      user1HashHex,
    );
    expect(userAccount.bump).to.equal(bump);
    expect(userAccount.isInitialized).to.be.true;

    // Verify ATA created and owned by token program
    const tokenAccount =
      await program.provider.connection.getAccountInfo(userTokenAccount);
    expect(tokenAccount).to.not.be.null;
    expect(tokenAccount.owner.toBase58()).to.equal(TOKEN_PROGRAM_ID.toBase58());
  });

  // Only authorized signers can initialize accounts
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

    // Fund unauthorized signer
    try {
      const airdropSignature = await program.provider.connection.requestAirdrop(
        unauthorizedSigner.publicKey,
        anchor.web3.LAMPORTS_PER_SOL,
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
      console.log("Airdrop failed: ", airdropErr.message);
      expect.fail(
        "Airdrop failed due to limit; use alternative faucet or wait 24 hours",
      );
    }

    // Attempt initialization with non-whitelisted signer
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
        .signers([unauthorizedSigner])
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("Unauthorized");
    }
  });

  // Edge case: accepts all-zero hash
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

    // Skip if already initialized (devnet persistence)
    const userAcc = await program.provider.connection.getAccountInfo(userPda);
    if (userAcc) {
      console.log(
        "Zero hash PDA already initialized on devnet; skipping init assertion",
      );
      return;
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

    // Verify account data
    const userAccount = await program.account.userAccount.fetch(userPda);
    expect(userAccount.userIdHash).to.deep.equal(Array.from(zeroHash));
    expect(userAccount.bump).to.equal(bump);
    expect(userAccount.isInitialized).to.be.true;

    // Verify ATA
    const tokenAccount =
      await program.provider.connection.getAccountInfo(userTokenAccount);
    expect(tokenAccount).to.not.be.null;
    expect(tokenAccount.owner.toBase58()).to.equal(TOKEN_PROGRAM_ID.toBase58());
  });

  // Rejects non-ATA token accounts
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

  // Confirms ATA mint, owner, and balance after init
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

    // Verify UserAccount
    const userAccount = await program.account.userAccount.fetch(userPda);
    expect(userAccount.userIdHash).to.deep.equal(Array.from(userIdHashBytes));
    expect(userAccount.isInitialized).to.be.true;
    expect(userAccount.bump).to.equal(bump);

    // Verify ATA properties
    const ataInfo = await getAccount(
      program.provider.connection,
      userTokenAccount,
    );
    expect(ataInfo.mint.toBase58()).to.equal(mint.toBase58());
    expect(ataInfo.owner.toBase58()).to.equal(userPda.toBase58());
    expect(ataInfo.amount).to.equal(0n);
  });

  // Re-init with zero hash should fail
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
      expect(err.error.errorMessage).to.equal("Account already initialized");
    }
  });

  // Re-init protection: prevents duplicate user accounts
  it("Fails re-initialization", async () => {
    const userTokenAccount = await getAssociatedTokenAddress(
      mint,
      user1Pda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    // Second init attempt should fail
    try {
      await program.methods
        .initializeUser(Array.from(user1HashBytes))
        .accounts({
          tellaSigner: program.provider.publicKey,
          userAccount: user1Pda,
          userTokenAccount,
          tokenMint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.error.errorMessage).to.equal("Account already initialized");
    }
  });

  // ATA creation is idempotent - doesn't fail if ATA exists
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

    // First initialization succeeds
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

    const ataInfoFirst = await getAccount(
      program.provider.connection,
      userTokenAccount,
    );
    expect(ataInfoFirst.mint.toBase58()).to.equal(mint.toBase58());
    expect(ataInfoFirst.owner.toBase58()).to.equal(userPda.toBase58());
    expect(ataInfoFirst.amount).to.equal(0n);

    // Second init fails but ATA unchanged
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

    const ataInfoSecond = await getAccount(
      program.provider.connection,
      userTokenAccount,
    );
    expect(ataInfoSecond.mint.toBase58()).to.equal(mint.toBase58());
    expect(ataInfoSecond.owner.toBase58()).to.equal(userPda.toBase58());
    expect(ataInfoSecond.amount).to.equal(0n);
  });

  // Validates mint address matches expected token
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

    const invalidMint = anchor.web3.Keypair.generate().publicKey;

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

  // Requires sufficient rent for account creation
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

    const lowBalanceSigner = anchor.web3.Keypair.generate();
    const minLamports = 100000;

    // Fund with insufficient balance
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
      console.log("Airdrop failed: ", airdropErr.message);
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

  // Transfers tokens via PDA authority
  it("Transfers USDC between users", async () => {
    // Initialize users if needed
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

    // Fund user1 with USDC from provider
    const providerAta = await getAssociatedTokenAddress(
      mint,
      program.provider.publicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    const providerAtaInfo =
      await program.provider.connection.getAccountInfo(providerAta);
    if (!providerAtaInfo) {
      await createAssociatedTokenAccount(
        program.provider.connection,
        program.provider.wallet.payer,
        mint,
        program.provider.publicKey,
        program.provider.publicKey,
        { commitment: "confirmed" },
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );
    }

    // Transfer 10 USDC to user1
    await transfer(
      program.provider.connection,
      program.provider.wallet.payer,
      providerAta,
      user1TokenAccount,
      program.provider.publicKey,
      10000000,
      [],
      { commitment: "confirmed" },
      TOKEN_PROGRAM_ID,
    );

    const user1BalanceAfterFund =
      await program.provider.connection.getTokenAccountBalance(
        user1TokenAccount,
      );
    expect(user1BalanceAfterFund.value.uiAmount).to.be.at.least(10);

    // Execute P2P transfer of 1 USDC
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

    // Verify balances after transfer
    const user1Balance =
      await program.provider.connection.getTokenAccountBalance(
        user1TokenAccount,
      );
    const user2Balance =
      await program.provider.connection.getTokenAccountBalance(
        user2TokenAccount,
      );

    expect(user1Balance.value.uiAmount).to.equal(9.0);
    expect(user2Balance.value.uiAmount).to.equal(1.0);
  });

  // Only authorized signers can initiate transfers
  it("Fails p2p transfer with unauthorized signer", async () => {
    const unauthorizedSigner = anchor.web3.Keypair.generate();
    const minLamports = 100000;

    // Fund unauthorized signer
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
      console.log("Airdrop failed: ", airdropErr.message);
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

  // PDA derivation must match provided hashes
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

  // Prevents transfers with zero value
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

  // Prevents self-transfers
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

  // Validates sender has sufficient balance
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

  // Validates maximum transfer amount (u64::MAX)
  it("Handles maximum u64 transfer amount", async () => {
    const maxU64 = new BN("18446744073709551615");

    try {
      await program.methods
        .p2PTransfer(
          Array.from(user1HashBytes),
          Array.from(user2HashBytes),
          maxU64,
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
      expect(err.toString().toLowerCase()).to.include("insufficient");
    }
  });

  // Verifies wrong token account rejects transfer
  it("Fails p2p transfer with mismatched token accounts", async () => {
    const wrongTokenAccount = anchor.web3.Keypair.generate().publicKey;

    try {
      await program.methods
        .p2PTransfer(
          Array.from(user1HashBytes),
          Array.from(user2HashBytes),
          new BN(100000),
        )
        .accounts({
          tellaSigner: program.provider.publicKey,
          fromUserAccount: user1Pda,
          fromTokenAccount: wrongTokenAccount,
          toUserAccount: user2Pda,
          toTokenAccount: user2TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err).to.exist;
    }
  });

  // Verifies PDA seeds must match accounts
  it("Fails p2p transfer with wrong PDA for hash", async () => {
    const user3Id = "+9999999999_" + Date.now();
    const user3HashBytes = crypto.createHash("sha256").update(user3Id).digest();

    try {
      await program.methods
        .p2PTransfer(
          Array.from(user3HashBytes),
          Array.from(user2HashBytes),
          new BN(100000),
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

  // Tests initialization with max length hash
  it("Initializes with valid 32-byte hash", async () => {
    const maxHash = new Uint8Array(32).fill(255);

    const [userPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), maxHash],
      program.programId,
    );

    const userTokenAccount = await getAssociatedTokenAddress(
      mint,
      userPda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    const userAcc = await program.provider.connection.getAccountInfo(userPda);
    if (userAcc) {
      console.log("Max hash PDA already initialized; skipping");
      return;
    }

    await program.methods
      .initializeUser(Array.from(maxHash))
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

    const userAccount = await program.account.userAccount.fetch(userPda);
    expect(userAccount.userIdHash).to.deep.equal(Array.from(maxHash));
    expect(userAccount.bump).to.equal(bump);
    expect(userAccount.isInitialized).to.be.true;
  });

  // Tests transfer of exact balance (all funds)
  it("Transfers exact balance leaving zero", async () => {
    const userId = "+exactbalance" + Date.now();
    const userIdHashBytes = crypto.createHash("sha256").update(userId).digest();

    const [senderPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), userIdHashBytes],
      program.programId,
    );

    const senderTokenAccount = await getAssociatedTokenAddress(
      mint,
      senderPda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    await program.methods
      .initializeUser(Array.from(userIdHashBytes))
      .accounts({
        tellaSigner: program.provider.publicKey,
        userAccount: senderPda,
        userTokenAccount: senderTokenAccount,
        tokenMint: mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc({ commitment: "confirmed" });

    const providerAta = await getAssociatedTokenAddress(
      mint,
      program.provider.publicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    await transfer(
      program.provider.connection,
      program.provider.wallet.payer,
      providerAta,
      senderTokenAccount,
      program.provider.publicKey,
      5000000,
      [],
      { commitment: "confirmed" },
      TOKEN_PROGRAM_ID,
    );

    const balanceBefore =
      await program.provider.connection.getTokenAccountBalance(
        senderTokenAccount,
      );
    const exactAmount = new BN(balanceBefore.value.amount);

    await program.methods
      .p2PTransfer(
        Array.from(userIdHashBytes),
        Array.from(user2HashBytes),
        exactAmount,
      )
      .accounts({
        tellaSigner: program.provider.publicKey,
        fromUserAccount: senderPda,
        fromTokenAccount: senderTokenAccount,
        toUserAccount: user2Pda,
        toTokenAccount: user2TokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    const balanceAfter =
      await program.provider.connection.getTokenAccountBalance(
        senderTokenAccount,
      );
    expect(balanceAfter.value.uiAmount).to.equal(0);
  });

  // Tests minimum viable transfer (1 unit)
  it("Transfers minimum amount (1 unit)", async () => {
    const user1Before =
      await program.provider.connection.getTokenAccountBalance(
        user1TokenAccount,
      );
    const user2Before =
      await program.provider.connection.getTokenAccountBalance(
        user2TokenAccount,
      );

    await program.methods
      .p2PTransfer(
        Array.from(user1HashBytes),
        Array.from(user2HashBytes),
        new BN(1),
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

    const user1After =
      await program.provider.connection.getTokenAccountBalance(
        user1TokenAccount,
      );
    const user2After =
      await program.provider.connection.getTokenAccountBalance(
        user2TokenAccount,
      );

    expect(
      new BN(user1Before.value.amount).sub(new BN(user1After.value.amount)),
    ).to.deep.equal(new BN(1));
    expect(
      new BN(user2After.value.amount).sub(new BN(user2Before.value.amount)),
    ).to.deep.equal(new BN(1));
  });

  // Verifies uninitialized sender fails
  it("Fails transfer from uninitialized user", async () => {
    const uninitId = "+uninitsender" + Date.now();
    const uninitHashBytes = crypto
      .createHash("sha256")
      .update(uninitId)
      .digest();

    const [uninitPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), uninitHashBytes],
      program.programId,
    );

    const uninitTokenAccount = await getAssociatedTokenAddress(
      mint,
      uninitPda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    try {
      await program.methods
        .p2PTransfer(
          Array.from(uninitHashBytes),
          Array.from(user2HashBytes),
          new BN(100000),
        )
        .accounts({
          tellaSigner: program.provider.publicKey,
          fromUserAccount: uninitPda,
          fromTokenAccount: uninitTokenAccount,
          toUserAccount: user2Pda,
          toTokenAccount: user2TokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.toString()).to.include("AccountNotInitialized");
    }
  });

  // Verifies uninitialized recipient fails
  it("Fails transfer to uninitialized user", async () => {
    const uninitId = "+uninitrecipient" + Date.now();
    const uninitHashBytes = crypto
      .createHash("sha256")
      .update(uninitId)
      .digest();

    const [uninitPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), uninitHashBytes],
      program.programId,
    );

    const uninitTokenAccount = await getAssociatedTokenAddress(
      mint,
      uninitPda,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    try {
      await program.methods
        .p2PTransfer(
          Array.from(user1HashBytes),
          Array.from(uninitHashBytes),
          new BN(100000),
        )
        .accounts({
          tellaSigner: program.provider.publicKey,
          fromUserAccount: user1Pda,
          fromTokenAccount: user1TokenAccount,
          toUserAccount: uninitPda,
          toTokenAccount: uninitTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err) {
      expect(err.toString()).to.include("AccountNotInitialized");
    }
  });

  // Tests multiple sequential transfers
  it("Handles multiple sequential transfers", async () => {
    const initialBalance =
      await program.provider.connection.getTokenAccountBalance(
        user1TokenAccount,
      );

    for (let i = 0; i < 3; i++) {
      await program.methods
        .p2PTransfer(
          Array.from(user1HashBytes),
          Array.from(user2HashBytes),
          new BN(100000),
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
    }

    const finalBalance =
      await program.provider.connection.getTokenAccountBalance(
        user1TokenAccount,
      );

    expect(
      new BN(initialBalance.value.amount).sub(
        new BN(finalBalance.value.amount),
      ),
    ).to.deep.equal(new BN(300000));
  });
});
