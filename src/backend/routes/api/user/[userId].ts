import { Users } from "../../../database/user";
import { tryRequestHandler } from "../../../route-setup";

export const get = tryRequestHandler(async (req, res, next) => {
  const results = await Users.getBySlackId(req.params.userId);
  res.json(results.rows);
});
