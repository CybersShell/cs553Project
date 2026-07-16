# Reflection Questions

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