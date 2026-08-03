## The most important technical concepts you learned.

To anyone building this again, here is what I learned.
Building proper SQL queries is neccessary. Don't expect a ORM to do everything for you. You have to write the queries yourself. You must test your queries, as one bad one can leave out a constraint or an ID. This can leave your application vulnerable to attack. 
Example:
```sql
WHERE id = ($1) and assigned_to = $6 RETURNING id
```
The above partial statement is one I just now found and fixed. I left off the check for the `assigned_to` field, which meant that a user could update any task, not just their own.


I also learned the importance of consistency and keeping things relatively small. For example, I implemented checks in the services for foreign key fields when updating or creating tasks. Then I returned errors if the foreign keys were not found instead of letting the update or creation query error and the user is left with a cryptic error.

## Why database design, authentication, and authorization must be considered together.

The last paragraph leads to why we should consider database design, authentication, and authorization together. If you don't design your database with authentication and authorization in mind, you will have holes in your application. For example, if you don't have a user table, you can't have authentication. If you don't have a way to check if a user is authorized to access a resource, you can't have authorization. Queries should be writen in a way that makes sense: if an admin is updating a task, they should be able to update any task. But if a regular user is updating a task, they should only be able to update tasks they are assigned to.

## At least one design decision you made and the tradeoffs involved.

As I said above, I implemented checking for foreign key fields when updating or creating tasks then returning errors if the foreign keys were not found instead. This was a tradeoff between performance and user experience. The tradeoff was that I had to make an extra query to check if the foreign key existed. The benefit is not being left with a cryptic error. If a user tries to do something with a resource he does not own, that error message returned a 404 instead of 403. This prevents revealing too much information when it should not be.

## At least one problem, mistake, or unexpected difficulty you encountered.

The biggest problem I encountered was the database design. Writing queries was kind of difficult. The errors were sometimes cryptic.

Also, adding authorization to the API was difficult. I had to make sure that users could not access resources they did not control.

## What you would do differently if you began the project again.

I would start with tests first, as a checklist. Write them in Typescript or Javascript. I would also start with authorization at the service level, because adding them later is a pain.

## The advice you would give someone preparing to build a similar system.

Start with tests and database design. Couple authetication and authorization to the database. Use tested libraries. Use a typed language if possible.

## At least one security risk that a development team should not overlook.

Santize all inputs, especially from users if using SQL. Use an ORM, especially so that you can parameterize queries.  Use a password hashing library. Do not store passwords in plain text.