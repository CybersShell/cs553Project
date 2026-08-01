import { dbPool } from "./pool";
import * as schema from "../schema/schema";


export async function getDBTime() {
   return await dbPool.query("SELECT NOW() AS current_time");
}

