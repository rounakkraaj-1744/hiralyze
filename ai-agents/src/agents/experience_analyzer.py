from typing import Dict, Any
from langchain_core.messages import HumanMessage, SystemMessage
from agents.base_agent import BaseAgent
from core.logging import logger
import re

class ExperienceAnalyzerAgent(BaseAgent):
    """Agent responsible for analyzing work experience from resume"""
    
    def __init__(self):
        super().__init__("ExperienceAnalyzer", temperature=0.2)
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze work experience from resume text"""
        resume_text = input_data.get('resume_text', '')
        
        if not resume_text:
            raise ValueError("Resume text is required for experience analysis")
        
        try:
            # Extract experience summary
            experience_summary = await self._analyze_experience_summary(resume_text)
            
            # Extract years of experience
            total_years = await self._extract_years_of_experience(resume_text)
            
            # Extract key roles and responsibilities
            key_roles = await self._extract_key_roles(resume_text)
            
            # Extract achievements
            achievements = await self._extract_achievements(resume_text)
            
            # Analyze career progression
            career_progression = await self._analyze_career_progression(resume_text)
            
            logger.info(f"Experience analysis completed: {total_years} years total")
            
            return {
                'experience_summary': experience_summary,
                'total_years': total_years,
                'key_roles': key_roles,
                'achievements': achievements,
                'career_progression': career_progression
            }
            
        except Exception as e:
            logger.error(f"Error analyzing experience: {str(e)}")
            raise
    
    async def _analyze_experience_summary(self, resume_text: str) -> str:
        """Generate a comprehensive experience summary"""
        system_prompt = """You are an expert at analyzing professional work experience from resumes.
        Provide a concise but comprehensive summary of the candidate's work experience including:
        - Total years of experience
        - Key roles and positions held
        - Industries worked in
        - Notable achievements and impact
        - Career progression and growth
        
        Keep the summary to 2-3 sentences and focus on the most relevant and impressive aspects."""
        
        human_prompt = f"""
        Analyze the work experience from this resume and provide a professional summary:
        
        {resume_text}
        
        Provide a 2-3 sentence summary highlighting the most important aspects of their experience.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        response = await self._invoke_llm(messages)
        return response.strip()
    
    async def _extract_years_of_experience(self, resume_text: str) -> float:
        """Extract total years of experience"""
        system_prompt = """You are an expert at calculating total years of professional experience from resumes.
        Analyze the work history and calculate the total years of relevant professional experience.
        Consider overlapping positions and exclude internships unless they are the only experience.
        Return only a number (can be decimal like 3.5 for 3 years and 6 months)."""
        
        human_prompt = f"""
        Calculate the total years of professional experience from this resume:
        
        {resume_text}
        
        Return only the number of years (e.g., 5.5 for 5 years and 6 months).
        If unclear, provide your best estimate.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        try:
            response = await self._invoke_llm(messages)
            # Extract number from response
            numbers = re.findall(r'\d+\.?\d*', response)
            if numbers:
                return float(numbers[0])
            return 0.0
        except:
            logger.warning("Could not extract years of experience, defaulting to 0")
            return 0.0
    
    async def _extract_key_roles(self, resume_text: str) -> list:
        """Extract key roles and positions"""
        system_prompt = """You are an expert at identifying key roles and positions from resumes.
        Extract the main job titles/positions held by the candidate.
        Return only a JSON array of job titles, no explanations."""
        
        human_prompt = f"""
        Extract the key job titles/positions from this resume:
        
        {resume_text}
        
        Return format: ["Job Title 1", "Job Title 2", "Job Title 3", ...]
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        response = await self._invoke_llm(messages)
        roles = self._extract_list_from_response(response)
        
        # Clean and limit roles
        cleaned_roles = []
        for role in roles:
            if isinstance(role, str) and role.strip():
                cleaned_roles.append(role.strip())
        
        return cleaned_roles[:8]  # Limit to top 8 roles
    
    async def _extract_achievements(self, resume_text: str) -> list:
        """Extract key achievements and accomplishments"""
        system_prompt = """You are an expert at identifying achievements and accomplishments from resumes.
        Extract specific, quantifiable achievements that demonstrate impact and value.
        Focus on results, metrics, awards, and notable accomplishments.
        Return only a JSON array of achievements."""
        
        human_prompt = f"""
        Extract key achievements and accomplishments from this resume:
        
        {resume_text}
        
        Focus on:
        - Quantifiable results (increased sales by X%, reduced costs by Y)
        - Awards and recognition
        - Successful projects or initiatives
        - Leadership accomplishments
        
        Return format: ["Achievement 1", "Achievement 2", ...]
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        response = await self._invoke_llm(messages)
        achievements = self._extract_list_from_response(response)
        
        # Clean and limit achievements
        cleaned_achievements = []
        for achievement in achievements:
            if isinstance(achievement, str) and achievement.strip():
                cleaned_achievements.append(achievement.strip())
        
        return cleaned_achievements[:6]  # Limit to top 6 achievements
    
    async def _analyze_career_progression(self, resume_text: str) -> str:
        """Analyze career progression and growth"""
        system_prompt = """You are an expert at analyzing career progression from resumes.
        Analyze how the candidate has grown and progressed in their career.
        Look for patterns of increasing responsibility, skill development, and advancement.
        Provide a brief assessment of their career trajectory."""
        
        human_prompt = f"""
        Analyze the career progression from this resume:
        
        {resume_text}
        
        Provide a brief 1-2 sentence assessment of their career growth and progression.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        response = await self._invoke_llm(messages)
        return response.strip()
