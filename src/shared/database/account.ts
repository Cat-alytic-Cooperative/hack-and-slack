import { QueryResult } from "pg";
import { BaseQueryObject, performQuery, queryObjectBuilder } from "./connection";

import { Account } from "../models/account";

export interface AccountQueryObject extends BaseQueryObject<Account> {
  getBySlackId(id: string): Promise<QueryResult<Account>>;
}

export const Accounts = queryObjectBuilder<Account, AccountQueryObject>("account");
Accounts.getBySlackId = async function (id: string) {
  return performQuery(`SELECT * FROM account WHERE account.slack_id = $1`, [id]);
};
