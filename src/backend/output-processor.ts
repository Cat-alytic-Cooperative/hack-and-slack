import { World } from "./world";
import { MudClient } from "./world/client";

export function instantiateOutputProcessor(world: World) {
  function processOutput(client: MudClient) {
    client.send(client.output);
  }
  return processOutput;
}
