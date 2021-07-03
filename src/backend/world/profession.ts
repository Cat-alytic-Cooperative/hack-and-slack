export type ProfessionId = number & { __flavor?: "profession" };
export class Profession {
  id: ProfessionId = 0;
  name = "";
  description = "";
}
