import { Character } from "./character";
import { Contents } from "./content";
import { Direction } from "./data-types/directions";
import { Exit } from "./exit";
import { Item } from "./item";
import { Player } from "./player";

export type RoomContent = Player | Character;

export class Room {
  id = 0;
  name = "";
  description = "";

  exits = new Map<Direction, Exit>();
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
    return looker;
  }

  isVisibleTo(looker: Character) {
    return true;
  }
}
