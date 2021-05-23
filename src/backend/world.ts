import { ExitId, Exit } from "../shared/models/exit";
import { Player, PlayerId } from "../shared/models/player";
import { RoomId, Room } from "../shared/models/room";

export class World {
  players = new Map<PlayerId, Player>();
  rooms = new Map<RoomId, Room>();
  exits = new Map<ExitId, Exit>();
}

