import { Client, Intents } from "discord.js";
import { World } from "../../backend/world";
import { DiscordClient } from "../../backend/world/client";

console.log("Loading discord/index.ts");

export function startDiscordClient(world: World) {
  console.log("Starting up Discord client.");
  const discord = new Client();

  discord.on("error", (error) => {
    console.error("Discord client error");
    console.error(error);
  });

  discord.once("ready", () => {
    console.log("Discord is up and running.");

    discord.on("message", (message) => {
      try {
        if (message.channel.type != "dm" || message.author.bot) {
          return;
        }

        const clientId = `DISCORD-${message.author.id}`;
        let client = world.clients.get(clientId);
        if (!client) {
          client = new DiscordClient(clientId, world, discord);
          world.clients.set(clientId, client);
        }

        client.input.add(message.content);
      } catch (e: any) {
        console.error(e);
      }
    });
  });
  console.log(`Discord token is ${process.env.DISCORD_TOKEN}`);
  return discord.login(process.env.DISCORD_TOKEN);
}
