import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    
    # OpenAI Configuration
    GROQ_API_KEY: str
    OPENAI_MODEL: str = "gpt-4"
    OPENAI_TEMPERATURE: float = 0.1
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = [".pdf", ".doc", ".docx"]
    UPLOAD_DIR: str = "uploads"
    
    # Processing Configuration
    MAX_PROCESSING_TIME: int = 300  # 5 minutes
    BATCH_SIZE: int = 10
    
    # Logging Configuration
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
