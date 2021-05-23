export type MobileId = number & { __flavor?: "mobile" };
export class Mobile {
  id: MobileId = 0;
}
