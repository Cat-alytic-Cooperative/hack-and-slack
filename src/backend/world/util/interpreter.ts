import { Affects } from "../affect";
import { Character } from "../entities/character";

export function interpreter(ch: Character, args: string) {
  // No hiding
  ch.affectedBy.delete(Affects.Hide);
  /*
  if (!ch.isNPC && ch.act.has(Acts.Freeze)) {
    return ch.send("You're totally frozen.");
  }

  let log = args;
  let command;
  if (!args[0].match(/^[a-z0-9]$/i)) {
    command = args[0];
    args = args.substr(1);
  } else {
    [command, args] = oneArgument(args);
  }

  const cmd = WORLD.findCommand(command);

  if (cmd && !Array.isArray(cmd)) {
    // if cmd logging is NEVER, then don't log it
    //     log = '';
  }

  if ((!ch.isNPC && ch.act.has(Acts.Log)) || WORLD.flags.logAll) {
    log = `Log ${ch.name}: log`;
    WORLD.wiznet(log, ch);
    console.log(log);
  }

  if (ch instanceof Player) {
    ch.client?.snoopyBy?.send(`% ${log}`);
  }

  if (cmd === undefined) {
    if (!checkSocial(ch, command, args)) {
      ch.send("Huh?");
      return;
    }
  }
  */
}

function oneArgument(args: string) {
  args = args.trim();
  let delimiter = " ";
  if (args[0] === "'" || args[0] === '"') {
    delimiter = args[0];
    args = args.substr(1);
  }

  let first = "";
  let rest = "";
  const index = args.indexOf(delimiter);
  if (index === -1) {
    first = args;
  } else {
    first = args.substring(0, index);
    rest = args.substring(index);
  }
  return [first, rest];
}

function checkSocial(ch: Character, commmand: string, args: string) {
  /*
  const results = WORLD.findSocials(commmand);
  if (!results || Array.isArray(results)) {
    return false;
  }

  if (!ch.isNPC && ch.comm.has(CommunicationFlags.NoEmote)) {
    ch.send("You are anti-social!");
    return true;
  }

  switch (ch.position) {
    case Position.Dead:
      ch.send("Lie still; you are DEAD.");
      return true;

    case Position.Incapacitated:
    case Position.Mortal:
      ch.send("You are hurt far too bad for that.");
      return true;

    case Position.Stunned:
      ch.send("You are too stunned to do that.");
      return true;

    case Position.Sleeping:
      if (results.phrase !== "snore") {
        ch.send("In your dreams, or what?");
        return true;
      }
  }

  let target = "";
  let victim: Character | undefined;
  [target, args] = oneArgument(args);

  if (!target || target === "") {
  } else if (!(victim = ch.room?.findCharacter(ch, target))) {
    ch.send("They aren't here.");
  } else if (victim === ch) {
  } else {
    if (!ch.isNPC && victim.isNPC && !victim.affectedBy.has(Affects.Charm) && victim.isAwake) {
    }
  }
  return true;
  */
}
