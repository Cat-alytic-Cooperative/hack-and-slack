import { Thing, ThingMap } from "./thing";

export type RaceId = number & { __flavor?: "race" };
export class Race implements Thing {
  id: RaceId = 0;
  name = "";
  description = "";

  playable = false;
}

export class RaceMap extends ThingMap<RaceId, Race> {
  getAllPlayable() {
    return [...this.values()].filter((race) => race.playable);
  }
}
