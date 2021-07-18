import { Player } from "../world/player";

export interface CommandList {
  [name: string]: (player: Player, command: string, args: string[]) => void;
}

export function interpret(player: Player, command: string) {}
