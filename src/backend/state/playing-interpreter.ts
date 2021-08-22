import { Character } from "../world/entities";
import { Position } from "../world/data-types/position";

type CommandAction = (ch: Character, command: string, args: string[]) => void;

type CommandEntry = [CommandAction, number, Position];

export interface CommandArgs {
  ch: Character;
  command: string;
  rest: string;
}

export interface CommandList {
  [name: string]: (cmd: CommandArgs) => void;
}

export function oneArgument(args: string) {
  args = args.trim();
  let delimiter = " ";
  if (args[0] === "'" || args[0] === '"') {
    delimiter = args[0];
    args = args.substr(1);
  }

  let first = "";
  let rest = "";
  const index = args.indexOf(delimiter);
  if (index === -1) {
    first = args;
  } else {
    first = args.substring(0, index);
    rest = args.substring(index);
  }
  return [first, rest];
}
