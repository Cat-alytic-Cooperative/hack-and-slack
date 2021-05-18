import { queryObjectBuilder } from "../database";

export interface Player {

}

const Player = queryObjectBuilder<Player>("player")