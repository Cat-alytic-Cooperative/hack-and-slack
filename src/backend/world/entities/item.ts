import { Character } from "./character";
import { DamageType, DEFAULT_DAMAGE_TYPE } from "../data-types/damage-types";
import { Dice } from "../data-types/dice";
import { nextId } from "../data-types/id";
import { Room } from "./room";
import { Effect, EffectList } from "../data-types";

export abstract class BaseItemPrototype {
  id = "";
  name = "";
  shortDescription = "";
  longDescription = "";
  description = "";

  weight = 0;

  abstract newInstance(): Item;
}

export class WeaponItemPrototype extends BaseItemPrototype {
  damageType: DamageType = DEFAULT_DAMAGE_TYPE;
  damage = new Dice();

  newInstance(): WeaponItem {
    return new WeaponItem(this);
  }
}

export type ItemPrototype = WeaponItemPrototype;

export class Item {
  id = "";
  prototype: BaseItemPrototype;
  name = "";
  shortDescription = "";
  longDescription = "";
  description = "";

  weight = 0;

  room?: Room;
  holder?: Character;

  effects = new EffectList();

  moveFrom() {
    if (this.room) {
      this.room.items.delete(this);
      this.room = undefined;
    }
    if (this.holder) {
      this.holder.items.delete(this);
      this.holder = undefined;
    }
  }

  moveTo(place: Room | Character) {
    if (place instanceof Room) {
      place.addItem(this);
      this.room = place;
    } else if (place instanceof Character) {
      place.addItem(this);
      this.holder = place;
    }
  }

  constructor(prototype: BaseItemPrototype) {
    this.id = nextId(Item);
    this.prototype = prototype;

    this.name = prototype.name;
    this.shortDescription = prototype.shortDescription;
    this.longDescription = prototype.longDescription;
    this.description = prototype.description;

    this.weight = prototype.weight;
  }

  isVisibleTo(looker: Character) {
    return true;
  }

  get fullName() {
    return this.shortDescription;
  }
}

export class WeaponItem extends Item {
  damageType: DamageType = DEFAULT_DAMAGE_TYPE;
  damage = new Dice();

  constructor(prototype: WeaponItemPrototype) {
    super(prototype);

    this.damageType = prototype.damageType;
    this.damage = Dice.from(this.damage);
  }
}

export class ArmorItem extends Item {
  values = new Map<DamageType, number>();
}
