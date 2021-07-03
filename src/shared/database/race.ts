import { QueryResult } from "pg";
import { BaseQueryObject, performQuery, queryObjectBuilder } from "./connection";

import { Race } from "../../backend/world/race";

export interface RaceQueryObject extends BaseQueryObject<Race> {
  getByName(name: string): Promise<QueryResult<Race>>;
}

export const Races = queryObjectBuilder<Race, RaceQueryObject>("race");
Races.getByName = async function (name: string) {
  return performQuery(`SELECT * FROM race WHERE race.name = $1`, [name]);
};
