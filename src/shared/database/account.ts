import { QueryResult } from "pg";
import { BaseQueryObject, performQuery, queryObjectBuilder } from "./connection";

import { Client } from "../../backend/world/client";

export interface AccountQueryObject extends BaseQueryObject<Client> {
  getBySlackId(id: string): Promise<QueryResult<Client>>;
}

export const Accounts = queryObjectBuilder<Client, AccountQueryObject>("account");
Accounts.getBySlackId = async function (id: string) {
  return performQuery(`SELECT * FROM account WHERE account.slack_id = $1`, [id]);
};
