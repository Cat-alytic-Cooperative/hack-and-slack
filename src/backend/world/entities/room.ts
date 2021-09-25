import { Character } from "./character";
import { Contents } from "../content";
import { Exit } from "./exit";
import { Item } from "./item";
import { Player } from "./player";
import { findCharacter, findItem } from "../util/objects";

export type RoomContent = Player | Character;

export class Room {
  id = "";
  name = "";
  description = "";

  exits = new Map<string, Exit>();
  items = new Set<Item>();
  people = new Set<Character>();

  addItem(item: Item) {
    this.items.add(item);
  }

  removeItem(item: Item) {
    this.items.delete(item);
  }

  addPerson(ch: Character) {
    this.people.add(ch);
  }

  removePerson(ch: Character) {
    this.people.delete(ch);
  }

  findCharacter(looker: Character, target: string) {
    if (!this.isVisibleTo(looker)) {
      return undefined;
    }
    return findCharacter(this.people.values(), looker, target);
  }

  findItem(looker: Character, target: string) {
    if (!this.isVisibleTo(looker)) {
      return undefined;
    }
    return findItem(this.items.values(), looker, target);
  }

  isVisibleTo(looker: Character) {
    return true;
  }
}
