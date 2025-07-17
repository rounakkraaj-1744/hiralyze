from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from typing import List
import tempfile
import os
from pathlib import Path

from models.schemas import (
    ResumeAnalysisRequest,
    ResumeAnalysisResponse,
    FileUploadResponse,
    HealthResponse,
    ErrorResponse
)
from services.agent_orchestrator import AgentOrchestrator
from core.config import settings
from core.logging import logger

# Create routers
resume_router = APIRouter()
health_router = APIRouter()

def get_agent_orchestrator() -> AgentOrchestrator:
    """Dependency to get agent orchestrator"""
    return AgentOrchestrator()

@resume_router.post("/process-resume", response_model=ResumeAnalysisResponse)
async def process_resume(
    request: ResumeAnalysisRequest,
    orchestrator: AgentOrchestrator = Depends(get_agent_orchestrator)
):
    """Process a resume and analyze it against job requirements"""
    try:
        logger.info(f"Processing resume: {request.resume_path}")
        
        # Validate file exists
        if not os.path.exists(request.resume_path):
            raise HTTPException(status_code=404, detail="Resume file not found")
        
        # Process with agent orchestrator
        result = await orchestrator.process_resume(
            resume_path=request.resume_path,
            job_description=request.job_description,
            job_requirements=request.job_requirements
        )
        
        logger.info(f"Resume processing completed with score: {result.score}")
        return result
        
    except FileNotFoundError:
        logger.error(f"Resume file not found: {request.resume_path}")
        raise HTTPException(status_code=404, detail="Resume file not found")
    except Exception as e:
        logger.error(f"Error processing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")

@resume_router.post("/upload-resume", response_model=FileUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    """Upload and temporarily store resume file"""
    try:
        # Validate file type
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in settings.ALLOWED_FILE_TYPES:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type. Allowed types: {', '.join(settings.ALLOWED_FILE_TYPES)}"
            )
        
        # Validate file size
        content = await file.read()
        if len(content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE / (1024*1024):.1f}MB"
            )
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(
            delete=False, 
            suffix=file_ext,
            dir=settings.UPLOAD_DIR
        ) as tmp_file:
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        logger.info(f"Resume uploaded: {file.filename} -> {tmp_file_path}")
        
        return FileUploadResponse(
            file_path=tmp_file_path,
            filename=file.filename,
            size=len(content),
            content_type=file.content_type
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@resume_router.post("/analyze-skills")
async def analyze_skills(
    resume_text: str,
    orchestrator: AgentOrchestrator = Depends(get_agent_orchestrator)
):
    """Analyze skills from resume text"""
    try:
        result = await orchestrator.extract_skills(resume_text)
        return {"skills": result}
    except Exception as e:
        logger.error(f"Error analyzing skills: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@resume_router.post("/analyze-experience")
async def analyze_experience(
    resume_text: str,
    orchestrator: AgentOrchestrator = Depends(get_agent_orchestrator)
):
    """Analyze experience from resume text"""
    try:
        result = await orchestrator.analyze_experience(resume_text)
        return {"experience": result}
    except Exception as e:
        logger.error(f"Error analyzing experience: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@health_router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        # Check OpenAI connection
        from langchain_openai import ChatOpenAI
        llm = ChatOpenAI(model="gpt-3.5-turbo", api_key=settings.GROQ_API_KEY)
        
        dependencies = {
            "openai": "connected",
            "upload_dir": "accessible" if os.path.exists(settings.UPLOAD_DIR) else "not_accessible"
        }
        
        return HealthResponse(
            status="healthy",
            dependencies=dependencies
        )
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return HealthResponse(
            status="unhealthy",
            dependencies={"error": str(e)}
        )

@health_router.get("/status")
async def status():
    """Simple status endpoint"""
    return {"status": "ok", "service": "hr-portal-ai"}
