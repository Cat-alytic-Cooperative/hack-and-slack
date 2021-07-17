import { Player } from "./player";
import Queue from "bull";

export class ClientBuffer {
  buffer: string[] = [];

  add(input: string): number {
    this.buffer.push(input);
    return this.buffer.length;
  }

  clear() {
    this.buffer.length = 0;
  }

  get() {
    return this.buffer.shift();
  }
}

export abstract class Client {
  clientId = "";
  player?: Player;
  input = new ClientBuffer();
  output = new ClientBuffer();

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  abstract send(buffer: string | string[] | ClientBuffer): void;
}

export class DiscordClient extends Client {
  queue: Queue.Queue;

  constructor(clientId: string, queue: Queue.Queue) {
    super(clientId);
    this.queue = queue;
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

    this.queue.add({
      type: "response",
      to: this.clientId,
      text: output,
    });
  }
}

export class ClientMap extends Map<string, Client> {}
