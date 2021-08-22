import { Character } from "../../world/entities/character";
import { broadcast, BroadcastTarget } from "../../world/util/broadcast";
import { CommandList } from "../playing-interpreter";

export const Commands: CommandList = {
  say({ ch, command, rest }) {
    broadcast(ch, BroadcastTarget.Room, `$n say$% "${rest}"`);
  },
};
