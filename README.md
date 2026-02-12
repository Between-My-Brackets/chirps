# Chirpy

Chirpy is a scalable backend API for a microblogging platform, built with **Node.js**, **Express**, and **TypeScript**. It includes a developer-facing frontend that documents the API surface, architecture, and system health.

## Repository Structure

```
root/
├── backend/     # Express API (Node.js + TypeScript + PostgreSQL)
├── frontend/    # Developer portal (React + Vite + Tailwind CSS)
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) (running instance)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example` or the section below):

```
DB_URL="postgres://user:password@localhost:5432/chirpy?sslmode=disable"
JWT_SECRET="your-secret"
POLKA_KEY="your-polka-key"
PLATFORM="dev"
```

Run migrations and start the server:

```bash
npm run migrate
npm run dev          # http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

The frontend is a static developer portal — it does **not** call the backend API. It serves as a landing page and documentation UI for the Chirpy project.

---

## ⚙️ Backend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Build + start with nodemon (auto-restart) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm run start` | Run compiled JS from `dist/` |
| `npm run test` | Run tests with Vitest |
| `npm run generate` | Generate Drizzle migrations |
| `npm run migrate` | Apply Drizzle migrations |

---

## 📖 API Endpoints

Interactive docs available at **http://localhost:8080/api-docs** when the backend is running.

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET` | `/api/healthz` | Health check | None |
| `POST` | `/api/users` | Create user | None |
| `PUT` | `/api/users` | Update user | JWT |
| `POST` | `/api/login` | Login | None |
| `POST` | `/api/refresh` | Refresh access token | JWT |
| `POST` | `/api/revoke` | Revoke refresh token | JWT |
| `GET` | `/api/chirps` | List chirps | None |
| `POST` | `/api/chirps` | Create chirp | JWT |
| `GET` | `/api/chirps/{id}` | Get chirp | None |
| `DELETE` | `/api/chirps/{id}` | Delete chirp | JWT |
| `POST` | `/api/polka/webhooks` | Polka webhook | API Key |
| `GET` | `/admin/metrics` | Usage metrics | None |
| `POST` | `/admin/reset` | Reset DB (dev only) | None |

---

## 🖥️ Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Project overview with hero and feature cards |
| `/api` | API Overview | Lists all backend routes with method badges |
| `/architecture` | Architecture | Request flow timeline |
| `/status` | Status | Static health indicators |
| `*` | 404 | Not Found page |

---

## Tech Stack

**Backend:** Express · TypeScript · PostgreSQL · Drizzle ORM · JWT · Argon2

**Frontend:** React · Vite · Tailwind CSS · React Router · TypeScript
