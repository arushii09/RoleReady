import json
import re
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

load_dotenv()

# Active, ultra-fast Groq model
llm = ChatGroq(model="groq/compound", temperature=0.2)

def clean_json_string(text: str) -> str:
    """Helper to clean LLM markdown formatting before parsing JSON"""
    text = text.strip()
    text = re.sub(r"^```json\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"^```\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"```$", "", text, flags=re.MULTILINE)
    return text.strip()

def analyze_jd(job_description: str):
    prompt = PromptTemplate(
        template="""You are an expert at analyzing job descriptions.
Extract key skills, role level (junior/mid/senior), and main responsibilities.

Job Description: {job_description}

Give a clear structured summary.""",
        input_variables=["job_description"]
    )
    chain = prompt | llm
    result = chain.invoke({"job_description": job_description})
    return {"analysis": result.content}

def generate_questions(job_description: str):  
    prompt = PromptTemplate(
        template="""You are an expert interviewer.
Based on this job description, generate exactly 10 interview questions.
Mix technical and behavioral questions.

Job Description: {job_description}

Return ONLY a JSON array of 10 question strings like this:
["Question 1", "Question 2", "Question 3", ...]
No extra text, just the JSON array.""",
        input_variables=["job_description"]
    )
    chain = prompt | llm
    result = chain.invoke({"job_description": job_description})
    
    # Parse JSON cleanly
    cleaned = clean_json_string(result.content)
    try:
        parsed_questions = json.loads(cleaned)
    except Exception:
        # Fallback if raw text returned
        parsed_questions = [line.strip() for line in cleaned.split("\n") if line.strip()]
        
    return {"questions": parsed_questions}

def evaluate_answer(question: str, answer: str, role_level: str):
    prompt = PromptTemplate(
        template="""You are an expert interviewer.
Evaluate this interview answer for a {role_level} position.
Question: {question}
Candidate's answer: {answer}

Return ONLY valid JSON with exactly these keys:
{{"score": 7, "feedback": "your critique here", "better_answer": "stronger version here"}}

Score strictly based on these rules:
- 1-3: Answer shows no knowledge or just "I don't know"
- 4-6: Basic answer, missing important details
- 7-8: Good answer with solid understanding
- 9-10: Excellent, detailed, covers edge cases

No extra text, just the JSON.""",
        input_variables=["question", "answer", "role_level"]
    )
    chain = prompt | llm
    result = chain.invoke({"question": question, "answer": answer, "role_level": role_level})
    
    cleaned = clean_json_string(result.content)
    return json.loads(cleaned)

def generate_report(evaluations: list, job_description: str):
    prompt = PromptTemplate(
        template="""You are an expert interviewer.
Here are the candidate's interview evaluations:
{evaluations}

Job applied for: {job_description}

Return ONLY valid JSON with exactly these keys:
{{"overall_score": 7.5, "strengths": ["str1", "str2", "str3"], "weak_areas": ["area1", "area2", "area3"], "study_plan": ["topic1", "topic2", "topic3"]}}

No extra text, just the JSON.""",
        input_variables=["evaluations", "job_description"]
    )
    chain = prompt | llm
    result = chain.invoke({"evaluations": json.dumps(evaluations), "job_description": job_description})
    
    cleaned = clean_json_string(result.content)
    return json.loads(cleaned)