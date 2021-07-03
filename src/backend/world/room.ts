import { Character } from "./character";
import { Player } from "./player";

export type RoomContent = Player | Character;

export type RoomId = number & { __flavor?: "room" };
export class Room {
  id: RoomId = 0;
  name = "";
  description = "";

  contents = new Set<RoomContent>();

  add(thing: RoomContent) {
    this.contents.add(thing);
    thing.location = this;
  }

  remove(thing: RoomContent) {
    this.contents.delete(thing);
    thing.location = undefined;
  }
}
