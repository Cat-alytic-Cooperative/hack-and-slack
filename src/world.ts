export type PlayerId = string & { __flavor?: "player" };
export class Player {
  id: PlayerId = "";
  name = "";
  description = "";
}

export type RoomId = string & { __flavor?: "room" };
export class Room {
  id: RoomId = "";
  name = "";
  description = "";
}

export type ExitId = string & { __flavor?: "exit" };
export class Exit {
  id: ExitId = "";
  name = "";
  description = "";
}

export class World {
  players = new Map<PlayerId, Player>();
  rooms = new Map<RoomId, Room>();
  exits = new Map<ExitId, Exit>();
}
