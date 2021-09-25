import dotenv from "dotenv";

dotenv.config();

console.log("1")
import { main as backend } from "../backend/app";
console.log("2")
import { main as discord } from "../discord/app";
console.log("3")
import { main as web } from "../web/app";
console.log("4")

console.log("single-dyno.ts");

async function singleDynoMain() {
  try {
    console.log("Starting backend");
    backend();
    //    slack();
    console.log("Starting discord");
    discord();
    web();
  } catch (e) {
    console.error(e);
  }
}

singleDynoMain();
