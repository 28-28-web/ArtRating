#!/bin/sh
set -e

# Applies any pending migrations against DATABASE_URL before the server starts.
# Safe to run on every container start — no-op if the schema is already current.
npx prisma migrate deploy

exec "$@"
