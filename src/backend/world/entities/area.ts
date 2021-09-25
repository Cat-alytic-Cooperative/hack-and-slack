import { Room, Exit, BaseItemPrototype } from ".";

export class Area {
  id = "";
  name = "";
  description = "";
  rooms = new Map<string, Room>();
  items = new Map<string, BaseItemPrototype>();
  data: any = {};
}
