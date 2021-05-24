import { AccountId } from "./account";

export type PlayerId = number & { __flavor?: "player" };
export class Player {
  id: PlayerId = 0;
  account?: AccountId;
  name = "";
  description = "";
}
