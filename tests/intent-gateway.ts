import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { IntentGateway } from "../target/types/intent_gateway";

describe("intent-gateway", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.intentGateway as Program<IntentGateway>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
