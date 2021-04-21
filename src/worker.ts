const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

import Quere from "bull";

const workQueue = new Quere("work", REDIS_URL);

workQueue.process(10, async (job) => {
  console.log("worker: job:", job.id, job.data);
  return { value: "hello" };
});
