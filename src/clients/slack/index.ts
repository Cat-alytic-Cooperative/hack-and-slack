import {
  Button,
  Mrkdwn,
  Option,
  PlainText,
  Section,
  StaticSelect,
  Input,
  Divider,
} from "@slack-wrench/blocks";
import {
  App,
  ButtonAction,
  ExpressReceiver,
  KnownBlock,
  SlackAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { World } from "../../backend/world";
import { SlackClient } from "../../backend/world/client";

export function startSlackClient(world: World) {
  try {
    const appSettings = {
      token: process.env.SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      socketMode: true,
      appToken: process.env.APP_TOKEN,
    };

    console.log(appSettings);

    const app = new App(appSettings);

    app.message(async (props) => {
      if (props.message.type !== "message") {
        return;
      }
      if (!("user" in props.message) || !props.message.user) {
        return;
      }
      console.log("message", props.message);

      const clientId = `SLACK-${props.message.user}`;
      let client = world.clients.get(clientId);
      if (!client) {
        client = new SlackClient(clientId, world, app);
        world.clients.set(clientId, client);
      }

      client.input.add(props.message.text || "");
    });
    return app.start().then(() => {
      console.log(`⚡️ Bolt app started in socket mode`);
    });
  } catch (e) {
    console.error(e);
  }
}
