export type RoomId = number & { __flavor?: "room" };
export class Room {
  id: RoomId = 0;
  name = "";
  description = "";
}
