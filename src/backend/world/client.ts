import { Player } from "./entities/player";
import Queue from "bull";
import { World } from "../world";
import { Client } from "discord.js";
import { App } from "@slack/bolt";

export enum ClientState {
  ACTIVE,
  IDLE,
  AFK,
}

export class ClientBuffer {
  buffer: string[] = [];

  add(input: string | string[]): number {
    if (Array.isArray(input)) {
      this.buffer.push(...input);
    } else {
      this.buffer.push(input);
    }
    return this.buffer.length;
  }

  clear() {
    this.buffer.length = 0;
  }

  get() {
    return this.buffer.shift();
  }
}

export abstract class MudClient {
  clientId = "";
  state = ClientState.ACTIVE;
  player?: Player;
  input = new ClientBuffer();
  output = new ClientBuffer();
  lastInput = Date.now();
  snoopyBy?: MudClient;
  world: World;

  constructor(clientId: string, world: World) {
    this.clientId = clientId;
    this.world = world;
  }

  abstract send(buffer: string | string[] | ClientBuffer): void;

  disconnect() {
    if (this.player) {
      this.player.client = undefined;
      this.player = undefined;
    }
    this.world.clients.delete(this.clientId);
  }
}

export class DiscordClient extends MudClient {
  discord: Client;
  discordId: string;

  constructor(clientId: string, world: World, discord: Client) {
    super(clientId, world);
    this.discord = discord;
    this.discordId = clientId.substr("DISCORD-".length);
  }

  send(buffer: string | string[] | ClientBuffer) {
    let output = [];
    if (buffer instanceof ClientBuffer) {
      output.push(...buffer.buffer);
      buffer.clear();
    } else if (Array.isArray(buffer)) {
      output.push(...buffer);
    } else {
      if (buffer === "") {
        return;
      }
      output.push(buffer);
    }

    if (output.length === 0) {
      return;
    }

    const user = this.discord.users.cache.get(this.discordId);
    user?.send(output.join("\n"));
  }
}

export class SlackClient extends MudClient {
  slack: App;
  slackId: string;

  constructor(clientId: string, world: World, slack: App) {
    super(clientId, world);

    this.slackId = this.clientId.substr("SLACK-".length);
    this.slack = slack;
  }

  send(buffer: string | ClientBuffer | string[]): void {
    let output = [];
    if (buffer instanceof ClientBuffer) {
      output.push(...buffer.buffer);
      buffer.clear();
    } else if (Array.isArray(buffer)) {
      output.push(...buffer);
    } else {
      if (buffer === "") {
        return;
      }
      output.push(buffer);
    }

    if (output.length === 0) {
      return;
    }

    this.slack.client.chat.postMessage({
      channel: this.slackId,
      text: output.join("\n"),
    });
  }
}

export class ClientMap extends Map<string, MudClient> {}
