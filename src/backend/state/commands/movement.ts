import { Character } from "../../world/entities/character";
import { Direction } from "../../world/data-types/directions";
import { CommandList } from "../playing-interpreter";
import { Commands as Information } from "./information";
import { broadcast, BroadcastTarget } from "../../world/util/broadcast";

function moveCharacter(ch: Character, direction: Direction) {
  if (!ch.room) {
    return ch.send("You are not in a location.");
  }

  const exit = ch.room.exits.get(direction);
  if (!exit || !exit.isVisibleTo(ch)) {
    return ch.send("There is no exist in that direction.");
  }

  const destination = exit.destination;
  if (!destination) {
    return ch.send("That exit does not lead anywhere.");
  }

  broadcast(ch, BroadcastTarget.NotActor, `$n move$% ${direction}.`);
  ch.moveFrom();
  ch.moveTo(destination);
  broadcast(ch, BroadcastTarget.NotActor, `$n enter$% the area.`);

  Information.look({ ch, command: "look", rest: "" });
}

export const Commands: CommandList = {
  north({ ch, command, rest }) {
    moveCharacter(ch, Direction.North);
  },
  south({ ch, command, rest }) {
    moveCharacter(ch, Direction.South);
  },
};

Commands.n = Commands.north;
Commands.s = Commands.south;
