import axios from "axios";
import { Account } from "../models/account";

export async function getAccountBySlackId(id: string = "<missing>") {
  try {
    const response = await axios.get<Account>(`http://localhost:5000/api/account/${id}`);
    const data = response.data;
    console.log("data", data);
    return Object.assign(new Account(), data);
  } catch (e) {
    return undefined;
  }
}
