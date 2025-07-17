use anchor_lang::prelude::*; // Anchor's core types and macros

declare_id!("HsFzz343SCa2a3MxDzWZxoTDnbm9pW4rTLsYy9UUa1fj"); // Program ID from Anchor Build

#[program]  // Anchor's macro for defining programs
pub mod intent_gateway {
    use super::*; // Brings our program's types into scope

    pub const TELLA_PUBKEY: Pubkey = pubkey!("hXLSiJmGbX7Npd2z3a699wPSBQWkZt44Q6v2F2v1uqz");  // Tella's public key

    // A dummy instruction to test authorization
    pub fn dummy(ctx: Context<Dummy>) -> Result<()> {
        // Check caller is Tella (secure: prevents anyone from invoking)
        if ctx.accounts.tella_signer.key() != TELLA_PUBKEY {
            return Err(ErrorCode::Unauthorized.into());  // Custom error
        }
        Ok(())  // Success
    }

    pub fn initialize_user(ctx: Context<InitializeUser>, user_id_hash: [u8; 32]) -> Result<()> {
        if ctx.accounts.tella_signer.key() != TELLA_PUBKEY {
            return Err(ErrorCode::Unauthorized.into());
        }
    
        let user_account = &mut ctx.accounts.user_account;  // Get a mutable reference to the account (so we can change it)
    
        if user_account.user_id_hash != [0u8; 32] {  // Check if already set (all zeros means new)
            return Err(ErrorCode::AlreadyInitialized.into());  // Error if not new
        }
    
        user_account.user_id_hash = user_id_hash;  
        user_account.bump = ctx.bumps.user_account; 
    
        Ok(()) 
    }
}

#[account]  // This is serializable for Solana accounts (on-chain data)
pub struct UserAccount {
    pub user_id_hash: [u8; 32],  // A fixed array of 32 bytes (for the SHA-256 hash—secure and compact)
    pub bump: u8,  // A single byte (the PDA "bump" for validation—Solana thing to make addresses unique)
}

#[derive(Accounts)]  // Macro: Defines validated accounts for instruction
pub struct Dummy<'info> {
    pub tella_signer: Signer<'info>,  // Must be a signer (has private key)
}

#[derive(Accounts)]
#[instruction(user_id_hash: [u8; 32])] 
pub struct InitializeUser<'info> {
    #[account(mut)]  // Mutable (we create/pay for it)
    pub tella_signer: Signer<'info>,

    #[account(
        init_if_needed,  // Create if not exists (safe)
        payer = tella_signer,  // Tella pays SOL for creation
        space = 8 + 32 + 1,  // Size: 8 (discriminator) + 32 (hash) + 1 (bump)
        seeds = [b"user", user_id_hash.as_ref()],  // PDA formula (secure seed)
        bump  // Validates bump
    )]
    pub user_account: Account<'info, UserAccount>,  // Ties to our struct

    pub system_program: Program<'info, System>,  // Solana's built-in for creating accounts
}

#[error_code]  // Macro: Defines program errors
pub enum ErrorCode {
    #[msg("Unauthorized caller")]
    Unauthorized,
    #[msg("Account already initialized")]
    AlreadyInitialized,
}
