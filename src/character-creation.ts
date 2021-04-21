import {
  PlainText,
  Input,
  StaticSelect,
  Option,
  Actions,
  Context,
  Mrkdwn,
  Divider,
  ActionsBlock,
} from "@slack-wrench/blocks";
import * as S from "@slack/types";
import { App, Block, KnownBlock, SlackAction } from "@slack/bolt";

function optionFromValue(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }
  return Option(value, value);
}

export default function initializeCharacterCreation(app: App) {
  function generateCreationModal(action?: SlackAction) {
    try {
      const Abilities = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
      if (action && "actions" in action) {
        console.log("Generating from an Action:", action, action.actions);
      }

      let primaryAbilities = [...Abilities];
      let selectedPrimary: string | undefined = undefined;
      let secondaryAbilities = [...Abilities];
      let selectedSecondary: string | undefined = undefined;
      if (action && "view" in action) {
        console.log("1", action.view?.state.values.ability_scores);
        console.log("primary", action.view?.state.values.ability_scores.choose_primary_action?.selected_option?.value);
        console.log(
          "secondary",
          action.view?.state.values.ability_scores.choose_secondary_action?.selected_option?.value
        );
        selectedPrimary =
          action.view?.state.values.ability_scores.choose_primary_action?.selected_option?.value || undefined;
        selectedSecondary =
          action.view?.state.values.ability_scores.choose_secondary_action?.selected_option?.value || undefined;

        primaryAbilities = primaryAbilities.filter((entry) => !action || entry !== selectedSecondary);
        secondaryAbilities = secondaryAbilities.filter((entry) => !action || entry !== selectedPrimary);
      }

      console.log(
        "selected",
        { selectedPrimary, selectedSecondary },
        optionFromValue(selectedPrimary),
        optionFromValue(selectedSecondary)
      );

      return [
        Input(
          "Race",
          StaticSelect("race", "Choose Your Race", [Option("Human", "human"), Option("Elf", "elf")]),
          "creation_race",
          PlainText("There are a lot of races to choose from. All good.")
        ),
        Input(
          "Class",
          StaticSelect("class", "Choose Class", [Option("Fighter", "fighter"), Option("Mage", "mage")]),
          "creation_class",
          PlainText("Lots of sick classes.")
        ),
        ActionsBlock("ability_scores", [
          StaticSelect(
            "choose_primary_action",
            "Primary Ability",
            primaryAbilities.map((entry) => Option(entry, entry)),
            optionFromValue(selectedPrimary)
          ),
          StaticSelect(
            "choose_secondary_action",
            "Secondary Ability",
            secondaryAbilities.map((entry) => Option(entry, entry)),
            optionFromValue(selectedSecondary)
          ),
        ]),
      ];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  app.view("create_character_callback", async (props) => {
    console.log("view_submission", props.view.state);
    for (let entry of Object.entries(props.view.state)) {
      console.log(entry);
      Object.entries(entry[1]).forEach((stuff) => {
        console.log(stuff);
      });
    }
    await props.ack();
  });

  app.action(/choose_(.+)_action/, async (props) => {
    console.log("choose_class_action", props.body);
    await props.ack();
    if (!("view" in props.body) || !props.body.view?.id) {
      return;
    }
    try {
      const blocks = props.body.view.blocks as (Block | KnownBlock)[];
      console.log(blocks);
      await props.client.views.update({
        trigger_id: props.body.trigger_id,
        view_id: props.body.view?.id,
        view: {
          callback_id: "create_character_callback",
          title: PlainText("Create a Character"),
          type: "modal",
          blocks: generateCreationModal(props.body),
          close: PlainText("Cancel"),
          submit: PlainText("Create"),
        },
      });
    } catch (e) {
      console.error(e.data);
    }
  });

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
            blocks: generateCreationModal(),
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
