const DiceRegularExpression = /(\d+)d(\d+)([+-]\d+)?/;

export class Dice {
  count = 1;
  sides = 1;
  modifier = 0;

  constructor(count = 0, sides = 1, modifier = 0) {
    this.count = count;
    this.sides = sides;
    this.modifier = modifier;
  }

  roll() {
    let value = 0;
    for (let i = 0; i < this.count; ++i) {
      value = value + Math.floor(Math.random() * this.sides) + 1;
    }
    value = value + this.modifier;
    return value;
  }

  static from(other: string | Dice) {
    if (typeof other === "string") {
      const match = DiceRegularExpression.exec(other);
      if (!match) {
        throw new Error(`${other} is not a dice expression.`);
      }

      return new Dice(Number(match[1]), Number(match[2]), Number(match[3]));
    } else if (other instanceof Dice) {
      return new Dice(other.count, other.sides, other.modifier);
    } else {
      throw new Error(`Only dice strings and Dice objects are supported`);
    }
  }
}
