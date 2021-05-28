import { main as backend } from "../backend/app";
import { main as slack } from "../slack/app";
import { main as web } from "../web/app";

async function singleDynoMain() {
  try {
    backend();
    slack();
    web();
  } catch (e) {
    console.error(e);
  }
}

singleDynoMain();
