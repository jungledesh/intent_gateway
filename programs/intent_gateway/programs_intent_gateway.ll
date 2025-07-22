; ModuleID = 'LLVMDialectModule'
source_filename = "LLVMDialectModule"

@to_token_account = internal constant [16 x i8] c"to_token_account"
@to_user_account = internal constant [15 x i8] c"to_user_account"
@"seeds=[b\22user\22,&to_user_id_hash.as_ref()],bump=to_user_account.bump" = internal constant [67 x i8] c"seeds=[b\22user\22,&to_user_id_hash.as_ref()],bump=to_user_account.bump"
@from_token_account = internal constant [18 x i8] c"from_token_account"
@from_user_account = internal constant [17 x i8] c"from_user_account"
@"seeds=[b\22user\22,&from_user_id_hash.as_ref()],bump=from_user_account.bump" = internal constant [71 x i8] c"seeds=[b\22user\22,&from_user_id_hash.as_ref()],bump=from_user_account.bump"
@"Program<'info,System>" = internal constant [21 x i8] c"Program<'info,System>"
@"Program<'info,AssociatedToken>" = internal constant [30 x i8] c"Program<'info,AssociatedToken>"
@associated_token_program = internal constant [24 x i8] c"associated_token_program"
@"Program<'info,Token>" = internal constant [20 x i8] c"Program<'info,Token>"
@token_mint = internal constant [10 x i8] c"token_mint"
@"UncheckedAccount<'info>" = internal constant [23 x i8] c"UncheckedAccount<'info>"
@user_token_account = internal constant [18 x i8] c"user_token_account"
@"Account<'info,UserAccount>" = internal constant [26 x i8] c"Account<'info,UserAccount>"
@user_account = internal constant [12 x i8] c"user_account"
@"init_if_needed,payer=tella_signer,space=8+32+1+1,seeds=[b\22user\22,user_id_hash.as_ref()],bump" = internal constant [91 x i8] c"init_if_needed,payer=tella_signer,space=8+32+1+1,seeds=[b\22user\22,user_id_hash.as_ref()],bump"
@mut = internal constant [3 x i8] c"mut"
@"Signer<'info>" = internal constant [13 x i8] c"Signer<'info>"
@tella_signer = internal constant [12 x i8] c"tella_signer"
@bool = internal constant [4 x i8] c"bool"
@is_initialized = internal constant [14 x i8] c"is_initialized"
@u8 = internal constant [2 x i8] c"u8"
@bump = internal constant [4 x i8] c"bump"
@program_id = internal constant [10 x i8] c"program_id"
@"amount:u64" = internal constant [10 x i8] c"amount:u64"
@"to_user_id_hash:[u8;32]" = internal constant [23 x i8] c"to_user_id_hash:[u8;32]"
@"from_user_id_hash:[u8;32]" = internal constant [25 x i8] c"from_user_id_hash:[u8;32]"
@"ctx:Context<P2PTransfer>" = internal constant [24 x i8] c"ctx:Context<P2PTransfer>"
@"user_id_hash:[u8;32]" = internal constant [20 x i8] c"user_id_hash:[u8;32]"
@"ctx:Context<InitializeUser>" = internal constant [27 x i8] c"ctx:Context<InitializeUser>"
@"ctx:Context<Dummy>" = internal constant [18 x i8] c"ctx:Context<Dummy>"
@signer_seeds = internal constant [12 x i8] c"signer_seeds"
@"[&seeds[..]]" = internal constant [12 x i8] c"[&seeds[..]]"
@seeds = internal constant [5 x i8] c"seeds"
@"[b\22user\22.as_ref(),from_user_id_hash.as_ref(),&[ctx.accounts.from_user_account.bump],]" = internal constant [85 x i8] c"[b\22user\22.as_ref(),from_user_id_hash.as_ref(),&[ctx.accounts.from_user_account.bump],]"
@ctx.accounts.from_user_account = internal constant [30 x i8] c"ctx.accounts.from_user_account"
@to = internal constant [2 x i8] c"to"
@ctx.accounts.to_token_account = internal constant [29 x i8] c"ctx.accounts.to_token_account"
@from = internal constant [4 x i8] c"from"
@ctx.accounts.from_token_account = internal constant [31 x i8] c"ctx.accounts.from_token_account"
@"0" = internal constant [1 x i8] c"0"
@ctx.accounts.to_user_account.user_id_hash = internal constant [41 x i8] c"ctx.accounts.to_user_account.user_id_hash"
@ctx.accounts.from_user_account.user_id_hash = internal constant [43 x i8] c"ctx.accounts.from_user_account.user_id_hash"
@u64 = internal constant [3 x i8] c"u64"
@amount = internal constant [6 x i8] c"amount"
@to_user_id_hash = internal constant [15 x i8] c"to_user_id_hash"
@from_user_id_hash = internal constant [17 x i8] c"from_user_id_hash"
@"Context<P2PTransfer>" = internal constant [20 x i8] c"Context<P2PTransfer>"
@"ErrorCode::SelfTransferNotAllowed" = internal constant [33 x i8] c"ErrorCode::SelfTransferNotAllowed"
@"ErrorCode::InvalidAmount" = internal constant [24 x i8] c"ErrorCode::InvalidAmount"
@"ErrorCode::InvalidAccountData" = internal constant [29 x i8] c"ErrorCode::InvalidAccountData"
@cpi_ctx = internal constant [7 x i8] c"cpi_ctx"
@cpi_program = internal constant [11 x i8] c"cpi_program"
@ctx.accounts.associated_token_program = internal constant [37 x i8] c"ctx.accounts.associated_token_program"
@cpi_accounts = internal constant [12 x i8] c"cpi_accounts"
@token_program = internal constant [13 x i8] c"token_program"
@ctx.accounts.token_program = internal constant [26 x i8] c"ctx.accounts.token_program"
@system_program = internal constant [14 x i8] c"system_program"
@ctx.accounts.system_program = internal constant [27 x i8] c"ctx.accounts.system_program"
@mint = internal constant [4 x i8] c"mint"
@authority = internal constant [9 x i8] c"authority"
@associated_token = internal constant [16 x i8] c"associated_token"
@payer = internal constant [5 x i8] c"payer"
@ctx.accounts.user_token_account = internal constant [31 x i8] c"ctx.accounts.user_token_account"
@expected_ata = internal constant [12 x i8] c"expected_ata"
@ctx.accounts.token_mint = internal constant [23 x i8] c"ctx.accounts.token_mint"
@ctx.accounts.user_account = internal constant [25 x i8] c"ctx.accounts.user_account"
@true = internal constant [4 x i8] c"true"
@ctx.accounts.user_account.bump = internal constant [30 x i8] c"ctx.accounts.user_account.bump"
@ctx.bumps.user_account = internal constant [22 x i8] c"ctx.bumps.user_account"
@ctx.accounts.user_account.user_id_hash = internal constant [38 x i8] c"ctx.accounts.user_account.user_id_hash"
@ctx.accounts.user_account.is_initialized = internal constant [40 x i8] c"ctx.accounts.user_account.is_initialized"
@"[u8;32]" = internal constant [7 x i8] c"[u8;32]"
@user_id_hash = internal constant [12 x i8] c"user_id_hash"
@"Context<InitializeUser>" = internal constant [23 x i8] c"Context<InitializeUser>"
@"ErrorCode::InvalidTokenAccount" = internal constant [30 x i8] c"ErrorCode::InvalidTokenAccount"
@"ErrorCode::AlreadyInitialized" = internal constant [29 x i8] c"ErrorCode::AlreadyInitialized"
@"()" = internal constant [2 x i8] c"()"
@TELLA_PUBKEY = internal constant [12 x i8] c"TELLA_PUBKEY"
@ctx.accounts.tella_signer = internal constant [25 x i8] c"ctx.accounts.tella_signer"
@"Context<Dummy>" = internal constant [14 x i8] c"Context<Dummy>"
@ctx = internal constant [3 x i8] c"ctx"
@"ErrorCode::Unauthorized" = internal constant [23 x i8] c"ErrorCode::Unauthorized"
@"*i8" = internal constant [3 x i8] c"*i8"
@parser.error = internal constant [12 x i8] c"parser.error"
@"6mRsosPgBPjRgAxpvX4qZnJjchWSJmbqJYYJLM4sKRXz" = internal constant [44 x i8] c"6mRsosPgBPjRgAxpvX4qZnJjchWSJmbqJYYJLM4sKRXz"
@dependencies.anchor-spl.version = internal constant [31 x i8] c"dependencies.anchor-spl.version"
@"0.31.1" = internal constant [6 x i8] c"0.31.1"
@dependencies.anchor-lang.version = internal constant [32 x i8] c"dependencies.anchor-lang.version"

