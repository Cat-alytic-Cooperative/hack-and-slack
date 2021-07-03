import { Room } from "./room";

export type CharacterId = number & { __flavor?: "character" };
export class Character {
  id: CharacterId = 0;
  name = "";
  description = "";

  location?: Room;
}
