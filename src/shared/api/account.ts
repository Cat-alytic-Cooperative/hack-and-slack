import axios from "axios";
import { Account } from "../models/account";

export async function getAccountBySlackId(id: string = "<missing>") {
  const response = await axios.get<Account>("http://localhost:5000");
  const data = response.data;
  return Object.assign(new Account(), data);
}
