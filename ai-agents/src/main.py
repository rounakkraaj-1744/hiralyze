import os
import sys
from pathlib import Path

# Add src to path
sys.path.append(str(Path(__file__).parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from core.config import settings
from core.logging import setup_logging
from api.routes import resume_router, health_router
from services.agent_orchestrator import AgentOrchestrator

# Setup logging
logger = setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("Starting HR Portal AI Service")
    
    # Initialize agent orchestrator
    app.state.agent_orchestrator = AgentOrchestrator()
    
    yield
    
    logger.info("Shutting down HR Portal AI Service")

# Create FastAPI app
app = FastAPI(
    title="HR Portal AI Service",
    description="AI-powered resume analysis and job matching service",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resume_router, prefix="/api/v1", tags=["Resume Processing"])
app.include_router(health_router, prefix="/api/v1", tags=["Health"])

# Legacy endpoints for backward compatibility
app.include_router(resume_router, tags=["Resume Processing (Legacy)"])
app.include_router(health_router, tags=["Health (Legacy)"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
