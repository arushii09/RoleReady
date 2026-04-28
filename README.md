# RoleReady — AI Interview Coach

> Paste any job description. Get a full personalized mock interview — questions, scored answers, and a debrief report.

![Python](https://img.shields.io/badge/Python-3.11-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green) ![LangChain](https://img.shields.io/badge/LangChain-latest-orange) ![Groq](https://img.shields.io/badge/Groq-LLaMA3.3-purple)

---

## What it does

Most students applying for AI roles build chatbots. This is different — a multi-step AI pipeline that simulates a real interview end to end.

```
Paste Job Description
        ↓
AI analyzes the JD — extracts skills, role level, responsibilities
        ↓
Generates 10 personalized interview questions (technical + behavioral)
        ↓
User answers each question
        ↓
AI evaluates every answer — score out of 10, specific feedback, better answer
        ↓
Final report — overall score, strengths, weak areas, study plan
```

---

## Demo

> Live link: [your-netlify-url.netlify.app](https://your-netlify-url.netlify.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI Pipeline | LangChain + Groq (LLaMA 3.3 70B) |
| Backend | FastAPI + Python |
| Frontend | HTML, CSS, Vanilla JS |
| Deployment | Render (backend) + Netlify (frontend) |

---

## What makes it technically interesting

This isn't a single LLM call — it's a **4-step AI pipeline**:

| Step | Endpoint | What it shows |
|---|---|---|
| JD parsing | `POST /analyze-jd` | Prompt engineering |
| Question generation | `POST /generate-questions` | Dynamic LLM chaining |
| Answer evaluation | `POST /evaluate-answer` | Structured JSON outputs |
| Final report | `POST /generate-report` | Multi-input synthesis |

Each step feeds into the next. The evaluations from all 10 questions are aggregated into a final report — this is exactly how production AI pipelines work.

---

## Project Structure

```
ai-interview-coach/
├── backend/
│   ├── main.py         ← FastAPI routes
│   ├── chains.py       ← LangChain AI logic
│   ├── .env            ← API keys (never committed)
│   └── requirements.txt
└── frontend/
    ├── index.html      ← Paste JD
    ├── interview.html  ← Answer questions
    ├── results.html    ← Final report
    ├── styles.css
    ├── index.js
    ├── interview.js
    └── results.js
```

---

## Run locally

**1. Clone the repo**
```bash
git clone https://github.com/arushii09/ai-interview-coach.git
cd ai-interview-coach
```

**2. Set up backend**
```bash
cd backend
pip install -r requirements.txt
```

**3. Add your Groq API key**

Create a `.env` file in the `backend` folder:
```
GROQ_API_KEY=your_key_here
```
Get a free key at [console.groq.com](https://console.groq.com)

**4. Start the backend**
```bash
uvicorn main:app --reload
```

**5. Open the frontend**

Open `frontend/index.html` with Live Server in VS Code — or just open it directly in your browser.

---

## API Endpoints

| Method | Endpoint | Input | Output |
|---|---|---|---|
| POST | `/analyze-jd` | `job_description` | Text summary of skills + role |
| POST | `/generate-questions` | `job_description` | JSON array of 10 questions |
| POST | `/evaluate-answer` | `question, answer, role_level` | Score, feedback, better answer |
| POST | `/generate-report` | `evaluations, job_description` | Overall score, strengths, study plan |

---

## Built by

Arushi — CS student building real AI tools.

> *"I actually used this tool to prep for interviews while building it."*
