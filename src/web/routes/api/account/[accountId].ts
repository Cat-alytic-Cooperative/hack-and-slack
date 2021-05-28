import { Accounts } from "../../../../shared/database/account";
import { tryRequestHandler } from "../../../route-setup";

export const get = tryRequestHandler(async (req, res, next) => {
  const results = await Accounts.getBySlackId(req.params.accountId);
  if (results.rowCount === 0) {
    return res.sendStatus(404);
  }
  res.json(results.rows[0]);
});
