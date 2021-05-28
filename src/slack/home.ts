import { Section, Mrkdwn, Button } from "@slack-wrench/blocks";
import { App, Block, KnownBlock } from "@slack/bolt";
import { Actions } from "./blocks/actions-block";

import { Queue, Worker } from "bullmq";

import { getAccountBySlackId } from "../shared/api/account";

export default function initializeHomeTab(app: App) {
  console.log("Initializing app home");

  app.event("app_home_opened", async (props) => {
    console.log(props.event);

    const account = await getAccountBySlackId(props.event.user);
    console.log(account);

    let blocks: (Block | KnownBlock)[] = [];
    if (account) {
      blocks = [Section({ text: Mrkdwn(`Welcome back to Hack and Slack, <@${props.event.user}> :crossed_swords:`) })];
    } else {
      blocks = [
        Section({
          text: Mrkdwn(
            `Welcome to Hack and Slack, <@${props.event.user}> :crossed_swords:. Before you can begin your adventure, you must create a character.`
          ),
        }),
        Actions(undefined, [Button(`Register this Slack account`, 'register_account')]),
        Actions(undefined, [Button(`:heavy_plus_sign: Create a Character`, "create_character")]),
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
}
