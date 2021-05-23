export type UserId = number & { __flavor?: "user" };
export class User {
  id: UserId = 0;
  slackId = "";
  username = "";
}
