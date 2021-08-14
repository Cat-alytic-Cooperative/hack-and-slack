import { Character } from "./character";
import { Contents } from "./content";
import { Player } from "./player";

export type RoomContent = Player | Character;

export class Room {
  id = 0;
  name = "";
  description = "";

  contents = new Contents();
}
