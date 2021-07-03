import { Button, Mrkdwn, Option, PlainText, Section, StaticSelect, Input, Divider } from "@slack-wrench/blocks";
import { App, ButtonAction, ExpressReceiver, KnownBlock, SlackAction, SlackActionMiddlewareArgs } from "@slack/bolt";

import Queue from "bull";

import initializeCharacterCreation from "./character-creation";
import initializeHomeTab from "./home";
import initializeInterpreter from "./interpreter";

const REDIS_URL = String(process.env.REDIS_URL);
// Initialize your custom receiver
const expressReceiver = new ExpressReceiver({
  signingSecret: String(process.env.SLACK_SIGNING_SECRET),
});

const appSettings = {
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  //  receiver: expressReceiver,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
};

console.log(appSettings);

const app = new App(appSettings);

initializeCharacterCreation(app);
initializeInterpreter(app);
initializeHomeTab(app);

const workQueue = new Queue("work", REDIS_URL);
workQueue.on("global:completed", (jobId, result) => {
  console.log(`${jobId} =>`, result);
});

export function main() {
  try {
    //  await expressReceiver.start(Number(process.env.PORT) || 3000);
    const port = Number(process.env.PORT) || 5000;
    app.start(port);
    /*
  setInterval(async () => {
    const job = await workQueue.add({ jobDetails: 1 });
    console.log(`Created job ${job.id}`);
  }, 5000);
  */
    console.log(`⚡️ Bolt app started on port ${port}`);
  } catch (e) {
    console.error(e);
  }
}
