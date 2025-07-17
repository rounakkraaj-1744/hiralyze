import logging
import sys
from core.config import settings

def setup_logging():
    """Setup application logging"""
    
    # Create logger
    logger = logging.getLogger("hr_portal_ai")
    logger.setLevel(getattr(logging, settings.LOG_LEVEL))
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, settings.LOG_LEVEL))
    
    # Create formatter
    formatter = logging.Formatter(settings.LOG_FORMAT)
    console_handler.setFormatter(formatter)
    
    # Add handler to logger
    logger.addHandler(console_handler)
    
    # Prevent duplicate logs
    logger.propagate = False
    
    return logger

# Create global logger instance
logger = setup_logging()
