import { Character } from "../../world/entities/character";
import { broadcast, BroadcastTarget } from "../../world/util/broadcast";
import { CommandList } from "../playing-interpreter";

export const Commands: CommandList = {
  drop({ ch, command, rest }) {
    if (!ch.room) {
      return ch.send("You can't drop anything in the void.");
    }

    if (!rest) {
      return ch.send("What do you want to drop?");
    }

    const item = ch.findItem(ch, rest);
    if (item) {
      item.moveFrom();
      item.moveTo(ch.room);
      broadcast(ch, BroadcastTarget.Room, "$n drop$% $0n.", item);
    } else {
      ch.send(`You do not see ${rest} here`);
    }
  },
  get({ ch, command, rest }) {
    if (!ch.room) {
      return ch.send("You can't pick up anything from the void.");
    }

    if (!rest) {
      return ch.send("What do you want to get?");
    }

    const item = ch.room.findItem(ch, rest);
    if (item) {
      item.moveFrom();
      item.moveTo(ch);
      broadcast(ch, BroadcastTarget.Room, "$n get$% $0n.", item);
    } else {
      ch.send(`You do not see ${rest} here`);
    }
  },
  inventory({ ch, command, rest }) {
    const items = Array.from(ch.items, (item) => `- ${item.name}`);
    items.unshift("You are carrying:");
    if (items.length === 0) {
      items.push("Nothing");
    }
    ch.send(items);
  },
};
Commands.i = Commands.inventory;