declare i8* @malloc(i64)

declare void @free(i8*)

declare i8* @sol.model.struct.constraint(i8*)

declare i8* @sol.model.struct.field(i8*, i8*)

declare i8* @sol.p2p_transfer.4(i8*, i8*, i8*, i8*)

declare i8* @sol.initialize_user.2(i8*, i8*)

declare i8* @sol.dummy.1(i8*)

declare i8* @"sol.anchor_spl::token::transfer.2"(i8*, i8*)

declare i8* @"sol.CpiContext::new_with_signer.3"(i8*, i8*, i8*)

declare i8* @"sol.model.struct.new.anchor_spl::token::Transfer.3"(i8*, i8*, i8*)

declare i8* @"sol.lib::p2p_transfer.anon.5"(i8*)

declare i8* @"sol.lib::p2p_transfer.anon.4"(i8*)

declare i8* @"sol.=="(i8*, i8*)

declare i8* @"sol.lib::p2p_transfer.anon.3"(i8*)

declare i8* @"sol.lib::p2p_transfer.anon.2"(i8*)

declare i8* @"sol.lib::p2p_transfer.anon.1"(i8*)

declare i8* @"sol.anchor_spl::associated_token::create.1"(i8*)

declare i8* @"sol.CpiContext::new.2"(i8*, i8*)

declare i8* @"sol.model.struct.new.anchor_spl::associated_token::Create.6"(i8*, i8*, i8*, i8*, i8*, i8*)

declare i8* @sol.to_account_info.1(i8*)

declare i8* @"sol.lib::initialize_user.anon.3"(i8*)

declare i8* @sol.get_associated_token_address.2(i8*, i8*)

declare void @sol.model.opaqueAssign(i8*, i8*)

declare i8* @"sol.lib::initialize_user.anon.2"(i8*)

declare i8* @"sol.lib::initialize_user.anon.1"(i8*)

declare i8* @sol.Ok.1(i8*)

declare i8* @sol.ifTrue.anon.(i8*)

declare i8* @"sol.lib::dummy.anon.1"(i8*)

declare i8* @sol.if(i8*)

declare i8* @"sol.!="(i8*, i8*)

declare i8* @sol.key.1(i8*)

declare i8* @sol.return.1(i8*)

declare i8* @sol.Err.1(i8*)

