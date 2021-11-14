import { QueryResult } from "pg";
import { BaseQueryObject, performQuery, queryObjectBuilder } from "./connection";

import { MudClient } from "../../backend/world/client";

export interface AccountQueryObject extends BaseQueryObject<MudClient> {
  getBySlackId(id: string): Promise<QueryResult<MudClient>>;
}

export const Accounts = queryObjectBuilder<MudClient, AccountQueryObject>("account");
Accounts.getBySlackId = async function (id: string) {
  return performQuery(`SELECT * FROM account WHERE account.slack_id = $1`, [id]);
};
