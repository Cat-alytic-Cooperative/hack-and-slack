import { Races } from "../../../../shared/database/race";
import { RequestHandler } from "express";

export const get: RequestHandler = async (req, res) => {
  const results = await Races.getById(Number(req.params.raceId));
  if (results.rowCount === 0) {
    return res.sendStatus(404);
  }
  res.json(results.rows[0]);
};
