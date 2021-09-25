import { Character } from "./character";
import { Room } from "./room";

export class Exit {
  id = 0;
  name = "";
  shortDescription = "";
  description = "";
  destination?: Room;
  destinationId = "";

  isVisibleTo(ch: Character) {
    return true;
  }
}
