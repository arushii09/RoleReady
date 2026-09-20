# RoleReady — AI Technical Interview Coach

> Paste any job description. Get a full personalized mock interview — AI-generated questions, live answer evaluation with structured scoring, and a persistent debrief report tied to your account.

![Python](https://img.shields.io/badge/Python-3.11-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-latest-green) ![React](https://img.shields.io/badge/React-18-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED) ![LangChain](https://img.shields.io/badge/LangChain-latest-orange)

---


## What it does

```
Paste Job Description
        ↓
AI parses JD — extracts required skills, role level, responsibilities
        ↓
Generates 10 personalized questions (technical + behavioral mix)
        ↓
User answers each question
        ↓
AI evaluates every answer — score 1–10, specific feedback, stronger answer
        ↓
Final debrief — true average score, strengths, weak areas, study plan
        ↓
Report saved to database — tied to your JWT account for history tracking
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | FastAPI + Python 3.11 |
| AI Pipeline | LangChain + Groq API (LLaMA 3.1 8B) |
| Auth | JWT Bearer Tokens (pyjwt) + bcrypt password hashing |
| Database | SQLAlchemy ORM — SQLite (dev) / PostgreSQL (prod) |
| Containers | Docker + Docker Compose (multi-stage Nginx builds) |
| Deployment | Render (backend Docker service + frontend static site) |

---

## Architecture

This is a multi-step AI pipeline, not a single LLM call. Each step has a focused task — which produces better outputs than one large prompt and lets answers be evaluated independently as the user submits them.

### AI Pipeline

```
POST /generate-questions   → LLM reads JD, returns 10 tailored questions as JSON array
POST /evaluate-answer      → LLM scores one answer 1–10, returns structured feedback
POST /generate-report      → LLM aggregates all 10 evaluations into a final debrief
```

### Auth Flow

```
POST /api/auth/register  → hash password with bcrypt → store in users table
POST /api/auth/login     → verify bcrypt hash → sign JWT with secret key → return token
Any protected endpoint   → FastAPI reads Authorization header → verifies JWT signature
                         → extracts user_id → scopes all DB queries to that user
```

### Container Architecture

```
docker-compose.yml
├── backend   Python 3.11-slim container, port 8000
│             FastAPI + LangChain + SQLAlchemy
└── frontend  Multi-stage build:
              Stage 1 — Node 20 compiles React/TS → static dist/
              Stage 2 — Nginx serves dist/ (<25MB final image)
Both containers share an isolated Docker network.
```

### Database Schema

```
users
  id, email, hashed_password, created_at

interview_history
  id, user_id (FK → users.id), job_description,
  overall_score, strengths, weak_areas, study_plan,
  evaluations (JSON), created_at
```

---

## Project Structure

```
RoleReady/
├── docker-compose.yml       ← Orchestrates backend + frontend containers
├── Backend/
│   ├── Dockerfile           ← Python 3.11-slim container
│   ├── main.py              ← FastAPI routes + CORS
│   ├── chains.py            ← LangChain AI pipeline
│   ├── auth.py              ← JWT creation + bcrypt verification
│   ├── database.py          ← SQLAlchemy engine + session management
│   ├── models.py            ← User + InterviewHistory table definitions
│   ├── schemas.py           ← Pydantic request/response validation
│   └── requirements.txt
└── Frontend/
    ├── Dockerfile           ← Multi-stage Node → Nginx build
    └── src/
        ├── components/      ← Interview flow, auth modal, UI
        ├── lib/             ← API utility functions
        ├── config.ts        ← API URL configuration
        └── App.tsx
```

---

## Run Locally

### Option A — Docker (recommended)

Requires Docker Desktop running.

```bash
git clone https://github.com/arushii09/RoleReady.git
cd RoleReady
```

Create `Backend/.env`:
```
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_jwt_secret_key
```

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

### Option B — Manual

**Backend:**
```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account with hashed password |
| POST | `/api/auth/login` | Public | Verify credentials, return JWT token |
| POST | `/generate-questions` | Public | Generate 10 role-specific questions |
| POST | `/evaluate-answer` | Public | Score answer 1–10 with feedback |
| POST | `/generate-report` | Public | Synthesize final debrief report |
| POST | `/api/history` | JWT | Save debrief to user account |
| GET | `/api/history` | JWT | Fetch all saved reports for user |

---

## Known limitations + planned fixes

- **Malformed JSON from LLM** — `json.loads()` can crash if Groq returns unexpected output. Fix: Pydantic v2 validation with retry logic.
- **No token refresh** — JWT expires and user must log in again. Fix: refresh token pattern.
- **Free tier cold starts** — Render spins down after inactivity, causing 30–50s first-load delay on the free plan.

---

## Built by

Arushi
