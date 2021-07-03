export type AccountId = number & { __flavor?: "account" };
export class Account {
  id: AccountId = 0;
  clientId = "";
}

export class AccountMap extends Map<AccountId, Account> {
  getByClientId(clientId: string) {
    for (let account of this.values()) {
      if (account.clientId === clientId) {
        return account;
      }
    }
    return undefined;
  }
}
