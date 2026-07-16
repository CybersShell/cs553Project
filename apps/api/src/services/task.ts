import { dbPool } from "../db/pool";
import * as schema from "../schema/schema";

export async function createTask(task: schema.Task) {
   return await dbPool.query(
      `INSERT INTO tasks (title) VALUES ($1) RETURNING *`
      , [task.title]
   )
}

export async function getTask(id: any) {
      return await dbPool.query(
                `SELECT id,
                        title,
                        description,
                        status,
                        created_at AS "createdAt",
                        updated_at AS "updatedAt"
                 FROM tasks
                 WHERE id = ($1)`, [id]
            );
}

export async function updateTask(task: schema.Task) {
      return await dbPool.query(
               `UPDATE tasks
                  SET
                      title = CASE WHEN $2 != '' THEN $2 ELSE title END,
                      status = CASE WHEN $3 != '' THEN $3 ELSE status END,
                      description = CASE WHEN $4 != '' THEN $4 ELSE description END,
                  updated_at = NOW()
                  WHERE id = ($1) RETURNING id,
                        title,
                        description,
                        status,
                        created_at AS "createdAt",
                        updated_at AS "updatedAt";`,
               [task.id, task.title, task.status, '']
               // TODO: add more parameters
            );
}

export async function deleteTask(id: any) {
      return await dbPool.query(
               `DELETE FROM tasks where id = ($1);`,
               [id]
            );
}