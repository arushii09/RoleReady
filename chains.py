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