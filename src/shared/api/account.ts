import { Accounts } from "../database/account";
import { Client } from "../../backend/world/client";
import { getApi } from "./api";

export async function getAccountBySlackId(id = "<missing>") {
  return getApi<Client>(`account/${id}`, Client);
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