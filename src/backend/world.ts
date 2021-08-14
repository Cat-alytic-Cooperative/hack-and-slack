import { Trie } from "../shared/util/trie";
import { CommandList } from "./state/playing-interpreter";
import { Character } from "./world/character";
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
  commands = {
    lookup: new Trie(),
    map: new Map<string, Function>(),
  };
  socials = {
    lookup: new Trie(),
    map: new Map<string, String[]>(),
  };
  races = new RaceMap();

  flags = {
    logAll: false,
  };

  constructor() {
    this.addCommands();
    this.addRaces();

    const startRoom = new Room();
    startRoom.name = "Starting Room";
    startRoom.description = "This is the starting room.";
    this.rooms.set(0, startRoom);
  }

  addCommands() {
    const promises = ["information"].map((name) =>
      import(`./state/commands/${name}`).then((module: CommandModule) => {
        if (!module.Commands) {
          return;
        }

        Object.entries(module.Commands).forEach(([name, method]) => {
          console.log(name);
          if (this.commands.map.has(name)) {
            return console.error(`Command '${name}' is already declared.`);
          }
          this.commands.map.set(name, method);
          this.commands.lookup.insert(name);
        });
        console.log(`Loaded commands from ${name}`);
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

  findCommand(text: string) {
    const results = this.commands.lookup.searchFor(text);
    if (results) {
      if (!results.found) {
        // no exact match
        const lookup = this.commands.lookup.allWordsFrom(results.node);
        switch (lookup.length) {
          case 0:
            return undefined;
            break;
          case 1:
            return { phrase: lookup[0].phrase, action: this.commands.map.get(lookup[0].phrase), length: 1 };
            break;
          default:
            return lookup;
        }
      } else {
        return { phrase: results.node.phrase, action: this.commands.map.get(results.node.phrase), length: 1 };
      }
    }
  }

  findSocials(text: string) {
    const results = this.socials.lookup.searchFor(text);
    if (results) {
      if (!results.found) {
        // no exact match
        const lookup = this.socials.lookup.allWordsFrom(results.node);
        switch (lookup.length) {
          case 0:
            return undefined;
            break;
          case 1:
            return { phrase: lookup[0].phrase, social: this.socials.map.get(lookup[0].phrase), length: 1 };
            break;
          default:
            return lookup;
        }
      } else {
        return { phrase: results.node.phrase, social: this.socials.map.get(results.node.phrase), length: 1 };
      }
    }
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

  wiznet(text: string, actor: Character) {}
}

export const WORLD = new World();
