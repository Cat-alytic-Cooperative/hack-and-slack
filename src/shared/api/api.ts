import axios from "axios";

export async function getApi<T>(path = '', objectConstructor: any = Object) {
  try {
    const response = await axios.get(`http://localhost:5000/api/${path}`);
    const data = response.data;
    console.log("data", data);
    return Object.assign(new objectConstructor(), data) as T;
  } catch (e) {
    return undefined;
  }
}
