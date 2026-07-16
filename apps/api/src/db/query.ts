import { dbPool } from "./pool";
import * as schema from "../schema/schema";


export async function getAllTasks() {
   return await dbPool.query(
                `SELECT id,
                        title,
                        description,
                        status,
                        created_at AS "createdAt",
                        updated_at AS "updatedAt"
                 FROM tasks
                 ORDER BY id `,
            );
}

export async function getDBTime() {
   return await dbPool.query("SELECT NOW() AS current_time");
}

