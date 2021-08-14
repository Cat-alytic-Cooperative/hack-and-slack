import { Client } from "discord.js";
import { Acts } from "./act";
import { Affects } from "./affect";
import { Money } from "./money";
import { Pool } from "./pool";

class Affect {}

class Item {}

class Room {
  findCharacter(looker: Character, target: string) {
    return looker;
  }
}



export enum Position {
  Dead,
  Mortal,
  Incapacitated,
  Stunned,
  Sleeping,
  Resting,
  Sitting,
  Fighting,
  Standing,
}

export enum CommunicationFlags {
  NoEmote,
}
export class Character {
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
  inventory: Item[] = [];
  room?: Room;
  previousRoom?: Room;
  profession: Profession = new Profession();
  level = 1;
  affectedBy = new Set<Affects>();
  // group
  // clan
  // sex
  // trust
  played = 0;
  logon = 0;
  timer = 0;
  wait = 0;
  daze = 0;

  health = new Pool(0);
  mana = new Pool(0);
  stamina = new Pool(0);

  money = new Money();

  experience = 0;
  act = new Set<Acts>();
  comm = new Set();
  wiznet = new Set();
  immunities = new Set();
  resistances = new Set();
  weaknesses = new Set();
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
  armor: number[] = [];
  wimpy = 0;
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
  start_pos = 0;
  default_pos = 0;

  get isNPC() {
    return this.act.has(Acts.IsNpc);
  }

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

  send(text: string) {}
}

class Profession {}

class PlayerGen {}

class Player {
  client?: Client;
  gen?: PlayerGen;
}

class MobilePrototype {}

class Mobile {
  prototype: MobilePrototype;
  memory = new Map<number, MobileMemory>();

  constructor(prototype: MobilePrototype) {
    this.prototype = prototype;
  }
}

enum MemoryReactions {
  Customer,
  Seller,
  Hostile,
  Afraid,
}

class MobileMemory {
  when: number = Date.now();
  id = 0;
  reaction = new Set<MemoryReactions>();
}
