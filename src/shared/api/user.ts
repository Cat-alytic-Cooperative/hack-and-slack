import axios from "axios";
import { User } from "../models/user";

export function getUserBySlackId(id: string = "<missing>") {
  return axios.get(`http://localhost:5000/api/user/${id}`).then((response) => response.data as User);
}
