import { DEFAULT_DAMAGE_TYPE } from ".";
import { AbilityScore, AbilityScores } from "./ability-scores";
import { DamageType } from "./damage-types";

interface args {
  abilityScore?: AbilityScore;
  armor?: string;
}
type EfType = keyof args;
const m: args = { abilityScore: "strength", armor: "poison" };

export class EffectList extends Array<Effect> {
  getEffectModifier(type: EffectType, subtype?: any) {
    return this.filter((effect) => {
      return (
        effect.type === type &&
        (subtype !== undefined && effect.subtype !== undefined ? effect.subtype === subtype : true)
      );
    }).reduce((prev, curr) => prev + curr.modifier, 0);
  }

  getEffectModifier2<K extends keyof args>(type: K, subtype?: args[K]) {
    return this.filter((effect) => {
      return (
        effect.type === type &&
        (subtype !== undefined && effect.subtype !== undefined ? effect.subtype === subtype : true)
      );
    }).reduce((prev, curr) => prev + curr.modifier, 0);
  }

  getAbilityScore(abilityScore: AbilityScore) {
    return this.filter((effect) => effect.type === EffectType.AbilityScore && effect.subtype === abilityScore).reduce(
      (prev, curr) => prev + curr.modifier,
      0
    );
  }

  getArmor(damageType: DamageType) {
    return this.filter((effect) => effect.type === EffectType.Armor && effect.subtype === damageType).reduce(
      (prev, curr) => prev + curr.modifier,
      0
    );
  }

  getMaximumHealth() {
    return this.filter((effect) => effect.type === EffectType.MaximumHealth).reduce(
      (prev, curr) => prev + curr.modifier,
      0
    );
  }

  getMaximumMana() {
    return this.filter((effect) => effect.type === EffectType.MaximumMana).reduce(
      (prev, curr) => prev + curr.modifier,
      0
    );
  }

  getMaximumStamina() {
    return this.filter((effect) => effect.type === EffectType.MaximumStamina).reduce(
      (prev, curr) => prev + curr.modifier,
      0
    );
  }
}

export const enum EffectType {
  None = "none",
  AbilityScore = "abilityScore",
  Armor = "armor",
  MaximumHealth = "maximumHealth",
  MaximumMana = "maximumMana",
  MaximumStamina = "maximumStamina",
}

export class BaseEffect {
  type = EffectType.None as const;
  subtype: any;
  modifier = 0;
}

export class AbilityScoreEffect {
  type = EffectType.AbilityScore as const;
  subtype: AbilityScore = "strength";
  modifier = 0;
}

export class ArmorEffect {
  type = EffectType.Armor as const;
  subtype: DamageType = DEFAULT_DAMAGE_TYPE;
  modifier = 0;
}

export class MaximumHealthEffect {
  type = EffectType.MaximumHealth as const;
  subtype = undefined;
  modifier = 0;
}

export class MaximumManaEffect {
  type = EffectType.MaximumMana as const;
  subtype = undefined;
  modifier = 0;
}

export class MaximumStaminaEffect {
  type = EffectType.MaximumStamina as const;
  subtype = undefined;
  modifier = 0;
}

export type Effect = AbilityScoreEffect | ArmorEffect | MaximumHealthEffect | MaximumManaEffect | MaximumStaminaEffect;
