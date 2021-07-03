import { Accounts } from "../../../shared/database/account";
import { Account } from "../../../backend/world/account";
import { tryRequestHandler } from "../../route-setup";

export const post = tryRequestHandler(async (req, res, next) => {
  const account: Partial<Account> = {
    slack_id: req.body.slackId
  };
  const results = await Accounts.insert(account);
  return results.rows[0];
});