declare i8* @sol.into.1(i8*)

declare i8* @sol.model.funcArg(i8*, i8*)

declare i8* @sol.model.declare_id(i8*)

declare i8* @sol.model.toml(i8*, i8*)

define i64 @sol.model.cargo.toml(i8* %0) !dbg !3 {
  %2 = call i8* @sol.model.toml(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @dependencies.anchor-lang.version, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @"0.31.1", i64 0, i64 0)), !dbg !7
  %3 = call i8* @sol.model.toml(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @dependencies.anchor-spl.version, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @"0.31.1", i64 0, i64 0)), !dbg !7
  ret i64 0, !dbg !10
}

define i64 @sol.model.declare_id.address(i8* %0) !dbg !12 {
  %2 = call i8* @sol.model.declare_id(i8* getelementptr inbounds ([44 x i8], [44 x i8]* @"6mRsosPgBPjRgAxpvX4qZnJjchWSJmbqJYYJLM4sKRXz", i64 0, i64 0)), !dbg !13
  ret i64 0, !dbg !16
}

define i8* @"lib::dummy.anon.1"(i8* %0) !dbg !18 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !20
  %3 = call i8* @sol.into.1(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"ErrorCode::Unauthorized", i64 0, i64 0)), !dbg !22
  %4 = call i8* @sol.Err.1(i8* %3), !dbg !23
  %5 = call i8* @sol.return.1(i8* %4), !dbg !24
  ret i8* %0, !dbg !20
}

define i8* @"lib::dummy.1"(i8* %0) !dbg !25 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @"Context<Dummy>", i64 0, i64 0)), !dbg !26
  %3 = call i8* @sol.key.1(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.tella_signer, i64 0, i64 0)), !dbg !28
  %4 = call i8* @"sol.!="(i8* %3, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @TELLA_PUBKEY, i64 0, i64 0)), !dbg !29
  %5 = call i8* @sol.if(i8* %4), !dbg !30
  %6 = call i8* @"sol.lib::dummy.anon.1"(i8* %5), !dbg !31
  %7 = call i8* @sol.ifTrue.anon.(i8* %6), !dbg !31
  %8 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !32
  ret i8* %0, !dbg !26
}

define i8* @"lib::initialize_user.anon.1"(i8* %0) !dbg !33 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !34
  %3 = call i8* @sol.into.1(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"ErrorCode::Unauthorized", i64 0, i64 0)), !dbg !36
  %4 = call i8* @sol.Err.1(i8* %3), !dbg !37
  %5 = call i8* @sol.return.1(i8* %4), !dbg !38
  ret i8* %0, !dbg !34
}

define i8* @"lib::initialize_user.anon.2"(i8* %0) !dbg !39 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !40
  %3 = call i8* @sol.into.1(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"ErrorCode::AlreadyInitialized", i64 0, i64 0)), !dbg !42
  %4 = call i8* @sol.Err.1(i8* %3), !dbg !43
  %5 = call i8* @sol.return.1(i8* %4), !dbg !44
  ret i8* %0, !dbg !40
}

define i8* @"lib::initialize_user.anon.3"(i8* %0) !dbg !45 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !46
  %3 = call i8* @sol.into.1(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"ErrorCode::InvalidTokenAccount", i64 0, i64 0)), !dbg !48
  %4 = call i8* @sol.Err.1(i8* %3), !dbg !49
  %5 = call i8* @sol.return.1(i8* %4), !dbg !50
  ret i8* %0, !dbg !46
}

define i8* @"lib::initialize_user.2"(i8* %0, i8* %1) !dbg !51 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"Context<InitializeUser>", i64 0, i64 0)), !dbg !52
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @user_id_hash, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u8;32]", i64 0, i64 0)), !dbg !52
  %5 = call i8* @sol.key.1(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.tella_signer, i64 0, i64 0)), !dbg !54
  %6 = call i8* @"sol.!="(i8* %5, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @TELLA_PUBKEY, i64 0, i64 0)), !dbg !55
  %7 = call i8* @sol.if(i8* %6), !dbg !56
  %8 = call i8* @"sol.lib::initialize_user.anon.1"(i8* %7), !dbg !57
  %9 = call i8* @sol.ifTrue.anon.(i8* %8), !dbg !57
  %10 = call i8* @sol.if(i8* getelementptr inbounds ([40 x i8], [40 x i8]* @ctx.accounts.user_account.is_initialized, i64 0, i64 0)), !dbg !58
  %11 = call i8* @"sol.lib::initialize_user.anon.2"(i8* %10), !dbg !59
  %12 = call i8* @sol.ifTrue.anon.(i8* %11), !dbg !59
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([38 x i8], [38 x i8]* @ctx.accounts.user_account.user_id_hash, i64 0, i64 0), i8* %1), !dbg !60
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @ctx.accounts.user_account.bump, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.bumps.user_account, i64 0, i64 0)), !dbg !61
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([40 x i8], [40 x i8]* @ctx.accounts.user_account.is_initialized, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !62
  %13 = call i8* @sol.key.1(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.user_account, i64 0, i64 0)), !dbg !63
  %14 = call i8* @sol.key.1(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @ctx.accounts.token_mint, i64 0, i64 0)), !dbg !64
  %15 = call i8* @sol.get_associated_token_address.2(i8* %13, i8* %14), !dbg !65
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @expected_ata, i64 0, i64 0), i8* %15), !dbg !66
  %16 = call i8* @sol.key.1(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @ctx.accounts.user_token_account, i64 0, i64 0)), !dbg !67
  %17 = call i8* @"sol.!="(i8* %16, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @expected_ata, i64 0, i64 0)), !dbg !68
  %18 = call i8* @sol.if(i8* %17), !dbg !69
  %19 = call i8* @"sol.lib::initialize_user.anon.3"(i8* %18), !dbg !70
  %20 = call i8* @sol.ifTrue.anon.(i8* %19), !dbg !70
  %21 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.tella_signer, i64 0, i64 0)), !dbg !71
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @payer, i64 0, i64 0), i8* %21), !dbg !72
  %22 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @ctx.accounts.user_token_account, i64 0, i64 0)), !dbg !73
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @associated_token, i64 0, i64 0), i8* %22), !dbg !74
  %23 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.user_account, i64 0, i64 0)), !dbg !75
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %23), !dbg !76
  %24 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @ctx.accounts.token_mint, i64 0, i64 0)), !dbg !77
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %24), !dbg !78
  %25 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.system_program, i64 0, i64 0)), !dbg !79
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* %25), !dbg !80
  %26 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !81
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* %26), !dbg !82
  %27 = call i8* @"sol.model.struct.new.anchor_spl::associated_token::Create.6"(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @payer, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @associated_token, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0)), !dbg !83
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* %27), !dbg !84
  %28 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @ctx.accounts.associated_token_program, i64 0, i64 0)), !dbg !85
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @cpi_program, i64 0, i64 0), i8* %28), !dbg !86
  %29 = call i8* @"sol.CpiContext::new.2"(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @cpi_program, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0)), !dbg !87
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %29), !dbg !88
  %30 = call i8* @"sol.anchor_spl::associated_token::create.1"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0)), !dbg !89
  %31 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !90
  ret i8* %0, !dbg !52
}

