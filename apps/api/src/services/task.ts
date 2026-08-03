import { dbPool } from "../db/pool";
import * as schema from "../schema/schema";

export async function getAllTasks() {
   return await dbPool.query(
      `SELECT id,
                        title,
                        description,
                        status,
                        assigned_to AS "assignedTo",
                        created_at AS "createdAt",
                        updated_at AS "updatedAt"
                 FROM tasks
                 ORDER BY id`,
   );
}

export async function createTask(task: schema.Task, isAdmin: boolean = false): Promise<any> {
   if (isAdmin) {
      if (task.projectID) {
         const checkProject = await dbPool.query(
            `SELECT id FROM projects WHERE id = $1;`, [task.projectID]
         );
         if (checkProject.rowCount == 0) {
            return {
               Error: `Updating task failed: Project with ID ${task.projectID} does not exist`,
               statusCode: 404
            };
         }
      }
      return await dbPool.query(
         `INSERT INTO tasks (title, assigned_to, project_id, description) VALUES ($1, $2, $3, $4) RETURNING *`
         , [task.title, task.assignedTo, task.projectID, task.description]
      );
   }

   if (task.projectID) {
      const checkProject = await dbPool.query(
         `SELECT id FROM projects WHERE id = $1 and owner_id = $2;`, [task.projectID, task.assignedTo]
      );
      if (checkProject.rowCount == 0) {
         return {
            Error: `Updating task failed: Project with ID ${task.projectID} does not exist or user is not owner`,
            statusCode: 404
         };
      }
   }
   return await dbPool.query(
      `INSERT INTO tasks (title, assigned_to, project_id, description) VALUES ($1, $2, $3, $4) RETURNING *`
      , [task.title, task.assignedTo, task.projectID, task.description]
   );
}

export async function getTasksForUser(userId: number) {
   return await dbPool.query(
      `SELECT id,
                        title,
                        description,
                        status,
                        assigned_to AS "assignedTo",
                        created_at AS "createdAt",
                        updated_at AS "updatedAt"
                 FROM tasks
                 WHERE assigned_to = $1;`, [userId]
   );
}

export async function getTaskById(id: any, userId: number, isAdmin: boolean = false): Promise<any> {
   if (isAdmin) {
      const checkProject = await dbPool.query(
         `SELECT id FROM tasks WHERE id = $1`, [id]
      );
      if (checkProject.rowCount == 0) {
         return {
            Error: `Fetching task failed: task with ID ${id} does not exist`,
            statusCode: 404
         };
      }
   }
   return await dbPool.query(
      `SELECT id,
                        title,
                        description,
                        status,
                        assigned_to AS "assignedTo",
                        created_at AS "createdAt",
                        updated_at AS "updatedAt"
                 FROM tasks
                 WHERE id = $1 AND assigned_to = $2;`, [id, userId]
   );
}
export async function updateTask(task: schema.Task, userId: number, isAdmin: boolean = false): Promise<any> {
   if (isAdmin) {
      if (task.projectID) {
         const checkProject = await dbPool.query(
            `SELECT id FROM projects WHERE id = $1;`, [task.projectID]
         );
         if (checkProject.rowCount == 0) {
            return {
               Error: `Updating task failed: Project with ID ${task.projectID} does not exist`,
               statusCode: 404
            };
         }
      }
      if (task.assignedTo) {
         const checkUser = await dbPool.query(
            `SELECT id FROM users WHERE id = $1;`, [task.assignedTo]
         );
         if (checkUser.rowCount == 0) {
            return {
               Error: `Updating task failed: user with ID ${task.projectID} does not exist`,
               statusCode: 404
            };
         }
      }

      return await dbPool.query(
         `UPDATE tasks
                  SET
                      title = CASE WHEN $2 != '' THEN $2 ELSE title END,
                      status = CASE WHEN $3 != '' THEN $3 ELSE status END,
                      description = CASE WHEN $4 != '' THEN $4 ELSE description END,
                      project_id = CASE WHEN $5 != 0 THEN $5 ELSE project_id END,
                      assigned_to = CASE WHEN $6 != 0 THEN $6 ELSE assigned_to END,
                      updated_at = NOW()
                  WHERE id = ($1) RETURNING id,
                        title,
                        description,
                        status,
                        project_id AS "projectID",
                        assigned_to AS "assignedTo",
                        created_at AS "createdAt",
                        updated_at AS "updatedAt";`,
         [task.id, task.title, task.status, task.description, task.projectID, task.assignedTo]
      );
   }

   if (task.projectID) {
      const checkProject = await dbPool.query(
         `SELECT id FROM projects WHERE id = $1 AND owner_id = $2`, [task.projectID, userId]
      );
      if (checkProject.rowCount == 0) {
         return {
            Error: `Updating task failed: Project with ID ${task.projectID} does not exist or the user does not have access`,
            statusCode: 404
         };
      }
   }
   return await dbPool.query(
      `UPDATE tasks
                  SET
                      title = CASE WHEN $2 != '' THEN $2 ELSE title END,
                      status = CASE WHEN $3 != '' THEN $3 ELSE status END,
                      description = CASE WHEN $4 != '' THEN $4 ELSE description END,
                      project_id = CASE WHEN $5 != 0 THEN $5 ELSE project_id END,
                      updated_at = NOW()
                  WHERE id = ($1) and assigned_to = $6 RETURNING id,
                        title,
                        description,
                        status,
                        project_id AS "projectID",
                        assigned_to AS "assignedTo",
                        created_at AS "createdAt",
                        updated_at AS "updatedAt";`,
      [task.id, task.title, task.status, task.description, task.projectID, userId]
   );
}

export async function deleteTask(id: any, assignedTo: any, isAdmin: boolean = false) {

   if (!isAdmin) {
      return await dbPool.query(
         `DELETE FROM tasks where id = $1 AND assigned_to = $2;`,
         [id, assignedTo]
      );
   }
   return await dbPool.query(
      `DELETE FROM tasks where id = ($1);`,
      [id]
   );
}