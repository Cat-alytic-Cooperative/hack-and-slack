import { WORLD } from "../world";
import { Account, AccountId } from "./account";
import { Room } from "./room";
import { Thing, ThingMap } from "./thing";

export type PlayerId = number & { __flavor?: "player" };
export class Player implements Thing {
  id: PlayerId = 0;
  account?: AccountId;
  name = "";
  description = "";

  location?: Room;

  // Player idle time (in seconds)
  idle = 0;

  connect() {
    
  }

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
  getAllByAccount(account: Account) {
    const players: Player[] = [];
    for (let player of this.values()) {
      if (player.account === account.id) {
        players.push(player);
      }
    }
    return players;
  }
}
