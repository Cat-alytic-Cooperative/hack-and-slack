import { Trie } from "../shared/util/trie";
import { CommandList } from "./state/playing-interpreter";
import { ClientMap } from "./world/client";
import { ExitId, Exit } from "./world/exit";
import { PlayerMap } from "./world/player";
import { RaceMap } from "./world/race";
import { RoomId, Room } from "./world/room";

const timings = {
  ticksPerSecond: 10,
  playerTicks: 1,
};
const MAX_IDLE_TIME = 600; // Clear player after this amount of time

export interface CommandModule {
  Commands: CommandList;
}

export class World {
  players = new PlayerMap();
  rooms = new Map<RoomId, Room>();
  exits = new Map<ExitId, Exit>();
  clients = new ClientMap();
  commands = new Trie();
  races = new RaceMap();

  constructor() {
    this.addCommands();
    this.addRaces();
  }

  addCommands() {
    const promises = ["information"].map((name) =>
      import(`./state/commands/${name}`).then((module: CommandModule) => {
        if (!module.Commands) {
          return;
        }

        Object.entries(module.Commands).forEach(([name, method]) => {
          this.commands.insert(name);
        });
      })
    );
    Promise.all(promises)
      .then(() => {
        console.log("All command modules are loaded.");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  addRaces() {
    this.races.set(1, {
      id: 1,
      name: "Human",
      description: "Stuff",
      playable: true,
    });
  }

  start() {
    const tickInterval = Math.floor(1000 / timings.ticksPerSecond);
    setInterval(() => {
      this.tick();
    }, tickInterval);
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
