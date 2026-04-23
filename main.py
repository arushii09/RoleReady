
from fastapi import FastAPI
from pydantic import BaseModel
from chains import analyze_jd
from chains import generate_questions
from chains import evaluate_answer
from chains import generate_report

app = FastAPI()

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