import { WORLD } from "../world";
import { Client } from "./client";
import { Character } from "./character";
import { Room } from "./room";
import { Thing, ThingMap } from "./thing";

export enum PlayerState {
  CREATE_NAME,
  PLAYING,
}

export class Player extends Character {
  client?: Client;
  state = PlayerState.PLAYING;
  idle = 0;
  logon = Date.now();

  connect() {}

  disconnect() {
    this.save();

    // Remove the player from their current location
    //    this.moveFrom();

    // Remove the player as a target, from any lists, etc.
  }

  save() {
    // Write the current user state to the database
  }

  tick() {
    // Things that happen each tick
  }

  send(output: string | string[]) {
    this.client?.output.add(output);
  }

  get isNPC() {
    return false;
  }
}

export class PlayerMap extends ThingMap<number, Player> {
  getAllByClient(account: Client) {
    return [...this.values()].filter((player) => player.client === account);
  }

  getByClient(account: Client) {
    return this.getAllByClient(account)[0];
  }
}
