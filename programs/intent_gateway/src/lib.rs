use anchor_lang::prelude::*; // Anchor's core types and macros

declare_id!("9rM13srbxpfZAzoUVSgj7sKW65fHSjmoNbSi5YGMiv3q"); // Program ID from Anchor Build

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
}

#[derive(Accounts)]  // Macro: Defines validated accounts for instruction
pub struct Dummy<'info> {
    pub tella_signer: Signer<'info>,  // Must be a signer (has private key)
}

#[error_code]  // Macro: Defines program errors
pub enum ErrorCode {
    #[msg("Unauthorized caller")]
    Unauthorized,
}
