const REDIS_URL = String(process.env.REDIS_URL);

import Queue, { ProcessCallbackFunction } from "bull";
import { WORLD, World } from "./world";
import { CommandMessage, Message } from "../shared/worker/messages";
import { Player, PlayerState } from "./world/player";
import { Client, DiscordClient } from "./world/client";

const TICKS_PER_SECOND = 10;
const MILLISECONDS_PER_TICK = 1000 / TICKS_PER_SECOND;

export function main() {
  const commandQueue = new Queue("command", REDIS_URL);
  const discordQueue = new Queue("discord", REDIS_URL);

  /*
  function sendMessage(to: string, text: string) {
    if (to.startsWith("DISCORD")) {
      discordQueue.add({
        type: "response",
        to: to,
        text: text,
      });
    }
  }

  function interpret(player: Player, command: CommandMessage) {
    let data: any = {};
    const foundCommand = WORLD.commands.searchFor(command.command);
    console.log(player);
    console.log(foundCommand);

    const account = player.account;
    if (!account) {

    }

    if (!account.player) {
      if (data.type !== "command") {
        return console.log("Invalid command message", data);
      }
      switch (data.command) {
        case "list":
        case "who":
          // List the people who are playing
          sendMessage(userId, "Connected players:");
          break;
        case "create":
          if (!data.arguments?.[0]) {
            return sendMessage(data.from, "What is the name of the player you want to create?");
          }
          const proposedName = data.arguments[0];
          console.log(`Create a player named ${proposedName}`);
          if (WORLD.players.getByName(proposedName)) {
            return sendMessage(data.from, "That name is already in use.");
          }
          const newPlayer = new Player();
          newPlayer.name = proposedName;
          newPlayer.account = account;
          newPlayer.state = PlayerState.CREATE_NAME;
          sendMessage(userId, "Welcome to Hack and Slack. Please choose what race you wish to play.");
          break;
        default:
          sendMessage(userId, "Unknown command.");
          break;
      }
    } else {
      switch (account.player.state) {
        case PlayerState.CREATE_NAME:
          sendMessage(userId, `Welcome to Hack and Slack`);
          break;
        case PlayerState.PLAYING:
          interpret(account.player, data);
          break;
      }
    }
  }
*/
  function processInput(client: Client, input: string) {}

  function gameLoop() {
    let inLoop = false;
    const loopTimer = setInterval(() => {
      if (inLoop) {
        return;
      }
      inLoop = true;

      // Gather player input
      for (let client of WORLD.clients.values()) {
        const input = client.input.get();
        if (!input) {
          continue;
        }
        processInput(client, input);
      }

      // Update world state

      // Send player output
      for (let client of WORLD.clients.values()) {
        client.send(client.output);
      }

      // Disconnect players in a strange state
      for (let client of WORLD.clients.values()) {
      }

      inLoop = false;
    }, MILLISECONDS_PER_TICK);
  }

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
    }

    client.input.add(data.original);
  };

  gameLoop();
  commandQueue.process(10, inputProcessor);
}
