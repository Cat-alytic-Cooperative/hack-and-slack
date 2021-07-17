import { WORLD } from "../world";
import { Client } from "./client";
import { Character } from "./character";
import { Room } from "./room";
import { Thing, ThingMap } from "./thing";

export enum PlayerState {
  CREATE_NAME,
  PLAYING,
}

export type PlayerId = number & { __flavor?: "player" };
export class Player extends Character {
  id: PlayerId = 0;
  client?: Client;

  state = PlayerState.PLAYING;

  // Player idle time (in seconds)
  idle = 0;

  connect() {}

  disconnect() {
    this.save();

    // Remove the player from their current location
    this.location?.remove(this);

    // Remove the player as a target, from any lists, etc.

    // Remove the player from the world cache
    WORLD.players.delete(this.id);
  }

  save() {
    // Write the current user state to the database
  }

  tick() {
    // Things that happen each tick
  }
}

export class PlayerMap extends ThingMap<PlayerId, Player> {
  getAllByAccount(account: Client) {
    return [...this.values()].filter((player) => player.client === account);
  }

  getByAccount(account: Client) {
    return this.getAllByAccount(account)[0];
  }
}
