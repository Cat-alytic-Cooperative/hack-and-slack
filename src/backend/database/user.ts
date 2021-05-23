import { QueryResult } from "pg";
import { BaseQueryObject, performQuery, queryObjectBuilder } from "../database";

import { User } from "../../shared/models/user";

export interface UserQueryObject extends BaseQueryObject<User> {
  getBySlackId(id: string): Promise<QueryResult<User>>;
}

export const Users = queryObjectBuilder<User, UserQueryObject>("user");
Users.getBySlackId = async function (id: string) {
  return performQuery(`SELECT * FROM user WHERE slackId = $1`, [id]);
};
