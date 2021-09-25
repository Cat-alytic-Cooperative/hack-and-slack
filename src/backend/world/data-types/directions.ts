import { Trie } from "../../../shared/util/trie";

export const DEFAULT_DIRECTIONS = [
  "north" as const,
  "northeast",
  "east",
  "southeast",
  "south",
  "southwest",
  "west",
  "northwest",
  "up",
  "down",
  "in",
  "out",
] as const;

export const DIRECTION_ABBREVIATION: {[name: string]: string} = {
  north: "n" ,
  northeast: "ne",
  east: "e",
  southeast: "se",
  south: "s",
  southwest: "sw",
  west: "w",
  northwest: "nw",
  up: "u",
  down: "d",
} as const;

export const DirectionLookup = new Trie();

for (let value of DEFAULT_DIRECTIONS) {
  DirectionLookup.insert(value);
}
