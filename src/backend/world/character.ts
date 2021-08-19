import { Client } from "discord.js";
import { AbilityScore, AbilityScores } from "./data-types/ability-scores";
import { Acts } from "./act";
import { Affects } from "./affect";
import { DamageType } from "./data-types/damage-types";
import { Money } from "./data-types/money";
import { Pool } from "./data-types/pool";
import { Effect, EffectType } from "./data-types/effect";
import { Position } from "./data-types/position";
import { Room } from "./room";
import { Item } from "./item";
import { Profession } from "./profession";

class Affect {}

export enum CommunicationFlags {
  NoEmote,
}
export abstract class Character {
  id = 0;
  name = "";
  shortDescription = "";
  longDescription = "";
  description = "";
  prompt = "";
  prefix = "";
  master?: Character;
  leader?: Character;
  fighting?: Character;
  pet?: Character;
  reply?: Character;
  affects: Affect[] = [];
  items = new Set<Item>();
  room?: Room;
  previousRoom?: Room;
  profession: Profession = new Profession();
  level = 1;
  affectedBy = new Set<Affects>();
  // group
  // clan
  // sex
  // trust
  wait = 0;
  daze = 0;

  health = new Pool(0);
  mana = new Pool(0);
  stamina = new Pool(0);

  money = 0;

  experience = 0;
  act = new Set<Acts>();
  comm = new Set();
  wiznet = new Set();
  effects: Effect[] = [];
  immunities = new Set<DamageType>();
  resistances = new Set<DamageType>();
  weaknesses = new Set<DamageType>();
  invis_level = 0;
  incog_level = 0;
  position = Position.Standing;
  practice = 0;
  train = 0;
  carry_weight = 0;
  carry_number = 0;
  saving_throw = 0;
  alignment = 0;
  hitroll = 0;
  damroll = 0;
  armor = new Map<DamageType, number>();
  wimpy = 0;
  abilityScores: AbilityScores = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };
  perm_stat: number[] = [];
  mod_stat: number[] = [];
  form = new Set();
  parts = new Set();
  size = 0;
  material = "";
  // Mobile stuff
  offensive = new Set();
  damage: number[] = [];
  dam_type = 0;
  start_pos = Position.Standing;
  default_pos = Position.Standing;

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

  getAbilityScore(abilityScore: AbilityScore) {
    // Get the base ability score
    let value = this.abilityScores[abilityScore] || 0;

    // Add any modifiers from Effects
    value += this.effects
      .filter((effect) => effect.type === EffectType.AbilityScore && effect.abilityScore === abilityScore)
      .reduce((prev, curr) => prev + curr.modifier, 0);

    // TODO: Add any modifiers from Equipment

    return value;
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

  send(output: string | string[]) {}
}
