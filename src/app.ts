import dotenv from "dotenv";
dotenv.config();

import { startDiscordClient, startSlackClient } from "./clients";

console.log("single-dyno.ts");

import { World } from "./backend/world";
import { MudClient, ClientState } from "./backend/world/client";
import { instantiateInputProcessor } from "./backend/input-processor";
import { instantiateOutputProcessor } from "./backend/output-processor";
import { loadDatabase, loadWorld } from "./backend/world/loader/yaml-loader";
import { startWebClient } from "./clients";

const TICKS_PER_SECOND = 100;
const MILLISECONDS_PER_TICK = 1000 / TICKS_PER_SECOND;

async function startGameClients(world: World) {
  await Promise.all([startDiscordClient(world), startSlackClient(world)]);
  console.log("Game clients have all started.");
}

function main() {
  console.log("Loading database");
  loadDatabase();

  console.log("Instantiating new world.");
  const world = loadWorld();

  console.log("Setting up IO processors.");
  const processInput = instantiateInputProcessor(world);
  const processOutput = instantiateOutputProcessor(world);

  console.log("Starting game clients");
  startGameClients(world);

  function isIdle(client: MudClient) {
    return client.lastInput + 1000 * 60 * 5 < Date.now();
  }

  function isAFK(client: MudClient) {
    return client.lastInput + 1000 * 60 * 30 < Date.now();
  }

  function gameLoop(world: World) {
    let inLoop = false;
    let counter = 0;
    const loopTimer = setInterval(() => {
      counter++;

      // If the previous iteration is still running, then skip this iteration
      if (counter % 1000 == 0) {
        console.log(`Loop: ${world.clients.size} clients`);
      }
      if (inLoop) {
        return;
      }
      inLoop = true;

      if (counter % 1000 == 0) {
        console.log("Check input");
      }

      // Gather player input
      for (let client of world.clients.values()) {
        processInput(client);
      }

      // Update world state

      // Send player output
      for (let client of world.clients.values()) {
        processOutput(client);
      }

      // Disconnect players who are idle or in a strange state
      for (let client of world.clients.values()) {
        if (client.state < ClientState.IDLE && isIdle(client)) {
          client.state = ClientState.IDLE;
          client.send("You are now idle.");
        } else if (isAFK(client)) {
          client.send("Disconnected for being idle too long.");
          client.disconnect();
        }
      }

      inLoop = false;
    }, MILLISECONDS_PER_TICK);
  }

  console.log("Starting game loop");
  gameLoop(world);
}

main();
