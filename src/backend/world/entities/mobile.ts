import { Character } from "./character";
import { AbilityScores } from "../data-types/ability-scores";
import { Attack } from "../data-types/attack";
import { DamageType } from "../data-types/damage-types";
import { Dice } from "../data-types/dice";
import { nextId } from "../data-types/id";

export class MobilePrototype {
  id = 0;
  name = "";
  shortDescription = "";
  longDescription = "";
  description = "";

  money = new Dice();

  level = 0;

  abilityScores: AbilityScores = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  health = new Dice();
  mana = new Dice();
  stamina = new Dice();

  immunities = new Set<DamageType>();
  resistances = new Set<DamageType>();
  weaknesses = new Set<DamageType>();

  attacks: Attack[] = [];
  armor = new Map<DamageType, number>();

  newInstance() {
    return new Mobile(this);
  }
}

export class Mobile extends Character {
  prototype: MobilePrototype;
  attacks: Attack[] = [];

  constructor(prototype: MobilePrototype) {
    super();
    this.id = nextId(Mobile);
    this.prototype = prototype;

    this.name = prototype.name;
    this.shortDescription = prototype.shortDescription;
    this.longDescription = prototype.longDescription;
    this.description = prototype.description;

    this.level = prototype.level;
    this.abilityScores = { ...prototype.abilityScores };

    this.health.set(prototype.health.roll());
    this.mana.set(prototype.mana.roll());
    this.stamina.set(prototype.stamina.roll());

    this.money = prototype.money.roll();

    this.weaknesses = new Set(prototype.weaknesses);
    this.resistances = new Set(prototype.resistances);
    this.immunities = new Set(prototype.immunities);
    this.armor = new Map(prototype.armor);

    for (let attack of prototype.attacks) {
      this.attacks.push({ ...attack });
    }
  }

  get isNPC() {
    return true;
  }

  get fullName() {
    return this.shortDescription;
  }
}
