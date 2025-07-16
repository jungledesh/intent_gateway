use anchor_lang::prelude::*;

declare_id!("5D5ja8gHCXp7hWTJKMQKd1KTMib3wA8EXuke9ZDLfXAt");

#[program]
pub mod intent_gateway {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
