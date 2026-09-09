from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Dict, Any

# Registration Request Data
class UserRegister(BaseModel):
    email: EmailStr
    password: str

# Response after User Registration (Never return hashed_password!)
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

# Response after Login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Request to Save Interview Report
class SaveHistoryRequest(BaseModel):
    job_description: str
    overall_score: float
    debrief_report: Dict[str, Any]

# Response when returning Saved History
class HistoryResponse(BaseModel):
    id: int
    job_description: str
    overall_score: float
    debrief_report: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True