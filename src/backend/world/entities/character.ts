import { Client } from "discord.js";
import { AbilityScore, AbilityScores } from "../data-types/ability-scores";
import { Acts } from "../act";
import { Affects } from "../affect";
import { DamageType } from "../data-types/damage-types";
import { Money } from "../data-types/money";
import { Pool } from "../data-types/pool";
import { Effect, EffectList, EffectType } from "../data-types/effect";
import { Position } from "../data-types/position";
import { Room } from "./room";
import { Item } from "./item";
import { Profession } from "../profession";
import { Pronoun } from "../util/broadcast";
import { Player } from "./player";
import { findItem } from "../util/objects";
import { EquipmentSlots } from "../data-types/equipment-slot";
import { BodyParts } from "../data-types";
import { Attributes } from "../data-types/attributes";

export enum CommunicationFlags {
  NoEmote,
}
export abstract class Character {
  id = "";
  name = "";
  shortDescription = "";
  longDescription = "";
  description = "";
  pronoun = Pronoun.Other;
  snoop?: Player;
  items = new Set<Item>();
  equipment = new Map<EquipmentSlots, Item>();
  room?: Room;
  previousRoom?: Room;
  profession: Profession = new Profession();
  level = 1;
  experience = 0;
  affectedBy = new Set<Affects>();
  effects = new EffectList();

  health = new Pool(0);
  mana = new Pool(0);
  stamina = new Pool(0);

  money = 0;

  immunities = new Set<DamageType>();
  resistances = new Set<DamageType>();
  weaknesses = new Set<DamageType>();
  position = Position.Standing;
  alignment = 0;
  armor = new Map<DamageType, number>();
  abilityScores: AbilityScores = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };

  modifiers = {
    abilityScores: {},
    skills: {},
    armor: {},
  }

  form = new Set();
  parts = new Set<BodyParts>();

  addItem(item: Item) {
    this.items.add(item);
  }

  removeItem(item: Item) {
    this.items.delete(item);
  }

  abstract get isNPC(): boolean;

  get isGood() {
    return this.alignment >= 350;
  }

  get isEvil() {
    return this.alignment <= -350;
  }

  get isNeutral() {
    return !this.isGood && !this.isEvil;
  }

  get isAwake() {
    return this.position > Position.Sleeping;
  }

  get fullName() {
    return this.name;
  }

  getAbilityScore(abilityScore: AbilityScore) {
    // Get the base ability score
    let value = this.abilityScores[abilityScore] || 0;

    // Add any modifiers from Effects
    value += this.effects.getAbilityScore(abilityScore);

    // Add any modifiers from Equipment
    value += Array.from(this.equipment.values())
      .map((item) => item.effects.getAbilityScore(abilityScore))
      .reduce((prev, curr) => prev + curr, 0);

    return value;
  }

  getArmor(damageType: DamageType) {
    let value = this.armor.get(damageType) || 0;

    value += this.effects.getEffectModifier(EffectType.Armor, damageType);

    return value;
  }

  addEffect(effect: Effect) {
    switch (effect.type) {
      case EffectType.AbilityScore:
        break;
    }
  }

  moveFrom() {
    if (!this.room) {
      return;
    }

    this.room.removePerson(this);
    this.room = undefined;
  }

  moveTo(room: Room) {
    if (this.room) {
      return console.error(`${this.id} is already in a room.`);
    }

    this.room = room;
    this.room.addPerson(this);
  }

  isVisibleTo(looker: Character) {
    return true;
  }

  findItem(looker: Character, target: string) {
    if (!this.isVisibleTo(looker)) {
      return undefined;
    }
    return findItem(this.items.values(), looker, target);
  }

  send(output: string | string[]) {
    if (this.snoop && this.snoop.client) {
      if (!Array.isArray(output)) {
        output = [output];
      }
      this.snoop.client.send(output.map((line) => `${this.fullName}> ${line}`));
    }
  }
}
