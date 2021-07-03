import Express from "express";
import { initializeRouter } from "../web/route-setup";

export function main() {
  const app = Express();

  initializeRouter(app);

  app.get("/error", (req, res) => {
    res.send("Oh noes");
  });

  app.use((error: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    console.log("error", error);
    if (error instanceof Error) {
      res.sendStatus(500);
    }
  });

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Slack and Hack is listening on port ${port}`);
  });
}
