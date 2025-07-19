use anchor_lang::prelude::*; // Anchor's core types and macros
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Token, Transfer},
};

// Not needed for localnet
//pub const USDC_MINT: Pubkey = pubkey!("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"); // USDC devnet public key

declare_id!("6mRsosPgBPjRgAxpvX4qZnJjchWSJmbqJYYJLM4sKRXz"); // Program ID from Anchor Build

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
    pub fn initialize_user(ctx: Context<InitializeUser>, user_id_hash: [u8; 32]) -> Result<()> {
        if ctx.accounts.tella_signer.key() != TELLA_PUBKEY {
            return Err(ErrorCode::Unauthorized.into());
        }

        let user_account = &mut ctx.accounts.user_account; // Get a mutable reference to the account (so we can change it)

        if user_account.user_id_hash != [0u8; 32] {
            // To prevent re-init
            return Err(ErrorCode::AlreadyInitialized.into()); // Error if not new
        }

        user_account.user_id_hash = user_id_hash;
        user_account.bump = ctx.bumps.user_account;

        // Create ATA account
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

    // Transfer USDC b/w PDA's
    pub fn p2p_transfer(
        ctx: Context<P2PTransfer>,
        from_user_id_hash: [u8; 32],
        to_user_id_hash: [u8; 32],
        amount: u64,
    ) -> Result<()> {
        // Only Tella can call
        if ctx.accounts.tella_signer.key() != TELLA_PUBKEY {
            return Err(ErrorCode::Unauthorized.into());
        }

        // Validate hashes match PDAs
        if ctx.accounts.from_user_account.user_id_hash != from_user_id_hash {
            return Err(ErrorCode::InvalidAccountData.into());
        }
        if ctx.accounts.to_user_account.user_id_hash != to_user_id_hash {
            return Err(ErrorCode::InvalidAccountData.into());
        }

        // CPI for SPL token transfer
        let cpi_accounts = anchor_spl::token::Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.from_user_account.to_account_info(), // from_user PDA signs transfer
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();

        // Seeds for PDA signer (matches PDA derivation)
        let seeds = &[
            b"user".as_ref(),
            &from_user_id_hash.as_ref(),
            &[ctx.accounts.from_user_account.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        anchor_spl::token::transfer(cpi_ctx, amount)?;

        Ok(())
    }
}

#[account] // This is serializable for Solana accounts (on-chain data)
pub struct UserAccount {
    pub user_id_hash: [u8; 32], // A fixed array of 32 bytes (for the SHA-256 hash—secure and compact)
    pub bump: u8, // A single byte (the PDA "bump" for validation—Solana thing to make addresses unique)
}

#[derive(Accounts)] // Macro: Defines validated accounts for instruction
pub struct Dummy<'info> {
    pub tella_signer: Signer<'info>, // Must be a signer (has private key)
}

#[derive(Accounts)]
#[instruction(user_id_hash: [u8; 32])]
pub struct InitializeUser<'info> {
    #[account(mut)] // Mutable (we create/pay for it)
    pub tella_signer: Signer<'info>,

    #[account(
        init_if_needed,  // Create if not exists (safe)
        payer = tella_signer,  // Tella pays SOL for creation
        space = 8 + 32 + 1,  // Size: 8 (discriminator) + 32 (hash) + 1 (bump)
        seeds = [b"user", user_id_hash.as_ref()],  // PDA formula (secure seed)
        bump  // Validates bump
    )]
    pub user_account: Account<'info, UserAccount>, // Ties to our struct

    /// CHECK: Validated by CPI (creates ATA if not exists)
    #[account(mut)]
    pub user_token_account: UncheckedAccount<'info>,

    /// CHECK: Locked to USDC_MINT via address constraint
    //  #[account(address = USDC_MINT)] -- removing for localnet
    pub token_mint: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>, // Solana's built-in program for creating accounts
}

// Accounts for P2P transfers, validates PDAs and token accounts
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

    pub token_program: Program<'info, Token>, // SPL token program
}

#[error_code] // Macro: Defines program errors
pub enum ErrorCode {
    #[msg("Unauthorized caller")]
    Unauthorized,
    #[msg("Account already initialized")]
    AlreadyInitialized,
    #[msg("Invalid account data")]
    InvalidAccountData,
}
