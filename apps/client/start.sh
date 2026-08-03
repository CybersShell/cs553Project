#!/bin/env bash
npm run -prefix ../.. db:reset
npm run -prefix ../.. db:start
sleep 3
psql postgresql://postgres:postgres@localhost:5432/cs453 -f ../../database/schema.sql
sleep 3
kill $(lsof -t -i:3000)
npm run -prefix ../api/ build
sleep 2
npm run -prefix ../api/ start &