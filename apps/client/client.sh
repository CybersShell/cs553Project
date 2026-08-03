#!/bin/env bash
echo Starting services...
source start.sh
sleep 5

echo GET database health:

curl -X GET http://localhost:3000/db-health

function runProjectTests() {
    local name=$1
    local token=$2
    echo
    echo POST a project:
    echo
    echo Response:

    json=$(jq -n --arg n "$name" '{"name": $n}')
    echo 
    project=$(curl -X POST http://localhost:3000/projects \
    -H "Content-Type: application/json" -H "Authorization: Bearer $token" \
    -d "$json")
    echo $project

    projectId=$(echo $project | jq -r '.project.id') 

    echo
    echo POST a task:
    echo
    echo Response:

    curl -X POST http://localhost:3000/tasks \
    -H "Content-Type: application/json" -H "Authorization: Bearer $token" \
    -d "$(jq -n --arg projectId "$projectId" '{title: "Create task API", project_id: $projectId, status: "done", description: "Implement user auth"}')" 
}

function runSecondSetProjectTests() {
    local name=$1
    local token=$2
    echo
    echo POST a project:
    echo
    echo Response:

    json=$(jq -n --arg n "$name" '{"name": $n}')
    echo 


    echo
    echo As an admin, DELETE a task:
    echo
    echo Response:

    curl -X DELETE http://localhost:3000/tasks/1 \
    -H "Content-Type: application/json" -H "Authorization: Bearer $token"


    echo
    echo GET all projects:
    echo
    echo Response:

    curl -X GET http://localhost:3000/projects \
    -H "Content-Type: application/json" -H "Authorization: Bearer $token"

    echo
    echo GET a project:
    echo
    echo Response:

    curl -X GET http://localhost:3000/projects/1 \
    -H "Content-Type: application/json" -H "Authorization: Bearer $token"

    echo
    echo POST a project:
    echo

    json=$(jq -n --arg n "$name" '{"name": $n}')

    project=$(curl -X POST http://localhost:3000/projects \
    -H "Content-Type: application/json" -H "Authorization: Bearer $token" \
    -d "$json")
    echo $project

    projectId=$(echo $project | jq -r '.project.id') 

    echo
    echo "PATCH a project:"
    echo
    echo Response:

    curl -X PATCH http://localhost:3000/projects/$projectId \
    -H "Content-Type: application/json" -H "Authorization: Bearer $token" \
    -d '{"name": "Task and Project API", "description":"Create a task and project API with authentication"}'

    echo
    echo  DELETE a project:

    curl -X DELETE http://localhost:3000/projects/$projectId \
    -H "Content-Type: application/json" -H "Authorization: Bearer $token"

}



function runTaskTests() {
    local token=$1
    local projectId=$2
    echo
    echo GET all tasks:
    echo
    echo Response:

    curl -X GET http://localhost:3000/tasks \
    -H "Content-Type: application/json" -H "Authorization: Bearer $token"

    echo
    echo GET a task:
    echo
    echo Response:

    curl -X GET http://localhost:3000/tasks/1 \
        -H "Content-Type: application/json" -H "Authorization: Bearer $token"


    echo
    echo PATCH a task:
    echo
    echo Response:

    curl -X PATCH http://localhost:3000/tasks/1 \
    -H "Content-Type: application/json" -H "Authorization: Bearer $token" \
    -d '{"title": "Whimsy", "status": "in progress", "project_id": 1}'

    echo
    echo PATCH a non-existant task:
    echo
    echo Response:

    curl -X PATCH http://localhost:3000/tasks/553 \
    -H "Content-Type: application/json" -H "Authorization: Bearer $token" \
    -d '{"title": "Patch rejects non-existant tasks", "status": "in progress", "project_id": 1}'

}

function register() {
    local email=$1
    local password="$2"



    curl -X POST http://localhost:3000/auth/register \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg n "$name" --arg p "$password" --arg e "$email" '{name: $n, password: $p, email: $e}')"

}

function login() {
    local email=$1
    local password="$2"
    local -n ref=$3
    ref=$(curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg p "$password" --arg e "$email" '{password: $p, email: $e}')" | jq -r .token)

}
token=""
echo
echo Register a user:
echo
echo Response:

register "anw0044@uah.edu" "a.very.secure.pass"
echo
echo Update this user to have admin status:
echo
psql postgresql://postgres:postgres@localhost:5432/cs453 -f ../../database/user.sql

echo
echo Login and store token in Bash variable:
echo
login "anw0044@uah.edu" "a.very.secure.pass" token

runProjectTests "Create Task API" $token


runTaskTests $token

runSecondSetProjectTests "Get Tasks API" $token
echo
echo Register another user:
echo Response:

register "anw0044@andrewmail.com" "a.very.secure.pass"

echo
echo Login and store token in Bash variable:
echo
login "anw0044@andrewmail.com" "a.very.secure.pass" token

echo "========================================"
echo "Some of these tests should return errors"
echo "========================================"
sleep 4
runProjectTests "Create Task API" $token

runTaskTests $token

runSecondSetProjectTests "Get Tasks API" $token