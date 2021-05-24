const REDIS_URL = String(process.env.REDIS_URL);

import Queue, { ProcessCallbackFunction } from "bull";
import { World } from "./world";
import Express from "express";
import { initializeRouter } from "./route-setup";

const workQueue = new Queue("work", REDIS_URL);

const workProcessor: ProcessCallbackFunction<any> = async (job) => {
  const data = job.data;
  console.log("worker: job:", job.id, job.data);
  if (!data.type) {
    return { type: "error", message: "Invalid request type" };
  }
  return { value: "hello" };
};

workQueue.process(10, workProcessor);

export const world = new World();

async function main() {
  const app = Express();

  await initializeRouter(app);

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

  console.log(process.env);
}

main();
