import { Thing, ThingMap } from "./entities/thing";

export class Race implements Thing {
  id = "";
  name = "";
  description = "";

  playable = false;
}

export class RaceMap extends ThingMap<string, Race> {
  getAllPlayable() {
    return [...this.values()].filter((race) => race.playable);
  }
}
