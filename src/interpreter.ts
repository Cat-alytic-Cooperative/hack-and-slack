import { App } from "@slack/bolt";

export default function initializeInterpreter (app: App) {
  app.message(async (props) => {
    console.log("message", props.message);
  });
}

