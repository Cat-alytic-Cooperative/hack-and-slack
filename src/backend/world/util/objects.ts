import { Character } from "../entities/character";
import { Item } from "../entities/item";

export function findCharacter(source: Character[] | IterableIterator<Character>, looker: Character, target: string) {
  for (let person of source) {
    if (person.isNPC) {
      if (person.name.split(";").includes(target) && person.isVisibleTo(looker)) {
        return person;
      }
    } else {
      if (person.name === target && person.isVisibleTo(looker)) {
        return person;
      }
    }
  }

  return undefined;
}

export function findItem(source: Item[] | IterableIterator<Item>, looker: Character, target: string) {
  for (let item of source) {
    if (item.name.split(";").includes(target) && item.isVisibleTo(looker)) {
      return item;
    }
  }

  return undefined;
}
