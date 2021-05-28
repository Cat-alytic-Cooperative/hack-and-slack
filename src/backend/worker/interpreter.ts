import Queue, { ProcessCallbackFunction } from "bull";
import { Message } from "../../shared/worker/messages";

const REDIS_URL = String(process.env.REDIS_URL);

export function interpreterWorker() {
  const workQueue = new Queue("work", REDIS_URL);

  const workProcessor: ProcessCallbackFunction<any> = async (job) => {
    const data = job.data;
    console.log("worker: job:", job.id, job.data);
    if (!data.type) {
      return { type: "error", message: "Invalid request type" };
    }
    const message = data as Message;
    switch (message.type) {
      case "command":
        console.log(message.command);
        break;
    }
    return { value: "unknown command" };
  };

  return {
    start() {
      workQueue.process(10, workProcessor);
    },
  };
}
