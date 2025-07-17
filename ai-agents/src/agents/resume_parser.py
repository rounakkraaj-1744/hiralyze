from typing import Dict, Any
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from agents.base_agent import BaseAgent
from core.logging import logger
import os

class ResumeParserAgent(BaseAgent):
    """Agent responsible for parsing resume files and extracting text"""
    
    def __init__(self):
        super().__init__("ResumeParser")
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=4000,
            chunk_overlap=200,
            length_function=len
        )
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Parse resume file and extract text"""
        resume_path = input_data.get('resume_path')
        
        if not resume_path or not os.path.exists(resume_path):
            raise ValueError(f"Resume file not found: {resume_path}")
        
        try:
            # Extract text based on file type
            text = await self._extract_text(resume_path)
            
            # Clean and process text
            cleaned_text = self._clean_text(text)
            
            # Split into chunks if too long
            chunks = self.text_splitter.split_text(cleaned_text)
            
            logger.info(f"Successfully parsed resume: {resume_path}")
            
            return {
                'resume_text': cleaned_text,
                'text_chunks': chunks,
                'file_path': resume_path,
                'word_count': len(cleaned_text.split())
            }
            
        except Exception as e:
            logger.error(f"Error parsing resume {resume_path}: {str(e)}")
            raise
    
    async def _extract_text(self, file_path: str) -> str:
        """Extract text from resume file"""
        file_extension = os.path.splitext(file_path)[1].lower()
        
        try:
            if file_extension == '.pdf':
                loader = PyPDFLoader(file_path)
            elif file_extension in ['.doc', '.docx']:
                loader = Docx2txtLoader(file_path)
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
            
            documents = loader.load()
            text = "\n".join([doc.page_content for doc in documents])
            
            return text
            
        except Exception as e:
            logger.error(f"Error extracting text from {file_path}: {str(e)}")
            raise
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize extracted text"""
        import re
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep important punctuation
        text = re.sub(r'[^\w\s\.\,\;\:\-$$$$\@\+\#]', ' ', text)
        
        # Remove extra spaces
        text = ' '.join(text.split())
        
        return text.strip()