define i8* @"lib::p2p_transfer.anon.1"(i8* %0) !dbg !91 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !92
  %3 = call i8* @sol.into.1(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"ErrorCode::Unauthorized", i64 0, i64 0)), !dbg !94
  %4 = call i8* @sol.Err.1(i8* %3), !dbg !95
  %5 = call i8* @sol.return.1(i8* %4), !dbg !96
  ret i8* %0, !dbg !92
}

define i8* @"lib::p2p_transfer.anon.2"(i8* %0) !dbg !97 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !98
  %3 = call i8* @sol.into.1(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"ErrorCode::InvalidAccountData", i64 0, i64 0)), !dbg !100
  %4 = call i8* @sol.Err.1(i8* %3), !dbg !101
  %5 = call i8* @sol.return.1(i8* %4), !dbg !102
  ret i8* %0, !dbg !98
}

define i8* @"lib::p2p_transfer.anon.3"(i8* %0) !dbg !103 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !104
  %3 = call i8* @sol.into.1(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"ErrorCode::InvalidAccountData", i64 0, i64 0)), !dbg !106
  %4 = call i8* @sol.Err.1(i8* %3), !dbg !107
  %5 = call i8* @sol.return.1(i8* %4), !dbg !108
  ret i8* %0, !dbg !104
}

define i8* @"lib::p2p_transfer.anon.4"(i8* %0) !dbg !109 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !110
  %3 = call i8* @sol.into.1(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"ErrorCode::InvalidAmount", i64 0, i64 0)), !dbg !112
  %4 = call i8* @sol.Err.1(i8* %3), !dbg !113
  %5 = call i8* @sol.return.1(i8* %4), !dbg !114
  ret i8* %0, !dbg !110
}

define i8* @"lib::p2p_transfer.anon.5"(i8* %0) !dbg !115 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !116
  %3 = call i8* @sol.into.1(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"ErrorCode::SelfTransferNotAllowed", i64 0, i64 0)), !dbg !118
  %4 = call i8* @sol.Err.1(i8* %3), !dbg !119
  %5 = call i8* @sol.return.1(i8* %4), !dbg !120
  ret i8* %0, !dbg !116
}

