import { Character } from "./character";
import { Player } from "./player";
import { Thing } from "./thing";

export type RoomContent = Player | Character;

export type RoomId = number & { __flavor?: "room" };
export class Room {
  id: RoomId = 0;
  name = "";
  description = "";

  contents = new Set<Thing>();

  add(thing: Thing) {
    this.contents.add(thing);
    thing.location = this;
  }

  remove(thing: Thing) {
    this.contents.delete(thing);
    thing.location = undefined;
  }
}
