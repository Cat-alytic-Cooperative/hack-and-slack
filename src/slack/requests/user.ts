import axios from "axios";
import { User } from "../../shared/models/user";

export async function getUserBySlackId(id: string) {
  const response = await axios
    .get<User>("http://localhost:5000");
  const data = response.data;
  return Object.assign(new User(), data);
}
