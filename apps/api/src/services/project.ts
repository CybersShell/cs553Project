import { dbPool } from "../db/pool";
import * as schema from "../schema/schema";

export async function getAllProjects() {
   return await dbPool.query(
      `SELECT id,
                        name,
                        description,
                        owner_id,
                        created_at AS "createdAt",
                 FROM projects
                 ORDER BY id`,
   );
}

export async function createProject(Project: schema.Project) {
   return await dbPool.query(
      `INSERT INTO projects (name, owner_id, description) VALUES ($1, $2, $3) RETURNING *`
      , [Project.name, Project.ownerId, Project.description]
   );
}

export async function getProjectsForUser(userId: number) {
   return await dbPool.query(
      `SELECT id,
              name,
              description,
              owner_id,
              created_at AS "createdAt"
              FROM projects
      WHERE owner_id = $1`, [userId]
   );
}

export async function getProjectById(id: number, userId: number, isAdmin: boolean = false): Promise<any> {
   if (isAdmin) {
      return await dbPool.query(
         `SELECT id,
                        name,
                        description,
                        owner_id,
                        created_at AS "createdAt" 
                 FROM projects
                 WHERE id = $1`, [id]
      );
   }
      const checkProject = await dbPool.query(
      `SELECT id FROM projects WHERE id = $1 AND owner_id = $2`, [id, userId]
   );
   if (checkProject.rowCount == 0) {
      return { Error: `Fetching project failed: Project with ID ${id} does not exist or the user does not have access`,
      statusCode: 404
   }
}
   return await dbPool.query(
      `SELECT id,
              name,
              description,
              owner_id,
              created_at AS "createdAt"
      FROM projects
      WHERE id = $1 AND owner_id = $2`, [id, userId]
   );
}

export async function updateProject(Project: schema.Project, userID: any, isAdmin: boolean = false): Promise<any> {
   if (isAdmin) {
      return await dbPool.query(
         `UPDATE projects
                        SET
                           name = CASE WHEN $2 != '' THEN $2 ELSE name END,
                           description = CASE WHEN $3 != '' THEN $3 ELSE description END
                        WHERE id = ($1) RETURNING id,
                              name,
                              owner_id,
                              description,
                              created_at AS "createdAt";`,
         [Project.id, Project.name, Project.description]
      );
   }
   const checkProject = await dbPool.query(
      `SELECT id FROM projects WHERE id = $1 AND owner_id = $2`, [Project.id, userID]
   );
   if (checkProject.rowCount == 0) {
      return { Error: `Updating project failed: Project with ID ${Project.id} does not exist or the user does not have access`,
      statusCode: 404
   };
   }
   return await dbPool.query(
      `UPDATE projects
                  SET
                      name = CASE WHEN $2 != '' THEN $2 ELSE name END,
                      description = CASE WHEN $3 != '' THEN $3 ELSE description END
                  WHERE id = ($1) and owner_id = $4 RETURNING id,
                        name,
                        owner_id,
                        description,
                        created_at AS "createdAt";`,
      [Project.id, Project.name, Project.description, Project.ownerId]
      // TODO: add more parameters
   );
}

export async function deleteProject(id: any) {
   return await dbPool.query(
      `DELETE FROM projects where id = ($1);`,
      [id]
   );
}