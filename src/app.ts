import { Button, Mrkdwn, Option, PlainText, Section, StaticSelect, Input, Divider } from "@slack-wrench/blocks";
import { App, ButtonAction, KnownBlock, SlackAction, SlackActionMiddlewareArgs } from "@slack/bolt";
import { World } from "./world";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});

const world = new World();

app.action("create_character", async (props) => {
  console.log("create_character", props.body);

  try {
    if ("trigger_id" in props.body) {
      const result = await props.client.views.open({
        trigger_id: props.body.trigger_id,
        view: {
          type: "modal",
          callback_id: "create_character_callback",
          title: PlainText("Create a Character"),
          blocks: [
            Input("Race", StaticSelect(undefined, "Choose Race", [Option("Human", "human"), Option("Elf", "elf")])),
          ],
          close: PlainText("Cancel"),
          submit: PlainText("Create"),
        },
      });
      console.log(result);
    }
  } catch (e) {
    console.error(e);
  }

  await props.ack();
});

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
