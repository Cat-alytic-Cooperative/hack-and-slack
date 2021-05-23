import { RequestHandler } from "express";

import { Users } from "../../../database/user";

export const get: RequestHandler = (req, res) => {
  res.json(Users.getBySlackId(req.params.userId));
};