define i8* @"lib::p2p_transfer.4"(i8* %0, i8* %1, i8* %2, i8* %3) !dbg !121 {
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"Context<P2PTransfer>", i64 0, i64 0)), !dbg !122
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @from_user_id_hash, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u8;32]", i64 0, i64 0)), !dbg !122
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @to_user_id_hash, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u8;32]", i64 0, i64 0)), !dbg !122
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !122
  %9 = call i8* @sol.key.1(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.tella_signer, i64 0, i64 0)), !dbg !124
  %10 = call i8* @"sol.!="(i8* %9, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @TELLA_PUBKEY, i64 0, i64 0)), !dbg !125
  %11 = call i8* @sol.if(i8* %10), !dbg !126
  %12 = call i8* @"sol.lib::p2p_transfer.anon.1"(i8* %11), !dbg !127
  %13 = call i8* @sol.ifTrue.anon.(i8* %12), !dbg !127
  %14 = call i8* @"sol.!="(i8* getelementptr inbounds ([43 x i8], [43 x i8]* @ctx.accounts.from_user_account.user_id_hash, i64 0, i64 0), i8* %1), !dbg !128
  %15 = call i8* @sol.if(i8* %14), !dbg !129
  %16 = call i8* @"sol.lib::p2p_transfer.anon.2"(i8* %15), !dbg !130
  %17 = call i8* @sol.ifTrue.anon.(i8* %16), !dbg !130
  %18 = call i8* @"sol.!="(i8* getelementptr inbounds ([41 x i8], [41 x i8]* @ctx.accounts.to_user_account.user_id_hash, i64 0, i64 0), i8* %2), !dbg !131
  %19 = call i8* @sol.if(i8* %18), !dbg !132
  %20 = call i8* @"sol.lib::p2p_transfer.anon.3"(i8* %19), !dbg !133
  %21 = call i8* @sol.ifTrue.anon.(i8* %20), !dbg !133
  %22 = call i8* @"sol.=="(i8* %3, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !134
  %23 = call i8* @sol.if(i8* %22), !dbg !135
  %24 = call i8* @"sol.lib::p2p_transfer.anon.4"(i8* %23), !dbg !136
  %25 = call i8* @sol.ifTrue.anon.(i8* %24), !dbg !136
  %26 = call i8* @"sol.=="(i8* %1, i8* %2), !dbg !137
  %27 = call i8* @sol.if(i8* %26), !dbg !138
  %28 = call i8* @"sol.lib::p2p_transfer.anon.5"(i8* %27), !dbg !139
  %29 = call i8* @sol.ifTrue.anon.(i8* %28), !dbg !139
  %30 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @ctx.accounts.from_token_account, i64 0, i64 0)), !dbg !140
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* %30), !dbg !141
  %31 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @ctx.accounts.to_token_account, i64 0, i64 0)), !dbg !142
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %31), !dbg !143
  %32 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @ctx.accounts.from_user_account, i64 0, i64 0)), !dbg !144
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %32), !dbg !145
  %33 = call i8* @"sol.model.struct.new.anchor_spl::token::Transfer.3"(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0)), !dbg !146
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* %33), !dbg !147
  %34 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !148
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @cpi_program, i64 0, i64 0), i8* %34), !dbg !149
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @seeds, i64 0, i64 0), i8* getelementptr inbounds ([85 x i8], [85 x i8]* @"[b\22user\22.as_ref(),from_user_id_hash.as_ref(),&[ctx.accounts.from_user_account.bump],]", i64 0, i64 0)), !dbg !150
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @"[&seeds[..]]", i64 0, i64 0)), !dbg !151
  %35 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @cpi_program, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !152
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %35), !dbg !153
  %36 = call i8* @"sol.anchor_spl::token::transfer.2"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %3), !dbg !154
  %37 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !155
  ret i8* %0, !dbg !122
}

define i8* @sol.model.anchor.program.intent_gateway(i8* %0) !dbg !156 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !157
  %3 = call i8* @sol.dummy.1(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"ctx:Context<Dummy>", i64 0, i64 0)), !dbg !159
  %4 = call i8* @sol.initialize_user.2(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"ctx:Context<InitializeUser>", i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"user_id_hash:[u8;32]", i64 0, i64 0)), !dbg !160
  %5 = call i8* @sol.p2p_transfer.4(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"ctx:Context<P2PTransfer>", i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"from_user_id_hash:[u8;32]", i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"to_user_id_hash:[u8;32]", i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @"amount:u64", i64 0, i64 0)), !dbg !161
  ret i8* %0, !dbg !157
}

define i8* @main(i8* %0) !dbg !162 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !163
  %3 = call i8* @sol.model.anchor.program.intent_gateway(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @program_id, i64 0, i64 0)), !dbg !163
  ret i8* %0, !dbg !163
}

define i8* @sol.model.struct.anchor.UserAccount(i8* %0) !dbg !165 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !166
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @user_id_hash, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u8;32]", i64 0, i64 0)), !dbg !168
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !169
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @is_initialized, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !170
  ret i8* %0, !dbg !166
}

define i8* @sol.model.struct.anchor.Dummy(i8* %0) !dbg !171 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !172
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @tella_signer, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !174
  ret i8* %0, !dbg !172
}

define i8* @sol.model.struct.anchor.InitializeUser(i8* %0) !dbg !175 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !176
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !178
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @tella_signer, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !179
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([91 x i8], [91 x i8]* @"init_if_needed,payer=tella_signer,space=8+32+1+1,seeds=[b\22user\22,user_id_hash.as_ref()],bump", i64 0, i64 0)), !dbg !180
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @user_account, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,UserAccount>", i64 0, i64 0)), !dbg !181
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !182
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @user_token_account, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !183
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @token_mint, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !184
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"Program<'info,Token>", i64 0, i64 0)), !dbg !185
  %11 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @associated_token_program, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"Program<'info,AssociatedToken>", i64 0, i64 0)), !dbg !186
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !187
  ret i8* %0, !dbg !176
}

define i8* @sol.model.struct.anchor.P2PTransfer(i8* %0) !dbg !188 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !189
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !191
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @tella_signer, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !192
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([71 x i8], [71 x i8]* @"seeds=[b\22user\22,&from_user_id_hash.as_ref()],bump=from_user_account.bump", i64 0, i64 0)), !dbg !193
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @from_user_account, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,UserAccount>", i64 0, i64 0)), !dbg !194
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !195
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @from_token_account, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !196
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([67 x i8], [67 x i8]* @"seeds=[b\22user\22,&to_user_id_hash.as_ref()],bump=to_user_account.bump", i64 0, i64 0)), !dbg !197
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @to_user_account, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,UserAccount>", i64 0, i64 0)), !dbg !198
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !199
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @to_token_account, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !200
  %13 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"Program<'info,Token>", i64 0, i64 0)), !dbg !201
  ret i8* %0, !dbg !189
}

!llvm.dbg.cu = !{!0}
!llvm.module.flags = !{!2}

