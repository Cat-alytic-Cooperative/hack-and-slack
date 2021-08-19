import { AbilityScore } from "./ability-scores";

export enum EffectType {
  None,
  AbilityScore,
}

export class BaseEffect {
  id = 0;
  type = EffectType.None;
}

export class AbilityScoreEffect extends BaseEffect {
  type = EffectType.AbilityScore;
  abilityScore: AbilityScore = "strength";
  modifier = 0;
}

export type Effect = AbilityScoreEffect;
