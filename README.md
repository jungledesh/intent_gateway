# intent-gateway

Solana based intent-gateway to facilitate intent driven transactions

First version would capture "txt2pay" -- a P2P payments via txt msgs


#### No apps. No wallet setup. No UI. Just intent → money moved. 

Acronyms:

Txt = text message

Tella = a special mobile # for a backend service 

```
A txt B - Hey B, I’m low on money. Can you spot me 10 bucks? 
B txt A - Sure. 
B txt Tella - Send $10 bucks to <A’s mobile #> 

If wallet exists for B 
Tella txt B - Confirm, you are sending $10 to A via phone call pin entry
Tella calls B - B enters Pin
Tella txt B - Sent

If wallet does not exist for B
Tella txt B - Help link your bank to fund your wallet via [ plaid link to connect wallet to bank ] 
B txt Tella - Done
Tella txt B - Confirm, you are sending $10 to A via phone call pin entry
Tella calls B - B enters Pin
Tella txt B - Sent

If wallet exists for A
Tella txt A - B sent you $10 bucks

If wallet does not exist for A 
Tella txt A - B sent you $10, accept via linking wallet to bank [ plaid link ]
```
#### USDC Cmds

1. Create an ATA

``` 
spl-token create-account Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr \ 
  --owner hXLSiJmGbX7Npd2z3a699wPSBQWkZt44Q6v2F2v1uqz \
  --fee-payer ~/.config/solana/id.json \
  --url https://api.devnet.solana.com
```

2. Check balance
```
spl-token balance --address <ATA-Address>
```

3. Transfer USDC
```
spl-token transfer Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr 5 \                         
  <recipient-ATA-Address> \
  --fund-recipient \
  --url https://api.devnet.solana.com 
```
This transfers local wallet's ATA USDC to recipient's ATA

4. Fund local wallet USDC 
```
Visit Faucet: https://spl-token-faucet.com/?token-name=USDC-Dev
```

Connect Wallet, and selct Devnet both in Wallet and Faucet Page

Copy and Paste Wallet's Address (i.e. Public key) to fund USDC. 
Tokens go automatically to the ATA linked to account
 

Note: Tella right now uses Singh's local solana key pair as the only authZ'd pair to call & sign tx
