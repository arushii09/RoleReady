# RoleReady — AI Technical Interview Coach

> Paste any job description. Experience an end-to-end multi-step AI mock interview with live answer evaluation, structured scoring, and persistent debrief reports.

![Python](https://img.shields.io/badge/Python-3.11-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38bdf8) ![JWT](https://img.shields.io/badge/Auth-JWT-orange) ![Groq](https://img.shields.io/badge/Groq-LLaMA3.1-purple)

---

## ⚡ What it does

RoleReady is a production-grade full-stack AI platform that simulates a real technical mock interview end to end.

```
Paste Job Description
        ↓
AI analyzes the JD — extracts skills, role level, responsibilities
        ↓
Generates 10 personalized interview questions (technical + behavioral)
        ↓
User submits answers for each prompt
        ↓
AI evaluates every answer — score out of 10, specific feedback, better answer
        ↓
Final Debrief Report — overall score, strengths, weak areas, study plan
        ↓
Saved to Database — User history stored in PostgreSQL/SQLite tied to JWT account
```

---

## 🌐 Demo

> Live Link: [RoleReady](https://role-ready.netlify.app/)  
> API Docs: `http://localhost:8000/docs`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + TypeScript + Vite + Tailwind CSS |
| **Backend** | FastAPI + Python 3.11 |
| **Security & Auth** | JWT Bearer Tokens (`pyjwt`) + `pbkdf2_sha256` Password Hashing |
| **Database** | SQLAlchemy ORM + SQLite (Dev) / PostgreSQL (Prod) |
| **AI Engine** | LangChain + Groq API (`llama-3.1-8b-instant`) |
| **Deployment** | Render (Backend API) + Netlify / Vercel (Frontend) |

---

## 💡 Technical Architecture Highlights

This is not a simple chatbot wrapper — it is a **secure, multi-step production AI system**:

1. **Stateful User Authentication**: JWT Bearer Token validation protecting user history endpoints.
2. **Relational Data Persistence**: SQLAlchemy database schema linking user accounts (`users` table) to saved interview debrief reports (`interview_history` table).
3. **Multi-Step AI Pipeline**:
   - `POST /generate-questions` $\rightarrow$ Dynamic question array generation based on JD parsing.
   - `POST /evaluate-answer` $\rightarrow$ Strict 1-10 scoring & structured feedback per response.
   - `POST /generate-report` $\rightarrow$ Multi-input synthesis creating a comprehensive study plan.
   - `POST /api/history` $\rightarrow$ Automatic persistence of debrief reports to database.

---

## 📂 Project Structure

```text
RoleReady/
├── Backend/
│   ├── main.py          ← FastAPI routes & CORS setup
│   ├── chains.py        ← LangChain AI logic & Groq pipelines
│   ├── auth.py          ← JWT token creation & password hashing
│   ├── database.py      ← SQLAlchemy DB engine & session setup
│   ├── models.py        ← User & InterviewHistory SQL tables
│   ├── schemas.py       ← Pydantic request & response validation
│   └── requirements.txt
└── Frontend/
    ├── src/
    │   ├── components/  ← Interview Flow, Auth Modal, Footer & Hero UI
    │   ├── lib/         ← API utility helpers
    │   └── App.tsx
    ├── public/          ← Videos and assets
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/arushii09/RoleReady.git
cd RoleReady
```

### 2. Set up the Backend
```bash
cd Backend
pip install -r requirements.txt
```

Create a `.env` file inside `Backend/`:
```env
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your_jwt_secret_key_here
```

Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Set up the Frontend
In a new terminal:
```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:3000` (or `http://localhost:5173`) in your browser!

---

## 🔑 Key API Endpoints

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user with hashed password |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT Bearer token |
| `POST` | `/generate-questions` | Public | Generate 10 role-specific interview questions |
| `POST` | `/evaluate-answer` | Public | Evaluate answer & return 1-10 score + critique |
| `POST` | `/generate-report` | Public | Synthesize overall score & study plan |
| `POST` | `/api/history` | 🔒 JWT Token Required | Save debrief report to user's DB account |
| `GET` | `/api/history` | 🔒 JWT Token Required | Fetch all saved interview reports for user |

---

