import { RequestHandler } from "express";

export const get: RequestHandler = (req, res) => {
  console.log(req.params);
  res.json({ type: "hello" });
};
