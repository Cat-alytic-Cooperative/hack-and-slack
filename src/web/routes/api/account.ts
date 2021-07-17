import { Accounts } from "../../../shared/database/account";
import { Client } from "../../../backend/world/client";
import { tryRequestHandler } from "../../route-setup";

export const post = tryRequestHandler(async (req, res, next) => {
  const account: Partial<Client> = {
  };
  const results = await Accounts.insert(account);
  return results.rows[0];
});
