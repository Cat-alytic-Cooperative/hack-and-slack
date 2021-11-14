import { Accounts } from "../database/account";
import { MudClient } from "../../backend/world/client";
import { getApi } from "./api";

export async function getAccountBySlackId(id = "<missing>") {
  return getApi<MudClient>(`account/${id}`, MudClient);
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