import { Character } from "../../world/character";
import { CommandList } from "../playing-interpreter";

export const Commands: CommandList = {
  get({ ch, command, args }) {
    if (!ch.room) {
      return ch.send("You can't pick up anything from the void.");
    }

    if (args.length === 0) {
      return ch.send("What do you want to get?");
    }

    for (let item of ch.room.items.values()) {
      if (item.name.split(";").includes(args[0])) {
        item.moveFrom();
        item.moveTo(ch);
        ch.send(`You pick up ${item.name}`);
        return;
      }
    }

    ch.send(`You do not see ${args[0]} here`);
  },
  inventory({ ch, command, args }) {
    const items = Array.from(ch.items, (item) => `- ${item.name}`);
    ch.send(items);
  },
};
Commands.i = Commands.inventory;
