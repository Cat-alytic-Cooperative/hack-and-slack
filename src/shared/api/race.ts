import { Races } from "../database/race";
import { Race } from "../../backend/world/race";
import { getApi } from "./api";

export async function getRaceById(id = 0) {
  return getApi<Race>(`race/${id}`, Race);
}
