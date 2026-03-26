# Vi-Notes (Fork / Partial Implementation)

This repository is forked from [vicharanashala/vi-notes](https://github.com/vicharanashala/vi-notes) and currently contains a partial implementation of the original vision.

The focus here is an MVP web app for auth + writing sessions + paste metadata tracking, while preserving the larger authorship-verification direction of the upstream project.

## Upstream Reference

- Original project: [https://github.com/vicharanashala/vi-notes](https://github.com/vicharanashala/vi-notes)
- This repo: forked derivative with incremental implementation work

## Current Scope in This Fork

Implemented (MVP-oriented):
- User registration and login
- JWT-based protected editor access
- Writing session start/end lifecycle
- Paste event metadata capture (counts/timing), not clipboard content

Planned / partial / not fully implemented yet:
- Full behavioral analysis engine
- Statistical + ML authenticity scoring pipeline
- Reporting and advanced verification workflows

## Tech Stack in This Repo

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: MongoDB

## Clone Guide

```bash
git clone https://github.com/<your-username>/vi-notes.git
cd vi-notes
```

If you are working directly from the upstream instead of this fork:

```bash
git clone https://github.com/vicharanashala/vi-notes.git
cd vi-notes
```

## Setup Guide

Prerequisites:
- Node.js 20+
- npm 10+
- MongoDB running locally or via a remote URI

1. Install backend dependencies

```bash
cd backend
npm install
```

2. Configure backend environment

```bash
cp .env.example .env
```

Set values in backend/.env:
- MONGODB_URI
- JWT_SECRET
- PORT
- CORS_ORIGIN

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

4. Configure frontend environment

```bash
cp .env.example .env
```

Set values in frontend/.env:
- VITE_API_BASE_URL

## Run Guide

Run backend:

```bash
cd backend
npm run dev
```

Run frontend (new terminal):

```bash
cd frontend
npm run dev
```

Default local URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Structure Guide

```text
vi-notes/
	backend/
		src/
			db.ts               # Mongo connection and lifecycle
			server.ts           # Express app bootstrap
			middleware/
				auth.ts           # JWT auth middleware
			models/
				user.ts           # User model/types
				session.ts        # Session + paste event model/types
			routes/
				auth.ts           # /api/auth endpoints
				sessions.ts       # /api/sessions endpoints
	frontend/
		src/
			api/
				client.ts         # Frontend API wrapper
			components/
				Header.tsx        # Shared header component
				ProtectedRoute.tsx
			pages/
				Login.tsx
				Register.tsx
				Editor.tsx
			App.tsx             # Routes and auth state wiring
			App.css             # Shared styling
```

## Privacy Notes

This fork follows privacy-first constraints for MVP behavior tracking:
- No raw clipboard content is stored
- No raw keystroke content is stored
- Only metadata required for session behavior analysis is captured