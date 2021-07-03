import { AccountId, Account, AccountMap } from "./world/account";
import { ExitId, Exit } from "./world/exit";
import { Player, PlayerId } from "./world/player";
import { RoomId, Room } from "./world/room";

const intervals = {
  player: 60 * 1000,
};

const MAX_IDLE_TIME = 600; // Clear player after this amount of time

export class World {
  players = new Map<PlayerId, Player>();
  rooms = new Map<RoomId, Room>();
  exits = new Map<ExitId, Exit>();
  accounts = new AccountMap();

  start() {
    setInterval(() => {
      this.tick();
    }, intervals.player);
  }

  tick() {
    for (let player of this.players.values()) {
      if (++player.idle >= MAX_IDLE_TIME) {
        player.disconnect();
      }
    }
  }
}

export const WORLD = new World();
