import { Character } from "./character";

export type MobileId = number & { __flavor?: "mobile" };
export class Mobile extends Character {
  id: MobileId = 0;
  name = "";
  description = "";
}
