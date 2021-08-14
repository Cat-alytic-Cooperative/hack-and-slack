const REDIS_URL = String(process.env.REDIS_URL);

import Queue, { ProcessCallbackFunction } from "bull";
import { WORLD, World } from "./world";
import { CommandMessage, Message } from "../shared/worker/messages";
import { Player, PlayerState } from "./world/player";
import { Client, ClientState, DiscordClient } from "./world/client";

const TICKS_PER_SECOND = 10;
const MILLISECONDS_PER_TICK = 1000 / TICKS_PER_SECOND;

function startDiscordConnectionManager() {
  const commandQueue = new Queue("command", REDIS_URL);
  const discordQueue = new Queue("discord", REDIS_URL);

  const inputProcessor: ProcessCallbackFunction<CommandMessage> = async (job) => {
    const data = job.data;
    console.log("backend: job:", job.id, job.data);
    if (!data.type) {
      return { type: "error", message: "Invalid request type" };
    }

    const clientId = data.from;
    let client = WORLD.clients.get(clientId);
    if (!client) {
      client = new DiscordClient(clientId, discordQueue);
      WORLD.clients.set(clientId, client);
    }

    client.input.add(data.original);
  };

  commandQueue.process(10, inputProcessor);
}

export function main() {
  function processLoginInput(client: Client, input: string) {
    const args = input.split(/\s+/);
    const command = args.shift()?.toLowerCase();
    switch (command) {
      case "who":
        // List the players currently connected
        break;
      case "create":
        // Create a new player
        let playerName = args.shift();
        if (!playerName) {
          return client.send(`You must provide the name for your player.`);
        }
        if (WORLD.players.getByName(playerName)) {
          return client.send(`A player named '${playerName}' already exists.`);
        }
        let player = new Player();
        client.player = player;
        player.client = client;
        player.state = PlayerState.PLAYING;
        player.room = WORLD.rooms.get(0);
        return client.send(`Welcome to the world, ${playerName}.`);
        break;
      case "connect":
        // Play an existing character
        playerName = args.shift();
        if (!playerName) {
          return client.send(`You must provide the name for your player.`);
        }
        if (!WORLD.players.getByName(playerName)) {
          return client.send(`No players named '${playerName}' exist.`);
        }
        break;
      default:
        client.send(`Unknown command '${command}'.`);
        break;
    }
  }

  function processCharacterCreationInput(client: Client, input: string) {
    const player = client.player;
    if (!player) {
      return;
    }
    console.log("Character Creation", input);
    switch (player.state) {
      case PlayerState.CREATE_NAME:
        break;
    }
  }

  function processPlayingInput(client: Client, input: string) {
    console.log("Playing", input);
    const args = input.split(/\s+/);
    const command = args.shift()?.toLowerCase();
    if (!command) {
      return client.send("Huh?");
    }
    const results = WORLD.findCommand(command);
    if (results === undefined) {
      return client.send(`Huh?`);
    } else if (Array.isArray(results)) {
      return client.send(`What do you mean? ${results.map((entry) => entry.phrase).join(", ")}`);
    } else if (results.action) {
      results.action(client.player, command, args);
    } else {
      console.error(`Command '${command}' has no corresponding action.`);
    }
  }

  function processInput(client: Client) {
    const input = client.input.get();
    if (!input) {
      return;
    }
    client.lastInput = Date.now();

    console.log(`Input from ${client.clientId}: ${input}`);
    if (!client.player) {
      // The client does not have an attached player, so only the "login" commands are
      // allowed.
      return processLoginInput(client, input);
    } else if (client.player.state !== PlayerState.PLAYING) {
      return processCharacterCreationInput(client, input);
    } else {
      return processPlayingInput(client, input);
    }
  }

  function processOutput(client: Client) {
    client.send(client.output);
  }

  function isIdle(client: Client) {
    return client.lastInput + 1000 * 60 * 5 < Date.now();
  }

  function isAFK(client: Client) {
    return client.lastInput + 1000 * 60 * 30 < Date.now();
  }

  function gameLoop() {
    let inLoop = false;
    let counter = 0;
    const loopTimer = setInterval(() => {
      counter++;

      // If the previous iteration is still running, then skip this iteration
      if (counter % 100 == 0) {
        console.log(`Loop: ${WORLD.clients.size} clients`);
      }
      if (inLoop) {
        return;
      }
      inLoop = true;

      if (counter % 100 == 0) {
        console.log("Check input");
      }

      // Gather player input
      for (let client of WORLD.clients.values()) {
        processInput(client);
      }

      // Update world state

      // Send player output
      for (let client of WORLD.clients.values()) {
        processOutput(client);
      }

      // Disconnect players who are idle or in a strange state
      for (let client of WORLD.clients.values()) {
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

  startDiscordConnectionManager();

  gameLoop();
}
