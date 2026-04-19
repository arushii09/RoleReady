import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

load_dotenv()
llm = ChatGroq(model="llama-3.3-70b-versatile")

def analyze_jd(job_description: str):
    prompt = PromptTemplate(
        template = """You are an expert at analyzing job descriptions.
Extract the key skills, role level (junio/mid/senior), and main responsibilities.

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

Return ONLY a JSON array like this:
["Question 1", "Question 2", "Question 3"]
No extra text, just the JSON array.""",
        input_variables=["job_description"]
    )

    chain = prompt | llm
    result = chain.invoke({"job_description": job_description})  
    return {"questions": result.content}

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

        input_variables=["question","answer","role_level"]
    )

    chain = prompt | llm
    result = chain.invoke({"question": question, "answer": answer, "role_level": role_level})  
    parsed = json.loads(result.content) 
    return parsed