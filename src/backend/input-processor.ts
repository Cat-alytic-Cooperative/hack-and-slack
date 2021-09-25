import Queue, { ProcessCallbackFunction } from "bull";
import { CommandMessage } from "../shared/worker/messages";
import { World } from "./world";
import { Client, ClientState, DiscordClient } from "./world/client";
import { Player, PlayerState } from "./world/entities";

const REDIS_URL = String(process.env.REDIS_URL);

export function instantiateInputProcessor(world: World) {
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
      let client = world.clients.get(clientId);
      if (!client) {
        client = new DiscordClient(clientId, world, discordQueue);
        world.clients.set(clientId, client);
      }

      client.input.add(data.original);
    };

    commandQueue.process(10, inputProcessor);
  }

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
        if (world.players.getByName(playerName)) {
          return client.send(`A player named '${playerName}' already exists.`);
        }
        player = new Player();
        player.name = playerName;
        client.player = player;
        player.client = client;
        player.state = PlayerState.PLAYING;
        world.players.set(player.id, player);
        const startingRoom = world.rooms.get("starting.starting-room");
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
        player = world.players.getByName(playerName);
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
    const results = world.findCommand(command);
    if (results === undefined) {
      return client.send(`Huh?`);
    } else if (Array.isArray(results)) {
      return client.send(`Which do you mean? ${results.map((entry) => entry.phrase).join(", ")}`);
    } else if (results.action) {
      results.action({ ch: client.player, command, rest, world });
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

  startDiscordConnectionManager();

  return processInput;
}
