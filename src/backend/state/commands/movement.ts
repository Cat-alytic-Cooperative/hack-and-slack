import { Character } from "../../world/entities/character";
import { DEFAULT_DIRECTIONS, DirectionLookup, DIRECTION_ABBREVIATION } from "../../world/data-types/directions";
import { CommandList } from "../playing-interpreter";
import { Commands as Information } from "./information";
import { broadcast, BroadcastTarget } from "../../world/util/broadcast";
import { World } from "../../world";

function moveCharacter(ch: Character, direction: string, world: World) {
  if (!ch.room) {
    return ch.send("You are not in a location.");
  }

  const exit = ch.room.exits.get(direction);
  if (!exit || !exit.isVisibleTo(ch)) {
    return ch.send("There is no exit in that direction.");
  }

  const destination = exit.destination;
  if (!destination) {
    return ch.send("That exit does not lead anywhere.");
  }

  broadcast(ch, BroadcastTarget.NotActor, `$n move$% ${direction}.`);
  ch.moveFrom();
  ch.moveTo(destination);
  broadcast(ch, BroadcastTarget.NotActor, `$n enter$% the area.`);

  Information.look({ ch, command: "look", rest: "", world });
}

export const Commands: CommandList = {};
for (let direction of DEFAULT_DIRECTIONS) {
  Commands[direction] = ({ ch, command, rest, world }) => {
    moveCharacter(ch, direction, world);
  };
  const abbreviation = DIRECTION_ABBREVIATION[direction];
  if (abbreviation) {
    Commands[abbreviation] = Commands[direction];
  }
}
