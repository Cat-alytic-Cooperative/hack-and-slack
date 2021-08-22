const REDIS_URL = String(process.env.REDIS_URL);

import Queue, { ProcessCallbackFunction } from "bull";
import { WORLD, World } from "./world";
import { CommandMessage, Message } from "../shared/worker/messages";
import { Player, PlayerState } from "./world/entities/player";
import { Client, ClientState, DiscordClient } from "./world/client";

const TICKS_PER_SECOND = 100;
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
    let playerName;
    let player: Player | undefined;
    switch (command) {
      case "who":
        // List the players currently connected
        break;
      case "create":
        // Create a new player
        playerName = args.shift();
        if (!playerName) {
          return client.send(`You must provide the name for your player.`);
        }
        if (WORLD.players.getByName(playerName)) {
          return client.send(`A player named '${playerName}' already exists.`);
        }
        player = new Player();
        player.name = playerName;
        client.player = player;
        player.client = client;
        player.state = PlayerState.PLAYING;
        WORLD.players.set(player.id, player);
        const startingRoom = WORLD.rooms.get(0);
        if (startingRoom) {
          player.moveTo(startingRoom);
        }
        return client.send(`Welcome to the world, ${playerName}.`);
      case "connect":
        // Play an existing character
        playerName = args.shift();
        if (!playerName) {
          return client.send(`You must provide the name for your player.`);
        }
        player = WORLD.players.getByName(playerName);
        if (!player) {
          return client.send(`No players named '${playerName}' exist.`);
        }
        client.player = player;
        player.client = client;
        player.state = PlayerState.PLAYING;
        return client.send(`Welcome back, ${player.name}`);
      case "help":
        return client.send([
          "WHO - list active players",
          "CONNECT <name> - connect as the given player attached to this client account",
          "CREATE <name> - create a new player attached to this client account",
          "HELP",
        ]);
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

  const CommandRegularExpress = /(\S+)(\s+(.*)\s*)?/;

  function processPlayingInput(client: Client, input: string) {
    if (!client.player) {
      console.error(`Client ${client} has no player, but is somehow playing.`);
      return;
    }
    console.log("Playing:", input);
    const args = input.split(/\s+/);
    const match = CommandRegularExpress.exec(input);
    console.log({ match });
    if (!match) {
      console.error(`Command '${input}' did not match pattern:`, match);
      return client.player.send(`Huh?`);
    }
    const command = match[1];
    if (!command) {
      return client.send("What do you want to do?");
    }
    const rest = match[3] || "";
    const results = WORLD.findCommand(command);
    if (results === undefined) {
      return client.send(`Huh?`);
    } else if (Array.isArray(results)) {
      return client.send(`Which do you mean? ${results.map((entry) => entry.phrase).join(", ")}`);
    } else if (results.action) {
      results.action({ ch: client.player, command, rest });
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
    if (client.state === ClientState.AFK) {
      client.send("You are no longer away from keyboard.");
    } else if (client.state === ClientState.IDLE) {
      client.send("You are no longer idle.");
    }
    client.state = ClientState.ACTIVE;

    console.log(`Input from ${client.clientId}: ${input}`);
    if (!client.player) {
      // The client does not have an attached player, so only the "login" commands are
      // allowed.
      return processLoginInput(client, input);
    } else if (client.player.state !== PlayerState.PLAYING) {
      // The Player is not playing, so this is character creation
      return processCharacterCreationInput(client, input);
    } else {
      // Playing!
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
      if (counter % 1000 == 0) {
        console.log(`Loop: ${WORLD.clients.size} clients`);
      }
      if (inLoop) {
        return;
      }
      inLoop = true;

      if (counter % 1000 == 0) {
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
