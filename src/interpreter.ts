import { App } from "@slack/bolt";
import { isPlaying } from "./gameplay";

export default function initializeInterpreter(app: App) {
  app.message(async (props) => {
    if (props.message.type !== "message") {
      return;
    }
    if (!("user" in props.message) || !props.message.user) {
      return;
    }
    console.log("message", props.message);
    if (!isPlaying(props.message.user)) {
      props.say("You must start a game with one of your characters first.");
    }
  });
}
