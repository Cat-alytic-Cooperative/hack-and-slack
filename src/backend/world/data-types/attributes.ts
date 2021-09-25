import { AbilityScores, DamageType } from ".";

export type Pools = "health" | "mana" | "stamina";

export interface Attributes {
  abilityScore: AbilityScores;
  armor: Map<DamageType, number>;
  damage: Map<DamageType, number>;
  pool: Pools;
  skill: { [name: string]: number };
}
export type AttributeType = keyof Attributes;
