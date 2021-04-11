import { Button, Mrkdwn, Option, PlainText, Section, StaticSelect, Input, Divider } from "@slack-wrench/blocks";
import { App, ButtonAction, KnownBlock, SlackAction, SlackActionMiddlewareArgs } from "@slack/bolt";
import { World } from "./world";

import initializeCharacterCreation from "./character-creation";
import initializeInterpreter from "./interpreter";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

const world = new World();

initializeCharacterCreation(app);
initializeInterpreter(app);

app.event("app_home_opened", async (props) => {
  console.log(props.event);

  let blocks: KnownBlock[] = [];
  if (world.players.get(props.event.user)) {
    blocks = [Section({ text: Mrkdwn(`Welcome back to Hack and Slack, <@${props.event.user}> :crossed_swords:`) })];
  } else {
    blocks = [
      Section({
        text: Mrkdwn(
          `Welcome to Hack and Slack, <@${props.event.user}> :crossed_swords:. Before you can begin your adventure, you must create a character.`
        ),
        accessory: Button(`:heavy_plus_sign:`, "create_character"),
      }),
    ];
  }

  props.client.views.publish({
    user_id: props.event.user,
    view: {
      type: "home",
      blocks,
    },
  });
});

(async () => {
  await app.start();
  console.log("⚡️ Bolt app started");
})();
