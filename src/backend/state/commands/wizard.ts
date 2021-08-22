import { Player } from "../../world/entities/player";
import { CommandList } from "../playing-interpreter";

export const Commands: CommandList = {
  snoop({ ch, command, rest }) {
    if (!(ch instanceof Player)) {
      return ch.send("Only players may snoop.");
    }

    if (!rest) {
      return ch.send("Whom do you want to snoop on?");
    }
    const victim = ch.room?.findCharacter(ch, rest);
    if (!victim) {
      return ch.send(`There is no one named that here.`);
    }
    if (victim.snoop) {
      if (victim.snoop === ch) {
        victim.snoop = undefined;
        return ch.send(`You stop snooping on ${victim.fullName}.`);
      }
      return ch.send(`Someone is already snooping on ${victim.fullName}.`);
    }
    victim.snoop = ch;
    ch.send(`You are now snooping on ${victim.fullName}.`);
  },
};
