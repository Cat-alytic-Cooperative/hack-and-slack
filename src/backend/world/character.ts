import { Room } from "./room";
import { Thing } from "./thing";

export type CharacterId = number & { __flavor?: "character" };
export class Character implements Thing {
  id = 0;
  name = "";
  description = "";

  location?: Room;
}
