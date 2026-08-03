# Reflection Questions - Checkpoint 1

1. An in-memory API consists of storage that is volitile and will be reset on server restart. A database on the other hand persists data in a permanent data store. A database can be restricted based on internal (database) access control, where as an in-memory API has to have access control added and stored somewhere, which would normally be the job of the database.

2. Separating routes, services, and database logic is useful to keep code seperate so that things stay clean and simple. For example, supose a user route needs to check for a user, it can call the function in the database service without repeating any code and possiblly prevent attacks.

3. 
  - 200 for OK `GET`s
  - 201 for OK `POST`s and `PATCH`s
  - 204 for OK `DELETE`s
  - 400 for bad input
  - 403 / 404 for non-existant resources
  - 500 for server errors

4. The server returns a JSON error message.

5. Debugging SQL query statements was very hard. Query parameters being slightly different from online examples was a bit odd, but expected.

# Reflection Questions - Checkpoint 2

1. What is the difference between authentication and authorization?
   Authetication is the process of verifying who a user is. Authorization is the process of verifying permissions for a user. They are both performed by the server, the client passing either credientials or a token to the server.
2. Why should passwords be hashed instead of stored directly?
   They could be stolen and used by an attacker. Hashing keeps them secret even from the adminstrator.
3. What information did you include in your JWT, and why?
   I included the user's email, id, and role. I could have just included the id and role, because I only used the id and the role to for verify permissions for protected routes and service actions.
4. What is the difference between a 401 response and a 403 response?
   A 401 response means that some part of the authetication failed. A 403 response means that the user is authenticated, but does not have permission to view the resource.
5. Where does your application perform role or ownership checks?
   Both in the routes and in the service routines. Ownership checks return a 404 instead of a 403 to prevent revealing information.
6. How are users, projects, and tasks related in your database?
   Users create and are assigned to tasks. Projects contain tasks.  Users own projects.
   - projects.owner_id -> users.id
   - tasks.assigned_to -> users.id
   - tasks.project_id -> projects.id
7. What was the hardest part of adding authentication or authorization?
   The hardest part of adding authentication was getting the JWT to work properly. The hardest part of authorization was getting the ownership checks to work properly in the service routines. Found I had 