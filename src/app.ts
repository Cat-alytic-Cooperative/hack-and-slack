import { Button, Mrkdwn, Option, PlainText, Section, StaticSelect, Input, Divider } from "@slack-wrench/blocks";
import { App, ButtonAction, KnownBlock, SlackAction, SlackActionMiddlewareArgs } from "@slack/bolt";

import initializeCharacterCreation from "./character-creation";
import initializeHomeTab from "./home";
import initializeInterpreter from "./interpreter";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

initializeCharacterCreation(app);
initializeInterpreter(app);
initializeHomeTab(app);

(async () => {
  await app.start();
  console.log("⚡️ Bolt app started");
})();
