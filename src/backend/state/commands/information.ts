import { Character } from "../../world/character";
import { Position } from "../../world/data-types/position";
import { Exit } from "../../world/exit";
import { Item } from "../../world/item";
import { Player } from "../../world/player";
import { CommandList } from "../playing-interpreter";

function personDescription(ch: Character) {
  console.log(ch);
  if (ch.isNPC) {
    return ch.shortDescription;
  } else {
    const position = Position[ch.position].toLowerCase();

    return `${ch.name} is ${position} here`;
  }
}

function itemDescription(item: Item) {
  return item.name;
}

function exitDescription(exit: Exit) {
  if (exit.destination) {
    return exit.destination.name;
  } else {
    return `it leads nowhere`;
  }
}

function lookRoom(ch: Character) {
  if (!ch.room) {
    return ch.send("You are not in a location.");
  }

  const players = Array.from(ch.room.people)
    .filter((person) => person !== ch)
    .map(personDescription);

  const items = Array.from(ch.room.items, itemDescription);
  if (items.length === 0 && players.length === 0) {
    items.push("There is nothing here.");
  }

  const exits = Array.from(ch.room.exits.entries(), (entry) => `- ${entry[0]}: ${entry[1].destination?.name}`);
  if (exits.length === 0) {
    exits.push("There are no obvious exits.");
  }

  ch.send([`*${ch.room.name || "<unknown>"}*`, ch.room.description || "", ...players, ...items, ...exits]);
}

export const Commands: CommandList = {
  list({ ch, command, args }) {
    console.log("list");
  },
  look({ ch, command, args }) {
    if (args.length === 0 || args[1] === "here") {
      lookRoom(ch);
    }
  },
};
Commands["l"] = Commands.look;
