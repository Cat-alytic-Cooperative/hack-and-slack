import * as Discord from "discord.js";
import Queue, { ProcessCallbackFunction } from "bull";

const REDIS_URL = String(process.env.REDIS_URL);

export function main() {
  console.log("Starting up Discord client.");
  const client = new Discord.Client();

  client.once("ready", () => {
    console.log("Discord is up and running.");

    const commandQueue = new Queue("command", REDIS_URL);

    client.on("message", (message) => {
      if (message.channel.type != "dm" || message.author.bot) {
        return;
      }
      console.log("New message:", message);

      const args = message.content.trim().split(/\s+/);
      const command = args.shift()?.toLowerCase();

      commandQueue.add({ type: "command", command, sender: `DISCORD-${message.author.id}` });
    });
  });
  client.login(process.env.DISCORD_TOKEN);
}
