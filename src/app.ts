import { App } from "@slack/bolt";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN
});

app.event("app_home_opened", async (props) => {
  console.log(props.event);

  props.client.views.publish({
    user_id: props.event.user,
    view: {
      type: "home",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Welcome to Hack and Slack, <@${props.event.user}> :crossed_swords:`,
          },
        },
      ],
    },
  });
});

(async () => {
  await app.start();
  console.log("⚡️ Bolt app started");
})();
