export type RaceId = number & { __flavor?: "race" };
export class Race {
  id: RaceId = 0;
  name = "";
  description = "";
}
