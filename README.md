
# Task API Server

This repository contains the code for the CS 453 / 553 Project.

This is a task server that supports the following routes:

| Method | Route | Description |
---------|-------|-------------|
| Get       | `/tasks`      |  Returns all tasks |
| POST       | `/tasks`      |  Create a new task |
| GET       | `/tasks/:id`      |  Create a new task |
| PATCH       | `/tasks/:id`      |  Update an existing task |
| DELETE       | `/tasks/:id`      |  Delete an existing task |


## Starting Services

# Database

This project uses PostgreSQL running in Docker.

## Setting up the database

```shell
docker compose up -d
or 
npm run db:start
```
Stop the database
```shell
docker compose down 
or 
npm run db:stop
```
Reset the database completely
```shell
docker compose down -v
or 
npm run db:reset
```
## Default connection settings
- Database: cs453 
- User: postgres 
- Password: postgres 
- Port: 5432

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cs453
```

## Creating tables

Run the schema file against the local database after PostgreSQL is running:

```shell
psql postgresql://postgres:postgres@localhost:5432/cs453 -f database/schema.sql
```

## To start the server
```bash
npm install
npm run server
```

## Testing

GET database health:

```
curl -X GET http://localhost:3000/db-health
```

GET all tasks:

```
curl -X GET http://localhost:3000/tasks
```

GET a task:

```
curl -X GET http://localhost:3000/tasks/1
```

POST a task:

```
curl -X POST http://localhost:3000/tasks \    
  -H "Content-Type: application/json" \
  -d '{"title": "Create task API"}'
```

PATCH a task:

```
curl -X PATCH http://localhost:3000/tasks/3 \
  -H "Content-Type: application/json" \
  -d '{"title": "Patch rejects non-existant tasks", "status": "in progress"}'
```

PUT a task:

```
curl -X PUT http://localhost:3000/tasks/3 \
  -H "Content-Type: application/json" \
  -d '{"title": "Part one of project done", "status": "done"}'
```

DELETE a task:

```
curl -X DELETE http://localhost:3000/tasks/1
```

---

## Reflection Questions

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

---

# Project Overview

The semester project is a **Task / Project Management System**.

The application allows users to:

- create projects
- create tasks within projects
- assign tasks to users
- track task status
- comment on tasks
- view project activity

This domain is intentionally simple so that the focus remains on **system
architecture and communication between components**, rather than complex
business logic.

---

# Architecture Overview

The system follows a typical web architecture.

```shell
Browser Client
|
v
REST API
|
v
PostgreSQL
```


Over the semester, the architecture will evolve to include additional
components such as authentication services, real-time communication,
and potentially additional APIs.

Example extended architecture:

```shell
Browser Client
|
v
API Layer
/
Auth API Task API
|
v
PostgreSQL
```

---

# Technology Stack

The default project stack is:

Server
- Node.js
- TypeScript
- Express

Database
- PostgreSQL

Development Tools
- Docker (for database)
- npm
- Git

Students who prefer Python may implement the server using **FastAPI**, but
all examples and starter code will use **TypeScript**.

---

# Repository Structure

```shell
cs453-project-template
│
├── apps
│ ├── api
│ │ Server-side application
│ │
│ └── client
│ Simple browser client
│
├── database
│ Database schema, migrations, and seed data
│
├── docs
│ Architecture documentation
│
├── scripts
│ Utility scripts for development
│
├── docker-compose.yml
│ Starts PostgreSQL database
│
└── README.md
```

---

# Development Setup

## 1. Clone the repository

```shell
git clone <your-repository-url>
cd cs453-project-template
```

## 2. Start the database

This project uses Docker to run PostgreSQL locally.

```shell
docker-compose up -d
```

This will start a PostgreSQL database container.

---

## 3. Install dependencies

```shell
cd apps/api
npm install
```

---

## 4. Run the server
```shell
npm run dev
```


The API server should start locally.

---

# Project Milestones

The project will evolve over several milestones during the semester.

### Milestone 1 – REST API

Students will implement:

- REST endpoints
- database integration
- CRUD operations
- request validation

---

### Milestone 2 – Authentication

Students will add:

- user accounts
- password hashing
- login endpoints
- JWT authentication
- protected routes

---

### Milestone 3 – Architectural Extensions

Students will extend the system with at least one of the following:

- WebSockets for real-time updates
- GraphQL API
- multi-service architecture
- asynchronous messaging
- advanced API documentation

Graduate students will complete an additional architecture extension and
design analysis.

---

# Learning Goals

By completing this project students should understand:

- how client/server systems communicate
- how APIs are designed and implemented
- how databases integrate with web services
- how authentication works in distributed systems
- how modern web architectures evolve over time

---

# Academic Integrity

All work submitted for this project must be your own.

Students may use documentation and external references, but copying code
from other students or online repositories is considered academic misconduct.

---

# License

This repository is provided for educational use in CS453/553.