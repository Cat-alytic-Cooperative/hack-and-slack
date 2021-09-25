import { Character, Exit, Item, Room } from "../../world/entities";
import { Position } from "../../world/data-types/position";
import { CommandList } from "../playing-interpreter";

function characterDescription(ch: Character) {
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
    .map(characterDescription);

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

function lookCharacter(ch: Character, target: Character) {
  ch.send([`*${target.fullName}*`, target.description]);
}

function lookItem(ch: Character, target: Item) {
  ch.send([`*${target.fullName}*`, target.longDescription]);
}

function lookThing(looker: Character, thing: Item | Character) {
  if (thing instanceof Item) {
    lookItem(looker, thing);
  } else {
    lookCharacter(looker, thing);
  }
}

interface CanFindCharacterOrItem {
  findCharacter(looker: Character, target: string): Character | undefined;
  findItem(looker: Character, target: string): Item | undefined;
}
function lookForCharacterOrItem(looker: Character, target: string, place: CanFindCharacterOrItem) {
  const victim = place.findCharacter(looker, target);
  if (victim) {
    return victim;
  }
  const item = place.findItem(looker, target);
  if (item) {
    return item;
  }
  return undefined;
}

export const Commands: CommandList = {
  commands({ ch, rest, world }) {
    let commands = world.commands.lookup.allWordsFrom().map((entry) => entry.phrase.toLowerCase());
    if (rest.length) {
      commands = commands.filter((command) => command.startsWith(rest.toLowerCase()));
      commands.unshift(`Commands starting with '${rest}':`);
    } else {
      commands.unshift("Commands:");
    }
    commands.sort();
    ch.send(commands);
  },
  list({ ch, command, rest }) {
    console.log("list");
  },
  look({ ch, command, rest }) {
    if (!ch.room) {
      return ch.send(`You are not in a location.`);
    }
    if (!rest || rest === "here") {
      lookRoom(ch);
    } else if (rest === "me") {
      lookCharacter(ch, ch);
    } else if (rest.startsWith("here ")) {
      rest = rest.substring(5);
      const thing = lookForCharacterOrItem(ch, rest, ch.room);
      if (!thing) {
        return ch.send("You do not see that here.");
      }
      lookThing(ch, thing);
    } else if (rest.startsWith("me ")) {
      rest = rest.substring(3);
      const thing = ch.findItem(ch, rest);
      if (!thing) {
        return ch.send("You do not see that on you.");
      }
      lookThing(ch, thing);
    } else {
      let thing = lookForCharacterOrItem(ch, rest, ch.room);
      if (!thing) {
        thing = ch.findItem(ch, rest);
      }
      if (!thing) {
        return ch.send("You do not see that here or on you.");
      }
      lookThing(ch, thing);
    }
  },
  score({ ch, command, rest }) {},
};
Commands["l"] = Commands.look;
