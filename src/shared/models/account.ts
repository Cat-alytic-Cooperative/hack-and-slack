export type AccountId = number & { __flavor?: "account" };
export class Account {
  id: AccountId = 0;
  slack_id = "";
  username = "";
}
