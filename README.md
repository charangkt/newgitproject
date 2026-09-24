<<<<<<< HEAD
# Task Manager

A small full-stack task manager: **TypeScript** frontend, **PHP 8** REST API, **SQLite** storage, deployed with Docker on Render's free tier.

**Live demo:** _add Render URL here_

## Features

- Add, complete, and delete tasks
- Filter by All / Active / Done
- JSON REST API with validation and error handling
- Light and dark mode

## Tech stack

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Frontend | TypeScript (compiled with `tsc`), HTML, CSS |
| Backend  | PHP 8.3 + Apache                |
| Database | SQLite (via PDO)                |
| Hosting  | Docker on Render (free plan)    |

## Project structure

```
src/main.ts           TypeScript frontend source
public/index.html     Page markup
public/style.css      Styles
public/api/tasks.php  REST API (GET, POST, PATCH, DELETE)
public/api/health.php Health check endpoint
public/api/db.php     Database connection + helpers
Dockerfile            Builds TS, then serves with PHP/Apache
render.yaml           Render deployment blueprint
```

## API

| Method | Endpoint                | Body                  | Description        |
| ------ | ----------------------- | --------------------- | ------------------ |
| GET    | `/api/tasks.php`        |                       | List all tasks     |
| GET    | `/api/tasks.php?id=1`   |                       | Get one task       |
| POST   | `/api/tasks.php`        | `{"title": "..."}`    | Create a task      |
| PATCH  | `/api/tasks.php?id=1`   | `{"done": true}`      | Update a task      |
| DELETE | `/api/tasks.php?id=1`   |                       | Delete a task      |
| GET    | `/api/health.php`       |                       | Health check       |

## Run locally

Requirements: Node.js 18+ and PHP 8.1+ with `pdo_sqlite`.

```bash
npm install
npm run dev        # compiles TypeScript and serves on http://localhost:8000
```

Or with Docker:

```bash
docker build -t task-manager .
docker run -p 8080:10000 task-manager   # http://localhost:8080
```

## Deploy to Render

1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, select the repo. Render reads `render.yaml` and deploys on the free plan.
3. Every push to `main` redeploys automatically.

> **Note:** On Render's free plan the service sleeps after 15 minutes of inactivity (the first request afterwards takes ~30–60 s), and the disk is ephemeral, so saved tasks reset when the service redeploys or restarts.
=======
# newgitproject
testing project
>>>>>>> c3e7db3ef03e3bc198947a729f1abbfc3e315541
