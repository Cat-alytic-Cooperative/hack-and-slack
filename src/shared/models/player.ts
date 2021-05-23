import { UserId } from "./user";

export type PlayerId = number & { __flavor?: "player" };
export class Player {
  id: PlayerId = 0;
  user?: UserId;
  name = "";
  description = "";
}
