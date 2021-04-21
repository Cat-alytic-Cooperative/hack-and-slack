import { Button, Mrkdwn, Option, PlainText, Section, StaticSelect, Input, Divider } from "@slack-wrench/blocks";
import { App, ButtonAction, ExpressReceiver, KnownBlock, SlackAction, SlackActionMiddlewareArgs } from "@slack/bolt";

import Queue from "bull";

import initializeCharacterCreation from "./character-creation";
import initializeHomeTab from "./home";
import initializeInterpreter from "./interpreter";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
// Initialize your custom receiver
const expressReceiver = new ExpressReceiver({
  signingSecret: String(process.env.SLACK_SIGNING_SECRET),
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver: expressReceiver,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

initializeCharacterCreation(app);
initializeInterpreter(app);
initializeHomeTab(app);

import { initializeRouter } from "./route-setup";

const workQueue = new Queue("work", REDIS_URL);
workQueue.on("global:completed", (jobId, result) => {
  console.log(`${jobId} =>`, result);
});

(async () => {
  await initializeRouter(expressReceiver.router);
  //  await expressReceiver.start(Number(process.env.PORT) || 3000);
  const port = Number(process.env.PORT) || 5000;
  const server = await app.start(port);
  setInterval(async () => {
    const job = await workQueue.add({ jobDetails: 1 });
    console.log(`Created job ${job.id}`);
  }, 5000);
  console.log(`⚡️ Bolt app started on port ${port}`);
})();
