import { CompletedEventCallback, ErrorEventCallback, JobOptions, Queue } from "bull";

const listeners: Map<Queue, CompletedEventCallback> = new Map();
export function addAndWait(queue: Queue, data: any, opts?: JobOptions) {
  if (!listeners.has(queue)) {
    const completionListener: CompletedEventCallback = (job, result) => {};
    listeners.set(queue, completionListener);
  }

  return new Promise((resolve, reject) => {
    queue
      .add(data, opts)
      .then((job) => {
        const completedListener: CompletedEventCallback = (job, result) => {
          resolve(result);
          queue.off("completed", completedListener);
          queue.off("error", errorListener);
        };
        const errorListener: ErrorEventCallback = (error) => {
          reject(error);
          queue.off("completed", completedListener);
          queue.off("error", errorListener);
        };

        queue.on("completed", completedListener);
        queue.on("error", errorListener);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
