// Intent Gateway Program
//
// A Solana program that manages user accounts and USDC token transfers through
// Program Derived Addresses (PDAs). This program allows the authorized Tella account
// to initialize user PDAs and facilitate secure peer-to-peer USDC transfers.
//
// Key Features:
// - User PDA initialization with associated token accounts (ATAs)
// - Secure P2P USDC transfers between user PDAs
// - Authorization checks to ensure only Tella can execute operations
// - Multiple validation layers to prevent common attack vectors
//
// Security Model:
// - All operations require Tella's signature
// - PDAs are derived using user_id_hash as seed for deterministic addressing
// - Token accounts are validated to be correct ATAs
// - Protection against re-initialization, self-transfers, and account confusion

use anchor_lang::prelude::*; // Anchor's core types and macros
use anchor_spl::associated_token::get_associated_token_address;
use anchor_spl::{associated_token::AssociatedToken, token::Token};

declare_id!("4dPJxe2R42G3GMdvpxz6JC3mxpzHzqFj9f8u3YTXaY55"); // Program ID from Anchor Build
pub const USDC_MINT: Pubkey = pubkey!("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"); // SPL Token named USDC (devnet)

#[allow(deprecated)]
#[program] // Anchor's macro for defining programs
pub mod intent_gateway {
    use super::*; // Brings our program's types into scope

    pub const TELLA_PUBKEY: Pubkey = pubkey!("hXLSiJmGbX7Npd2z3a699wPSBQWkZt44Q6v2F2v1uqz"); // Tella's public key

    // A dummy instruction to test authorization
    pub fn dummy(ctx: Context<Dummy>) -> Result<()> {
        // Check caller is Tella (secure: prevents anyone from invoking)
        if ctx.accounts.tella_signer.key() != TELLA_PUBKEY {
            return Err(ErrorCode::Unauthorized.into()); // Custom error
        }
        Ok(()) // Success
    }

    // Initialize User PDA + ATA
    // Creates a Program Derived Address (PDA) for a user and their Associated Token Account (ATA)
    // This allows users to have accounts managed by the program that can hold USDC tokens
    pub fn initialize_user(ctx: Context<InitializeUser>, user_id_hash: [u8; 32]) -> Result<()> {
        // Authorization check: Only Tella can initialize user accounts
        if ctx.accounts.tella_signer.key() != TELLA_PUBKEY {
            return Err(ErrorCode::Unauthorized.into());
        }

        let user_account = &mut ctx.accounts.user_account; // Get a mutable reference to the account (so we can change it)

        // Double initialization protection: Check if account is already initialized
        if user_account.is_initialized {
            // To prevent re-init
            return Err(ErrorCode::AlreadyInitialized.into());
        }

        // Store the user's hashed ID and PDA bump seed in the account
        user_account.user_id_hash = user_id_hash;
        user_account.bump = ctx.bumps.user_account;
        user_account.is_initialized = true; // Set flag to avoid re-init attacks

        // Manual validation: Check if user_token_account is the correct ATA
        // Security: Ensures the provided token account matches the expected ATA address
        // to prevent attackers from substituting malicious token accounts
        let expected_ata = get_associated_token_address(
            &ctx.accounts.user_account.key(),
            &ctx.accounts.token_mint.key(),
        );
        if ctx.accounts.user_token_account.key() != expected_ata {
            return Err(ErrorCode::InvalidTokenAccount.into());
        }

        // Create ATA account via Cross-Program Invocation (CPI)
        // This calls the Associated Token Program to create the token account
        let cpi_accounts = anchor_spl::associated_token::Create {
            payer: ctx.accounts.tella_signer.to_account_info(), // Tella pays SOL
            associated_token: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.user_account.to_account_info(), // PDA owns
            mint: ctx.accounts.token_mint.to_account_info(),        // USDC
            system_program: ctx.accounts.system_program.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
        };

        let cpi_program = ctx.accounts.associated_token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_spl::associated_token::create(cpi_ctx)?; // Idempotent call

        Ok(())
    }

