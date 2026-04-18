
from fastapi import FastAPI
from pydantic import BaseModel
from chains import analyze_jd

app = FastAPI()

class JDRequest(BaseModel):
    job_description: str

@app.post("/analyze-jd")
def analyze(req: JDRequest):
    return analyze_jd(req.job_description)