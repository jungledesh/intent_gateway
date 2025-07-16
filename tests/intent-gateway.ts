import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { IntentGateway } from "../target/types/intent_gateway";

describe("intent-gateway", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.intentGateway as Program<IntentGateway>;

  it("Calls the dummy instruction", async () => {
    await program.methods.dummy().rpc();
  });
});
