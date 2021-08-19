import { DamageType } from "./damage-types";
import { Dice } from "./dice";

export interface Attack {
  damageType: DamageType;
  damage: Dice;
  verb?: string;
}