    // Transfer USDC between user PDAs (peer-to-peer transfer)
    // Securely transfers tokens from one user's ATA to another user's ATA
    // with multiple validation checks to prevent common attack vectors
    pub fn p2p_transfer(
        ctx: Context<P2PTransfer>,
        from_user_id_hash: [u8; 32],
        to_user_id_hash: [u8; 32],
        amount: u64,
    ) -> Result<()> {
        // Authorization check: Only Tella can initiate transfers
        if ctx.accounts.tella_signer.key() != TELLA_PUBKEY {
            return Err(ErrorCode::Unauthorized.into());
        }

        // Validation: Ensure the provided user ID hashes match the actual PDAs
        // This prevents account confusion attacks where wrong accounts are passed
        if ctx.accounts.from_user_account.user_id_hash != from_user_id_hash {
            return Err(ErrorCode::InvalidAccountData.into());
        }
        if ctx.accounts.to_user_account.user_id_hash != to_user_id_hash {
            return Err(ErrorCode::InvalidAccountData.into());
        }

        // Amount validation: Reject zero-value transfers (they waste resources)
        if amount == 0 {
            return Err(ErrorCode::InvalidAmount.into());
        }

        // Self-transfer prevention: Users cannot send tokens to themselves
        if from_user_id_hash == to_user_id_hash {
            return Err(ErrorCode::SelfTransferNotAllowed.into());
        }

        // Manual validation: Verify token accounts are correct ATAs
        // Security: Double-check that the source token account is the correct ATA
        // for the from_user PDA and the specified mint
        let expected_from_ata = get_associated_token_address(
            &ctx.accounts.from_user_account.key(),
            &ctx.accounts.token_mint.key(),
        );
        if ctx.accounts.from_token_account.key() != expected_from_ata {
            return Err(ErrorCode::InvalidTokenAccount.into());
        }

        // Security: Double-check that the destination token account is the correct ATA
        // for the to_user PDA and the specified mint
        let expected_to_ata = get_associated_token_address(
            &ctx.accounts.to_user_account.key(),
            &ctx.accounts.token_mint.key(),
        );
        if ctx.accounts.to_token_account.key() != expected_to_ata {
            return Err(ErrorCode::InvalidTokenAccount.into());
        }

        // Perform the token transfer via CPI to the SPL Token program
        let cpi_accounts = anchor_spl::token::Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.from_user_account.to_account_info(), // from_user PDA signs transfer
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();

        // Construct the PDA signer seeds to authorize the transfer
        // The PDA must sign using the same seeds that were used to derive it
        let seeds = &[
            b"user".as_ref(),
            from_user_id_hash.as_ref(),
            &[ctx.accounts.from_user_account.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        // Execute the CPI with PDA signing authority
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        anchor_spl::token::transfer(cpi_ctx, amount)?;

        Ok(())
    }
}

// UserAccount: On-chain data structure for storing user PDA information
// This struct represents the state stored in each user's PDA account
#[account] // This is serializable for Solana accounts (on-chain data)
pub struct UserAccount {
    pub user_id_hash: [u8; 32], // A fixed array of 32 bytes (for the SHA-256 hash—secure and compact)
    pub bump: u8, // A single byte (the PDA "bump" for validation—Solana thing to make addresses unique)
    pub is_initialized: bool, // Explicit init flag to prevent re-initialization attacks
}

// Dummy: Minimal account context for testing authorization
// Used by the dummy instruction to verify Tella can call protected functions
#[derive(Accounts)] // Macro: Defines validated accounts for instruction
pub struct Dummy<'info> {
    pub tella_signer: Signer<'info>, // Must be a signer (has private key)
}

// InitializeUser: Account validation context for user initialization
// Defines all accounts required to create a new user PDA and its token account
#[derive(Accounts)]
#[instruction(user_id_hash: [u8; 32])] // Instruction parameter needed for PDA derivation
pub struct InitializeUser<'info> {
    #[account(mut)] // Mutable (we create/pay for it)
    pub tella_signer: Signer<'info>,

    #[account(
        init_if_needed,  // Create if not exists (safe)
        payer = tella_signer,  // Tella pays SOL for creation
        space = 8 + 32 + 1 + 1,  // Size: 8 (discriminator) + 32 (hash) + 1 (bump) + is_init flag
        seeds = [b"user", user_id_hash.as_ref()],  // PDA formula (secure seed)
        bump  // Validates bump
    )]
    pub user_account: Account<'info, UserAccount>, // Ties to our struct

    /// CHECK: Validated by CPI transfer (ATA for from_user)
    #[account(mut)] // Mutable for creation + Credit & Debit balance for transfers
    pub user_token_account: UncheckedAccount<'info>,

    /// CHECK: Locked to USDC_MINT via address constraint
    #[account(address = USDC_MINT)]
    pub token_mint: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>, // Solana's built-in program for creating accounts
}

// P2PTransfer: Account validation context for peer-to-peer token transfers
// Validates both sender and receiver PDAs, their token accounts, and ensures proper authorization
// Requires both user ID hashes as instruction parameters for PDA verification
#[derive(Accounts)]
#[instruction(from_user_id_hash: [u8; 32], to_user_id_hash: [u8; 32])]
pub struct P2PTransfer<'info> {
    #[account(mut)] // Mutable (we create/pay for it)
    pub tella_signer: Signer<'info>,

    #[account(
    seeds = [b"user", &from_user_id_hash.as_ref()],
    bump = from_user_account.bump
  )]
    /// The PDA authority of from_token_account
    pub from_user_account: Account<'info, UserAccount>,

    /// CHECK: Validated by CPI transfer (ATA for from_user)
    #[account(mut)] // Mutable for debit
    pub from_token_account: UncheckedAccount<'info>, // ATA for from_user

    #[account(
    seeds = [b"user", &to_user_id_hash.as_ref()],
    bump = to_user_account.bump
  )]
    pub to_user_account: Account<'info, UserAccount>,

    /// CHECK: Validated by CPI transfer (ATA for from_user)
    #[account(mut)] // Mutable for credit
    pub to_token_account: UncheckedAccount<'info>, // ATA for to_user

    /// CHECK: Locked to USDC_MINT via address constraint
    #[account(address = USDC_MINT)] // For devnet
    pub token_mint: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>, // SPL token program
}

// ErrorCode: Custom error codes for program-specific failures
// These provide clear, actionable error messages when operations fail
// Each error corresponds to a specific validation or security check
#[error_code] // Macro: Defines program errors
pub enum ErrorCode {
    #[msg("Unauthorized caller")]
    Unauthorized, // Caller is not Tella
    #[msg("Account already initialized")]
    AlreadyInitialized, // Attempt to re-initialize an existing user account
    #[msg("Invalid account data")]
    InvalidAccountData, // User ID hash mismatch with PDA
    #[msg("Invalid token account (must be ATA)")]
    InvalidTokenAccount, // Token account is not the correct ATA
    #[msg("Invalid transfer amount (must be > 0)")]
    InvalidAmount, // Transfer amount is zero
    #[msg("Self-transfer not allowed")]
    SelfTransferNotAllowed, // Attempt to transfer tokens to the same user
}
