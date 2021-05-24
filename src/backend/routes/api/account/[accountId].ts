import { Accounts } from "../../../database/account";
import { tryRequestHandler } from "../../../route-setup";

export const get = tryRequestHandler(async (req, res, next) => {
  const results = await Accounts.getBySlackId(req.params.accountId);
  res.json(results.rows);
});
