import { Character } from "../entities/character";
import { Item } from "../entities/item";

export enum BroadcastTarget {
  Actor,
  Room,
  NotActor,
}

export enum Pronoun {
  Male,
  Female,
  Other,
}

const Subjective = new Map<Pronoun, string>();
Subjective.set(Pronoun.Male, "he");
Subjective.set(Pronoun.Female, "she");
Subjective.set(Pronoun.Other, "it");

const Objective = new Map<Pronoun, string>();
Objective.set(Pronoun.Male, "him");
Objective.set(Pronoun.Female, "her");
Objective.set(Pronoun.Other, "it");

const Possessive = new Map<Pronoun, string>();
Possessive.set(Pronoun.Male, "his");
Possessive.set(Pronoun.Female, "hers");
Possessive.set(Pronoun.Other, "its");

const BroadcastParam = /^\$(\d+)?(.+)$/;

export function broadcast(actor: Character, to: BroadcastTarget, text: string, ...args: (Item | Character)[]) {
  if (!actor.room) {
    console.log("Actor is not in room");
    return;
  }

  let targets: undefined | Character[] | IterableIterator<Character>;
  switch (to) {
    case BroadcastTarget.Actor:
      targets = [actor];
      break;
    case BroadcastTarget.Room:
      targets = actor.room.people.values();
      break;
    case BroadcastTarget.NotActor:
      targets = Array.from(actor.room.people.values()).filter((person) => person !== actor);
      break;
  }

  if (!targets) {
    return;
  }

  for (let other of targets) {
    console.log("Target is", other.name, text);
    let targetText = text.replace(/(\$\d*[NSOP%])/gi, (old) => {
      console.log({ old });
      const match = BroadcastParam.exec(old);
      console.log({ match });
      if (!match) {
        return "";
      }
      const index = Number(match[1]);
      const mode = match[2];
      console.log({ index, mode });
      let target = isNaN(index) ? actor : args[index];
      switch (mode) {
        // Name
        case "n":
          return other === target ? "you" : target.fullName;
        // Subjective
        case "s":
          if (!(target instanceof Character)) {
            return "";
          }
          return other === target ? "you" : Subjective.get(target.pronoun) || "";
        case "o":
          if (!(target instanceof Character)) {
            return "";
          }
          return other === target ? "you" : Objective.get(target.pronoun) || "";
        case "p":
          if (!(target instanceof Character)) {
            return "";
          }
          return other === target ? "your" : Possessive.get(target.pronoun) || "";
        case "%":
          return "%";
        case "^":
          return other === target ? "" : "s";
        case "&":
          return other === target ? "" : "es";
        case "$":
          return "$";
      }
      return "<unknown>";
    });

    targetText = targetText[0].toUpperCase() + targetText.substring(1);
    console.log(`${other.name} sees: ${targetText}`);
    other.send(targetText);
  }
}
