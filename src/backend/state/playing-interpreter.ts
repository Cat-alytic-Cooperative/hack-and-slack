import { Character } from "../world/character";
import { Position } from "../world/data-types/position";

type CommandAction = (ch: Character, command: string, args: string[]) => void;

type CommandEntry = [CommandAction, number, Position];

interface CommandArgs {
  ch: Character,
  command: string,
  args: string[]
}

export interface CommandList {
  [name: string]: (cmd: CommandArgs) => void;
}
