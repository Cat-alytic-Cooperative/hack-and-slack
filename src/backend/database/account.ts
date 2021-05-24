import { QueryResult } from "pg";
import { BaseQueryObject, performQuery, queryObjectBuilder } from "../database";

import { Account } from "../../shared/models/account";

export interface AccountQueryObject extends BaseQueryObject<Account> {
  getBySlackId(id: string): Promise<QueryResult<Account>>;
}

export const Accounts = queryObjectBuilder<Account, AccountQueryObject>("account");
Accounts.getBySlackId = async function (id: string) {
  return performQuery(`SELECT * FROM account WHERE slackId = $1`, [id]);
};
