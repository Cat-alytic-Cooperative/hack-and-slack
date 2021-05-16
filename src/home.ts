import { Section, Mrkdwn, Button } from "@slack-wrench/blocks";
import { App, Block, KnownBlock } from "@slack/bolt";
import { world } from "./world";
import { Actions } from "./blocks/actions-block";

export default function initializeHomeTab(app: App) {
  app.event("app_home_opened", async (props) => {
    console.log(props.event);

    let blocks: (Block | KnownBlock)[] = [];
    if (world.players.get(props.event.user)) {
      blocks = [Section({ text: Mrkdwn(`Welcome back to Hack and Slack, <@${props.event.user}> :crossed_swords:`) })];
    } else {
      blocks = [
        Section({
          text: Mrkdwn(
            `Welcome to Hack and Slack, <@${props.event.user}> :crossed_swords:. Before you can begin your adventure, you must create a character.`
          ),
        }),
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
