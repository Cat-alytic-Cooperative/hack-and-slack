import * as Discord from "discord.js";
import Queue, { ProcessCallbackFunction } from "bull";
import { CommandMessage, Message, ResponseMessage } from "../shared/worker/messages";

const REDIS_URL = String(process.env.REDIS_URL);

export function main() {
  console.log("Starting up Discord client.");
  const client = new Discord.Client();

  const commandQueue = new Queue("command", REDIS_URL);

  function sendCommand(command: CommandMessage) {
    commandQueue.add(command);
  }

  const discordQueue = new Queue("discord", REDIS_URL);
  const discordQueueProcessor: ProcessCallbackFunction<ResponseMessage> = async (job) => {
    const data = job.data;
    console.log("discord: job:", job.id, job.data);
    if (!data.type || !data.to) {
      return { type: "error", message: "Invalid message type" };
    }

    if (!data.to.startsWith("DISCORD")) {
      return console.log("Response sent to wrong client.");
    }

    const clientId = data.to.substr("DISCORD-".length);
    const user = client.users.cache.get(clientId);
    user?.send(data.text);

    console.log(data);
  };

  discordQueue.process(10, discordQueueProcessor);

  client.once("ready", () => {
    console.log("Discord is up and running.");

    client.on("message", (message) => {
      if (message.channel.type != "dm" || message.author.bot) {
        return;
      }
      console.log("New message:", message);

      const args = message.content.trim().split(/\s+/);
      const command = args.shift()?.toLowerCase() || "";

      sendCommand({
        type: "command",
        original: message.content,
        command,
        from: `DISCORD-${message.author.id}`,
        arguments: args,
      });
    });
  });
  console.log(`Discord token is ${process.env.DISCORD_TOKEN}`)
  client.login(process.env.DISCORD_TOKEN);
}
