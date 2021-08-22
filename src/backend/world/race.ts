import { Thing, ThingMap } from "./entities/thing";

export class Race implements Thing {
  id = 0;
  name = "";
  description = "";

  playable = false;
}

export class RaceMap extends ThingMap<number, Race> {
  getAllPlayable() {
    return [...this.values()].filter((race) => race.playable);
  }
}
