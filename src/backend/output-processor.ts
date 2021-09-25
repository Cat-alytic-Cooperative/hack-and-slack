import { World } from "./world";
import { Client } from "./world/client";

export function instantiateOutputProcessor(world: World) {
  function processOutput(client: Client) {
    client.send(client.output);
  }
  return processOutput;
}
