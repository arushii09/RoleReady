# backend/models.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)  # Never store plain passwords!
    created_at = Column(DateTime, default=datetime.utcnow)

    # One User has Many Interview Reports
    history_records = relationship("InterviewHistory", back_populates="owner")


class InterviewHistory(Base):
    __tablename__ = "interview_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False) # Foreign Key link
    job_description = Column(Text, nullable=False)
    overall_score = Column(Float, nullable=False)
    debrief_report = Column(JSON, nullable=False)  # Stores questions, answers, and scores
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="history_records")