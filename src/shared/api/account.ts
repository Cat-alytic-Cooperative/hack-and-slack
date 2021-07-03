import { Accounts } from "../database/account";
import { Account } from "../../backend/world/account";
import { getApi } from "./api";

export async function getAccountBySlackId(id = "<missing>") {
  return getApi<Account>(`account/${id}`, Account);
}

export interface AccountRegistration {
  slackId: string;
}

export interface PlayerCreation {
  slackId: string;
}

export async function registerAccountAndPlayer(slackId: string, ) {
  Accounts.insert
}