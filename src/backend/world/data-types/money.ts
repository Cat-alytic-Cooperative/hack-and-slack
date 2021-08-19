export interface IMoney {
  platinum?: number;
  gold?: number;
  silver?: number;
  copper?: number;
}

export class Money {
  platinum = 0;
  gold = 0;
  silver = 0;
  copper = 0;

  constructor(amount?: IMoney | Money | string) {
    let converted: Money | undefined;
    if (typeof amount === "string") {
      converted = Money.parseString(amount);
    } else if (!(amount instanceof Money)) {
      converted = new Money(amount);
    } else {
      converted = amount;
    }

    this.platinum = converted?.platinum || 0;
    this.gold = converted?.gold || 0;
    this.silver = converted?.silver || 0;
    this.copper = converted?.copper || 0;
  }

  add(amount?: IMoney | Money | string) {
    let converted: Money;
    if (typeof amount === "string") {
      converted = Money.parseString(amount);
    } else if (!(amount instanceof Money)) {
      converted = new Money(amount);
    } else {
      converted = amount;
    }

    this.platinum += converted.platinum;
    this.gold += converted.gold;
    this.silver += converted.silver;
    this.copper += converted.copper;
  }

  static parseString(text: string) {
    const parts = text.match(/\d+[pgsc]/gi)?.reduce((prev, curr) => {
      let [_, amount, coin] = curr.match(/(\d+)(\w)/) || [];
      switch (coin) {
        case "p":
          prev.platinum = (prev.platinum || 0) + Number(amount);
          break;
        case "g":
          prev.gold = (prev.gold || 0) + Number(amount);
          break;
        case "s":
          prev.silver = (prev.silver || 0) + Number(amount);
          break;
        case "c":
          prev.copper = (prev.copper || 0) + Number(amount);
          break;
      }
      (prev as any)[coin] = amount;
      return prev;
    }, {} as IMoney);

    return new Money(parts);
  }
}

console.log(Money.parseString("12p 1g8c"));
