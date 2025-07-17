from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator
from datetime import datetime

class ResumeAnalysisRequest(BaseModel):
    resume_path: str = Field(..., description="Path to the resume file")
    job_description: str = Field(..., description="Job description text")
    job_requirements: List[str] = Field(default=[], description="List of job requirements")
    
    @validator('resume_path')
    def validate_resume_path(cls, v):
        if not v or not v.strip():
            raise ValueError('Resume path cannot be empty')
        return v.strip()
    
    @validator('job_description')
    def validate_job_description(cls, v):
        if not v or not v.strip():
            raise ValueError('Job description cannot be empty')
        return v.strip()

class SkillAnalysis(BaseModel):
    skill: str
    confidence: float = Field(ge=0, le=1)
    category: Optional[str] = None

class ExperienceAnalysis(BaseModel):
    total_years: Optional[float] = None
    summary: str
    key_roles: List[str] = []
    achievements: List[str] = []

class JobMatchAnalysis(BaseModel):
    overall_score: float = Field(ge=0, le=100)
    skills_match: float = Field(ge=0, le=100)
    experience_match: float = Field(ge=0, le=100)
    strengths: List[str] = []
    weaknesses: List[str] = []
    missing_skills: List[str] = []
    recommendations: List[str] = []

class ResumeAnalysisResponse(BaseModel):
    summary: str = Field(..., description="Professional summary of the candidate")
    score: float = Field(..., ge=0, le=100, description="Overall match score")
    skills: List[str] = Field(default=[], description="Extracted skills")
    experience: str = Field(..., description="Experience summary")
    strengths: List[str] = Field(default=[], description="Candidate strengths")
    weaknesses: List[str] = Field(default=[], description="Areas for improvement")
    recommendations: List[str] = Field(default=[], description="Recommendations")
    
    # Additional detailed analysis
    detailed_skills: List[SkillAnalysis] = Field(default=[], description="Detailed skill analysis")
    experience_analysis: Optional[ExperienceAnalysis] = None
    job_match: Optional[JobMatchAnalysis] = None
    
    processed_at: datetime = Field(default_factory=datetime.now)
    processing_time: Optional[float] = None

class FileUploadResponse(BaseModel):
    file_path: str
    filename: str
    size: int
    content_type: str
    uploaded_at: datetime = Field(default_factory=datetime.now)

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime = Field(default_factory=datetime.now)
    version: str = "1.0.0"
    dependencies: Dict[str, str] = {}

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)
