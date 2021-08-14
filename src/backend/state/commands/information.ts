import { Player } from "../../world/player";
import { CommandList } from "../playing-interpreter";

function lookRoom(player: Player) {
  if (!player.location) {
    return player.send("You are not in a location.");
  }

  player.send([
    `*${player.location.name}*`,
    player.location.description,
    ...Array.from(player.location.contents, (content) => `- ${content.name}`),
  ]);
}

export const Commands: CommandList = {
  list(player: Player, command: string, args: string[]) {
    console.log("list");
  },
  look(player: Player, command: string, args: string[]) {
    console.log("look", command, args);
    if (args.length === 0 || args[1] === "here") {
      lookRoom(player);
    }
  },
};
Commands["l"] = Commands.look;
