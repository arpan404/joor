import Joor from "joor";
const app = new Joor();
await app.start();
import { Hash } from "joor";
console.log(await Hash.encrypt("Hello"));
