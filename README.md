
# Task API Server

This repository contains the code for the CS 453 / 553 Project.

This is a task server that supports the following routes:

| Method | Route | Description |
---------|-------|-------------|
| POST       | `/auth/register`      |  Create a new new user |
| POST       | `/auth/login`      |  Login a user |
| Get       | `/tasks`      |  Returns all tasks |
| POST       | `/tasks`      |  Create a new task |
| GET       | `/tasks/:id`      |  Create a new task |
| PATCH       | `/tasks/:id`      |  Update an existing task |
| DELETE       | `/tasks/:id`      |  Delete an existing task |
| Get       | `/projectproject`      |  Returns all projects |
| POST       | `/project`      |  Create a new project |
| GET       | `/project/:id`      |  Create a new project |
| PATCH       | `/project/:id`      |  Update an existing project |
| DELETE       | `/project/:id`      |  Delete an existing project |


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

```bash
curl -X GET http://localhost:3000/db-health
```

Register a user:

```bash
curl -X POST http://localhost:3000/auth/register \                             
  -H "Content-Type: application/json" \
  -d '{"email": "anw0044@uah.edu", "password":"a.very.secure.pass", "name": "Andrew"}'
```

To update this user to have admin status:

```bash
psql postgresql://postgres:postgres@localhost:5432/cs453 -f database/user.sql
```

Login:

```bash
token=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \                                  
  -d '{"email": "anw0044@uah.edu", "password":"a.very.secure.pass"}' | jq -r .token)
```


GET all tasks:

```bash
curl -X GET http://localhost:3000/tasks \
  -H "Content-Type: application/json" -H "Authorization: Bearer $token"
```

GET a task:

```bash
curl -X GET http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" -H "Authorization: Bearer $token"
```

POST a task:

```bash
curl -X POST http://localhost:3000/tasks \    
  -H "Content-Type: application/json" -H "Authorization: Bearer $token" \
  -d '{"title": "Create task API"}'
```

The Project_id field is optional, and the server will return an error if the project does not exist.

```
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" -H "Authorization: Bearer $token" \
  -d '{"title": "Whimsy", "status": "in progress", "project_id": 55}'
```

PATCH a task:

```bash
curl -X PATCH http://localhost:3000/tasks/3 \
  -H "Content-Type: application/json" -H "Authorization: Bearer $token" \
  -d '{"title": "Patch rejects non-existant tasks", "status": "in progress", "project_id": 1}'
```

As an admin, DELETE a task:

```
curl -X DELETE http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" -H "Authorization: Bearer $token"
```

GET all projects:

```bash
curl -X GET http://localhost:3000/projects \
  -H "Content-Type: application/json" -H "Authorization: Bearer $token"
```

GET a project:

```bash
curl -X GET http://localhost:3000/projects/1 \
  -H "Content-Type: application/json" -H "Authorization: Bearer $token"
```

POST a project:

```bash
curl -X POST http://localhost:3000/projects \    
  -H "Content-Type: application/json" -H "Authorization: Bearer $token" \
  -d '{"name": "Task and Project API"}' 
```

PATCH a project:

```bash
curl -X PATCH http://localhost:3000/projects/1 \
  -H "Content-Type: application/json" -H "Authorization: Bearer $token" \
  -d '{"name": "Task and Project API", "description":"Create a task and project API with authentication"}'
```

As an admin, DELETE a project:

```
curl -X DELETE http://localhost:3000/projects/1 \
  -H "Content-Type: application/json" -H "Authorization: Bearer $token"
```


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