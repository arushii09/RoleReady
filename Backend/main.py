# Backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

# import existing AI logic from chains.py
from chains import analyze_jd, generate_questions, evaluate_answer, generate_report

# import Auth & DB modules
import models, schemas, auth
from database import engine, get_db

# automatically create SQL tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RoleReady AI API")

# preserve CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class JDRequest(BaseModel):
    job_description: str

@app.post("/analyze-jd")
def analyze(req: JDRequest):
    return analyze_jd(req.job_description)

@app.post("/generate-questions")
def question(req: JDRequest):
    return generate_questions(req.job_description)

class AnswerRequest(BaseModel):
    question: str
    answer: str
    role_level: str

@app.post("/evaluate-answer")
def evaluate(req: AnswerRequest):
    return evaluate_answer(req.question, req.answer, req.role_level)

class ReportRequest(BaseModel):
    evaluations: list
    job_description: str

@app.post("/generate-report")
def report(req: ReportRequest):
    return generate_report(req.evaluations, req.job_description)


@app.post("/api/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    """Register a new user with hashed password"""
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")
    
    hashed_pwd = auth.hash_password(user_data.password)
    new_user = models.User(email=user_data.email, hashed_password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/api/auth/login", response_model=schemas.TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Authenticate user and return JWT Bearer Token"""
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/api/history", response_model=schemas.HistoryResponse)
def save_interview_report(
    report_data: schemas.SaveHistoryRequest,
    current_user: models.User = Depends(auth.get_current_user),  # Requires valid JWT Token
    db: Session = Depends(get_db)
):
    """Save a generated interview report linked to the logged-in user"""
    history_entry = models.InterviewHistory(
        user_id=current_user.id,
        job_description=report_data.job_description,
        overall_score=report_data.overall_score,
        debrief_report=report_data.debrief_report
    )
    db.add(history_entry)
    db.commit()
    db.refresh(history_entry)
    return history_entry


@app.get("/api/history", response_model=List[schemas.HistoryResponse])
def get_user_history(
    current_user: models.User = Depends(auth.get_current_user),  # Requires valid JWT Token
    db: Session = Depends(get_db)
):
    """Fetch all past saved interview reports for the logged-in user"""
    return db.query(models.InterviewHistory)\
             .filter(models.InterviewHistory.user_id == current_user.id)\
             .order_by(models.InterviewHistory.created_at.desc())\
             .all()