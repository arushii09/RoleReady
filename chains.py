from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

load_dotenv()
llm = ChatGroq(model="llama3-8b-8192")

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