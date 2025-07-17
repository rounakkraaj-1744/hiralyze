from typing import Dict, Any, List
from langchain_core.messages import HumanMessage, SystemMessage
from agents.base_agent import BaseAgent
from core.logging import logger

class SummaryGeneratorAgent(BaseAgent):
    """Agent responsible for generating professional candidate summaries"""
    
    def __init__(self):
        super().__init__("SummaryGenerator", temperature=0.3)
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a comprehensive professional summary"""
        resume_text = input_data.get('resume_text', '')
        skills = input_data.get('skills', [])
        experience = input_data.get('experience', '')
        job_match = input_data.get('job_match', {})
        
        if not resume_text:
            raise ValueError("Resume text is required for summary generation")
        
        try:
            # Generate professional summary
            summary = await self._generate_professional_summary(
                resume_text, skills, experience, job_match
            )
            
            # Generate executive summary
            executive_summary = await self._generate_executive_summary(
                resume_text, skills, job_match
            )
            
            # Generate key highlights
            key_highlights = await self._generate_key_highlights(
                resume_text, skills, job_match
            )
            
            logger.info("Professional summary generated successfully")
            
            return {
                'summary': summary,
                'executive_summary': executive_summary,
                'key_highlights': key_highlights
            }
            
        except Exception as e:
            logger.error(f"Error generating summary: {str(e)}")
            raise
    
    async def _generate_professional_summary(
        self, 
        resume_text: str, 
        skills: List[str], 
        experience: str,
        job_match: Dict[str, Any]
    ) -> str:
        """Generate a professional summary for the candidate"""
        
        top_skills = ", ".join(skills[:8]) if skills else "Various technical skills"
        overall_score = job_match.get('overall_score', 0)
        strengths = job_match.get('strengths', [])
        
        system_prompt = """You are an expert at writing professional candidate summaries for HR and recruitment.
        Create a compelling, professional summary that highlights the candidate's key qualifications,
        experience, and potential value to employers. The summary should be:
        - 2-3 sentences long
        - Professional and engaging
        - Focused on achievements and value proposition
        - Tailored to highlight relevant experience
        
        Do not mention specific companies unless they are well-known and add significant value."""
        
        human_prompt = f"""
        Create a professional summary for this candidate:
        
        Experience Summary: {experience}
        
        Key Skills: {top_skills}
        
        Match Score: {overall_score}%
        
        Key Strengths: {', '.join(strengths[:3]) if strengths else 'Strong professional background'}
        
        Resume Context:
        {resume_text[:1000]}...
        
        Write a compelling 2-3 sentence professional summary that would appeal to recruiters and hiring managers.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        response = await self._invoke_llm(messages)
        return response.strip()
    
    async def _generate_executive_summary(
        self, 
        resume_text: str, 
        skills: List[str],
        job_match: Dict[str, Any]
    ) -> str:
        """Generate an executive-level summary"""
        
        system_prompt = """You are an expert at writing executive summaries for senior-level candidates.
        Create a brief, high-impact summary that focuses on leadership, strategic impact, and business value.
        Keep it to 1-2 sentences and focus on the most impressive aspects."""
        
        human_prompt = f"""
        Create an executive summary for this candidate:
        
        Skills: {', '.join(skills[:5]) if skills else 'Leadership and technical skills'}
        
        Resume:
        {resume_text[:800]}...
        
        Write a 1-2 sentence executive summary highlighting their most impressive qualifications and impact.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        try:
            response = await self._invoke_llm(messages)
            return response.strip()
        except:
            return "Experienced professional with strong technical and leadership capabilities."
    
    async def _generate_key_highlights(
        self, 
        resume_text: str, 
        skills: List[str],
        job_match: Dict[str, Any]
    ) -> List[str]:
        """Generate key highlights/bullet points"""
        
        system_prompt = """You are an expert at identifying key highlights from candidate profiles.
        Extract the most impressive and relevant highlights that would catch a recruiter's attention.
        Focus on achievements, unique qualifications, and standout experiences.
        Return only a JSON array of highlights."""
        
        human_prompt = f"""
        Generate key highlights for this candidate:
        
        Skills: {', '.join(skills[:10]) if skills else 'Various skills'}
        
        Resume:
        {resume_text}
        
        Extract 4-6 key highlights that would impress recruiters. Focus on:
        - Quantifiable achievements
        - Unique qualifications
        - Leadership experience
        - Technical expertise
        - Notable accomplishments
        
        Return format: ["highlight1", "highlight2", "highlight3", ...]
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        try:
            response = await self._invoke_llm(messages)
            highlights = self._extract_list_from_response(response)
            
            # Clean and limit highlights
            cleaned_highlights = []
            for highlight in highlights:
                if isinstance(highlight, str) and highlight.strip():
                    cleaned_highlights.append(highlight.strip())
            
            return cleaned_highlights[:6]  # Limit to top 6 highlights
        except:
            logger.warning("Could not generate key highlights")
            return [
                "Strong technical background",
                "Proven track record of success",
                "Excellent communication skills"
            ]
