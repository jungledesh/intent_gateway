use anchor_lang::prelude::*;

declare_id!("J5mVtfBJUKqGgZMuxZwWtXGzrBMF6h2Lv2SsBqZ4bLoV");

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
