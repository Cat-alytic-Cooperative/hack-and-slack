const REDIS_URL = String(process.env.REDIS_URL);

import Queue, { ProcessCallbackFunction } from "bull";
import { World } from "./world";
import { Message } from "../shared/worker/messages";
import { Player } from "./world/player";


export function main() {
  const commandQueue = new Queue("command", REDIS_URL);

  const commandProcessor: ProcessCallbackFunction<Message> = async (job) => {
    const data = job.data;
    console.log("worker: job:", job.id, job.data);
    if (!data.type) {
      return { type: "error", message: "Invalid request type" };
    }

    // Check if the user is playing
    const userId = data.sender;

    switch (job.data.type) {
      case "command":
        console.log(job.data.command);
        break;
    }
    return { value: "hello" };
  };

  commandQueue.process(10, commandProcessor);
}