import { PlainText, Input, StaticSelect, Option } from "@slack-wrench/blocks";
import { App } from "@slack/bolt";

export default function initializeCharacterCreation(app: App) {
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
}