!0 = distinct !DICompileUnit(language: DW_LANG_C, file: !1, producer: "mlir", isOptimized: true, runtimeVersion: 0, emissionKind: FullDebug)
!1 = !DIFile(filename: "LLVMDialectModule", directory: "/")
!2 = !{i32 2, !"Debug Info Version", i32 3}
!3 = distinct !DISubprogram(name: "sol.model.cargo.toml", linkageName: "sol.model.cargo.toml", scope: null, file: !4, type: !5, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!4 = !DIFile(filename: "programs/intent_gateway/Xargo.toml", directory: "/workspace")
!5 = !DISubroutineType(types: !6)
!6 = !{}
!7 = !DILocation(line: 0, scope: !8)
!8 = !DILexicalBlockFile(scope: !3, file: !9, discriminator: 0)
!9 = !DIFile(filename: "Cargo.toml", directory: "/workspace")
!10 = !DILocation(line: 0, scope: !11)
!11 = !DILexicalBlockFile(scope: !3, file: !4, discriminator: 0)
!12 = distinct !DISubprogram(name: "sol.model.declare_id.address", linkageName: "sol.model.declare_id.address", scope: null, file: !4, type: !5, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!13 = !DILocation(line: 0, scope: !14)
!14 = !DILexicalBlockFile(scope: !12, file: !15, discriminator: 0)
!15 = !DIFile(filename: "lib.rs", directory: "/workspace")
!16 = !DILocation(line: 0, scope: !17)
!17 = !DILexicalBlockFile(scope: !12, file: !4, discriminator: 0)
!18 = distinct !DISubprogram(name: "lib::dummy.anon.1", linkageName: "lib::dummy.anon.1", scope: null, file: !19, line: 17, type: !5, scopeLine: 17, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!19 = !DIFile(filename: "programs/intent_gateway/src/lib.rs", directory: "/workspace")
!20 = !DILocation(line: 17, column: 59, scope: !21)
!21 = !DILexicalBlockFile(scope: !18, file: !19, discriminator: 0)
!22 = !DILocation(line: 18, column: 47, scope: !21)
!23 = !DILocation(line: 18, column: 19, scope: !21)
!24 = !DILocation(line: 18, column: 12, scope: !21)
!25 = distinct !DISubprogram(name: "lib::dummy.1", linkageName: "lib::dummy.1", scope: null, file: !19, line: 15, type: !5, scopeLine: 15, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!26 = !DILocation(line: 15, column: 8, scope: !27)
!27 = !DILexicalBlockFile(scope: !25, file: !19, discriminator: 0)
!28 = !DILocation(line: 17, column: 37, scope: !27)
!29 = !DILocation(line: 17, column: 11, scope: !27)
!30 = !DILocation(line: 17, column: 8, scope: !27)
!31 = !DILocation(line: 17, column: 59, scope: !27)
!32 = !DILocation(line: 20, column: 8, scope: !27)
!33 = distinct !DISubprogram(name: "lib::initialize_user.anon.1", linkageName: "lib::initialize_user.anon.1", scope: null, file: !19, line: 25, type: !5, scopeLine: 25, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!34 = !DILocation(line: 25, column: 59, scope: !35)
!35 = !DILexicalBlockFile(scope: !33, file: !19, discriminator: 0)
!36 = !DILocation(line: 26, column: 47, scope: !35)
!37 = !DILocation(line: 26, column: 19, scope: !35)
!38 = !DILocation(line: 26, column: 12, scope: !35)
!39 = distinct !DISubprogram(name: "lib::initialize_user.anon.2", linkageName: "lib::initialize_user.anon.2", scope: null, file: !19, line: 29, type: !5, scopeLine: 29, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!40 = !DILocation(line: 29, column: 52, scope: !41)
!41 = !DILexicalBlockFile(scope: !39, file: !19, discriminator: 0)
!42 = !DILocation(line: 31, column: 53, scope: !41)
!43 = !DILocation(line: 31, column: 19, scope: !41)
!44 = !DILocation(line: 31, column: 12, scope: !41)
!45 = distinct !DISubprogram(name: "lib::initialize_user.anon.3", linkageName: "lib::initialize_user.anon.3", scope: null, file: !19, line: 43, type: !5, scopeLine: 43, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!46 = !DILocation(line: 43, column: 65, scope: !47)
!47 = !DILexicalBlockFile(scope: !45, file: !19, discriminator: 0)
!48 = !DILocation(line: 44, column: 54, scope: !47)
!49 = !DILocation(line: 44, column: 19, scope: !47)
!50 = !DILocation(line: 44, column: 12, scope: !47)
!51 = distinct !DISubprogram(name: "lib::initialize_user.2", linkageName: "lib::initialize_user.2", scope: null, file: !19, line: 24, type: !5, scopeLine: 24, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!52 = !DILocation(line: 24, column: 8, scope: !53)
!53 = !DILexicalBlockFile(scope: !51, file: !19, discriminator: 0)
!54 = !DILocation(line: 25, column: 37, scope: !53)
!55 = !DILocation(line: 25, column: 11, scope: !53)
!56 = !DILocation(line: 25, column: 8, scope: !53)
!57 = !DILocation(line: 25, column: 59, scope: !53)
!58 = !DILocation(line: 29, column: 8, scope: !53)
!59 = !DILocation(line: 29, column: 52, scope: !53)
!60 = !DILocation(line: 34, column: 8, scope: !53)
!61 = !DILocation(line: 35, column: 8, scope: !53)
!62 = !DILocation(line: 36, column: 8, scope: !53)
!63 = !DILocation(line: 40, column: 39, scope: !53)
!64 = !DILocation(line: 41, column: 37, scope: !53)
!65 = !DILocation(line: 39, column: 27, scope: !53)
!66 = !DILocation(line: 39, column: 8, scope: !53)
!67 = !DILocation(line: 43, column: 43, scope: !53)
!68 = !DILocation(line: 43, column: 11, scope: !53)
!69 = !DILocation(line: 43, column: 8, scope: !53)
!70 = !DILocation(line: 43, column: 65, scope: !53)
!71 = !DILocation(line: 49, column: 45, scope: !53)
!72 = !DILocation(line: 49, column: 12, scope: !53)
!73 = !DILocation(line: 50, column: 62, scope: !53)
!74 = !DILocation(line: 50, column: 12, scope: !53)
!75 = !DILocation(line: 51, column: 49, scope: !53)
!76 = !DILocation(line: 51, column: 12, scope: !53)
!77 = !DILocation(line: 52, column: 42, scope: !53)
!78 = !DILocation(line: 52, column: 12, scope: !53)
!79 = !DILocation(line: 53, column: 56, scope: !53)
!80 = !DILocation(line: 53, column: 12, scope: !53)
!81 = !DILocation(line: 54, column: 54, scope: !53)
!82 = !DILocation(line: 54, column: 12, scope: !53)
!83 = !DILocation(line: 48, column: 27, scope: !53)
!84 = !DILocation(line: 48, column: 8, scope: !53)
!85 = !DILocation(line: 57, column: 64, scope: !53)
!86 = !DILocation(line: 57, column: 8, scope: !53)
!87 = !DILocation(line: 58, column: 22, scope: !53)
!88 = !DILocation(line: 58, column: 8, scope: !53)
!89 = !DILocation(line: 59, column: 8, scope: !53)
!90 = !DILocation(line: 61, column: 8, scope: !53)
!91 = distinct !DISubprogram(name: "lib::p2p_transfer.anon.1", linkageName: "lib::p2p_transfer.anon.1", scope: null, file: !19, line: 72, type: !5, scopeLine: 72, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!92 = !DILocation(line: 72, column: 59, scope: !93)
!93 = !DILexicalBlockFile(scope: !91, file: !19, discriminator: 0)
!94 = !DILocation(line: 73, column: 47, scope: !93)
!95 = !DILocation(line: 73, column: 19, scope: !93)
!96 = !DILocation(line: 73, column: 12, scope: !93)
!97 = distinct !DISubprogram(name: "lib::p2p_transfer.anon.2", linkageName: "lib::p2p_transfer.anon.2", scope: null, file: !19, line: 77, type: !5, scopeLine: 77, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!98 = !DILocation(line: 77, column: 76, scope: !99)
!99 = !DILexicalBlockFile(scope: !97, file: !19, discriminator: 0)
!100 = !DILocation(line: 78, column: 53, scope: !99)
!101 = !DILocation(line: 78, column: 19, scope: !99)
!102 = !DILocation(line: 78, column: 12, scope: !99)
!103 = distinct !DISubprogram(name: "lib::p2p_transfer.anon.3", linkageName: "lib::p2p_transfer.anon.3", scope: null, file: !19, line: 80, type: !5, scopeLine: 80, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!104 = !DILocation(line: 80, column: 72, scope: !105)
!105 = !DILexicalBlockFile(scope: !103, file: !19, discriminator: 0)
!106 = !DILocation(line: 81, column: 53, scope: !105)
!107 = !DILocation(line: 81, column: 19, scope: !105)
!108 = !DILocation(line: 81, column: 12, scope: !105)
!109 = distinct !DISubprogram(name: "lib::p2p_transfer.anon.4", linkageName: "lib::p2p_transfer.anon.4", scope: null, file: !19, line: 85, type: !5, scopeLine: 85, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!110 = !DILocation(line: 85, column: 23, scope: !111)
!111 = !DILexicalBlockFile(scope: !109, file: !19, discriminator: 0)
!112 = !DILocation(line: 86, column: 48, scope: !111)
!113 = !DILocation(line: 86, column: 19, scope: !111)
!114 = !DILocation(line: 86, column: 12, scope: !111)
!115 = distinct !DISubprogram(name: "lib::p2p_transfer.anon.5", linkageName: "lib::p2p_transfer.anon.5", scope: null, file: !19, line: 90, type: !5, scopeLine: 90, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!116 = !DILocation(line: 90, column: 48, scope: !117)
!117 = !DILexicalBlockFile(scope: !115, file: !19, discriminator: 0)
!118 = !DILocation(line: 91, column: 57, scope: !117)
!119 = !DILocation(line: 91, column: 19, scope: !117)
!120 = !DILocation(line: 91, column: 12, scope: !117)
!121 = distinct !DISubprogram(name: "lib::p2p_transfer.4", linkageName: "lib::p2p_transfer.4", scope: null, file: !19, line: 65, type: !5, scopeLine: 65, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!122 = !DILocation(line: 65, column: 8, scope: !123)
!123 = !DILexicalBlockFile(scope: !121, file: !19, discriminator: 0)
!124 = !DILocation(line: 72, column: 37, scope: !123)
!125 = !DILocation(line: 72, column: 11, scope: !123)
!126 = !DILocation(line: 72, column: 8, scope: !123)
!127 = !DILocation(line: 72, column: 59, scope: !123)
!128 = !DILocation(line: 77, column: 11, scope: !123)
!129 = !DILocation(line: 77, column: 8, scope: !123)
!130 = !DILocation(line: 77, column: 76, scope: !123)
!131 = !DILocation(line: 80, column: 11, scope: !123)
!132 = !DILocation(line: 80, column: 8, scope: !123)
!133 = !DILocation(line: 80, column: 72, scope: !123)
!134 = !DILocation(line: 85, column: 11, scope: !123)
!135 = !DILocation(line: 85, column: 8, scope: !123)
!136 = !DILocation(line: 85, column: 23, scope: !123)
!137 = !DILocation(line: 90, column: 11, scope: !123)
!138 = !DILocation(line: 90, column: 8, scope: !123)
!139 = !DILocation(line: 90, column: 48, scope: !123)
!140 = !DILocation(line: 96, column: 50, scope: !123)
!141 = !DILocation(line: 96, column: 12, scope: !123)
!142 = !DILocation(line: 97, column: 46, scope: !123)
!143 = !DILocation(line: 97, column: 12, scope: !123)
!144 = !DILocation(line: 98, column: 54, scope: !123)
!145 = !DILocation(line: 98, column: 12, scope: !123)
!146 = !DILocation(line: 95, column: 27, scope: !123)
!147 = !DILocation(line: 95, column: 8, scope: !123)
!148 = !DILocation(line: 100, column: 53, scope: !123)
!149 = !DILocation(line: 100, column: 8, scope: !123)
!150 = !DILocation(line: 103, column: 8, scope: !123)
!151 = !DILocation(line: 108, column: 8, scope: !123)
!152 = !DILocation(line: 110, column: 22, scope: !123)
!153 = !DILocation(line: 110, column: 8, scope: !123)
!154 = !DILocation(line: 111, column: 8, scope: !123)
!155 = !DILocation(line: 113, column: 8, scope: !123)
!156 = distinct !DISubprogram(name: "sol.model.anchor.program.intent_gateway", linkageName: "sol.model.anchor.program.intent_gateway", scope: null, file: !19, line: 7, type: !5, scopeLine: 7, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!157 = !DILocation(line: 7, scope: !158)
!158 = !DILexicalBlockFile(scope: !156, file: !19, discriminator: 0)
!159 = !DILocation(line: 15, column: 4, scope: !158)
!160 = !DILocation(line: 24, column: 4, scope: !158)
!161 = !DILocation(line: 65, column: 4, scope: !158)
!162 = distinct !DISubprogram(name: "main", linkageName: "main", scope: null, file: !19, line: 7, type: !5, scopeLine: 7, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!163 = !DILocation(line: 7, scope: !164)
!164 = !DILexicalBlockFile(scope: !162, file: !19, discriminator: 0)
!165 = distinct !DISubprogram(name: "sol.model.struct.anchor.UserAccount", linkageName: "sol.model.struct.anchor.UserAccount", scope: null, file: !19, line: 118, type: !5, scopeLine: 118, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!166 = !DILocation(line: 118, column: 4, scope: !167)
!167 = !DILexicalBlockFile(scope: !165, file: !19, discriminator: 0)
!168 = !DILocation(line: 119, column: 8, scope: !167)
!169 = !DILocation(line: 120, column: 8, scope: !167)
!170 = !DILocation(line: 121, column: 8, scope: !167)
!171 = distinct !DISubprogram(name: "sol.model.struct.anchor.Dummy", linkageName: "sol.model.struct.anchor.Dummy", scope: null, file: !19, line: 125, type: !5, scopeLine: 125, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!172 = !DILocation(line: 125, column: 4, scope: !173)
!173 = !DILexicalBlockFile(scope: !171, file: !19, discriminator: 0)
!174 = !DILocation(line: 126, column: 8, scope: !173)
!175 = distinct !DISubprogram(name: "sol.model.struct.anchor.InitializeUser", linkageName: "sol.model.struct.anchor.InitializeUser", scope: null, file: !19, line: 131, type: !5, scopeLine: 131, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!176 = !DILocation(line: 131, column: 4, scope: !177)
!177 = !DILexicalBlockFile(scope: !175, file: !19, discriminator: 0)
!178 = !DILocation(line: 132, column: 6, scope: !177)
!179 = !DILocation(line: 133, column: 8, scope: !177)
!180 = !DILocation(line: 135, column: 6, scope: !177)
!181 = !DILocation(line: 142, column: 8, scope: !177)
!182 = !DILocation(line: 145, column: 6, scope: !177)
!183 = !DILocation(line: 146, column: 8, scope: !177)
!184 = !DILocation(line: 150, column: 8, scope: !177)
!185 = !DILocation(line: 152, column: 8, scope: !177)
!186 = !DILocation(line: 153, column: 8, scope: !177)
!187 = !DILocation(line: 154, column: 8, scope: !177)
!188 = distinct !DISubprogram(name: "sol.model.struct.anchor.P2PTransfer", linkageName: "sol.model.struct.anchor.P2PTransfer", scope: null, file: !19, line: 160, type: !5, scopeLine: 160, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!189 = !DILocation(line: 160, column: 4, scope: !190)
!190 = !DILexicalBlockFile(scope: !188, file: !19, discriminator: 0)
!191 = !DILocation(line: 161, column: 6, scope: !190)
!192 = !DILocation(line: 162, column: 8, scope: !190)
!193 = !DILocation(line: 164, column: 6, scope: !190)
!194 = !DILocation(line: 169, column: 8, scope: !190)
!195 = !DILocation(line: 172, column: 6, scope: !190)
!196 = !DILocation(line: 173, column: 8, scope: !190)
!197 = !DILocation(line: 175, column: 6, scope: !190)
!198 = !DILocation(line: 179, column: 8, scope: !190)
!199 = !DILocation(line: 182, column: 6, scope: !190)
!200 = !DILocation(line: 183, column: 8, scope: !190)
!201 = !DILocation(line: 185, column: 8, scope: !190)
