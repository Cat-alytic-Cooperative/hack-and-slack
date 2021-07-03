export type ExitId = number & { __flavor?: "exit" };
export class Exit {
  id: ExitId = 0;
  name = "";
  description = "";
}
