from typing import Dict, Any, List
from langchain_core.messages import HumanMessage, SystemMessage
from agents.base_agent import BaseAgent
from core.logging import logger

class JobMatcherAgent(BaseAgent):
    """Agent responsible for matching candidates to job requirements"""
    
    def __init__(self):
        super().__init__("JobMatcher", temperature=0.1)
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate how well the candidate matches the job requirements"""
        resume_text = input_data.get('resume_text', '')
        job_description = input_data.get('job_description', '')
        job_requirements = input_data.get('job_requirements', [])
        extracted_skills = input_data.get('extracted_skills', [])
        
        if not resume_text or not job_description:
            raise ValueError("Resume text and job description are required for job matching")
        
        try:
            # Perform comprehensive job matching analysis
            match_analysis = await self._perform_job_matching(
                resume_text, job_description, job_requirements, extracted_skills
            )
            
            # Calculate specific match scores
            skills_match = await self._calculate_skills_match(extracted_skills, job_requirements)
            experience_match = await self._calculate_experience_match(resume_text, job_description)
            
            # Identify missing skills
            missing_skills = await self._identify_missing_skills(extracted_skills, job_requirements)
            
            # Generate recommendations
            recommendations = await self._generate_recommendations(
                resume_text, job_description, missing_skills
            )
            
            # Combine all results
            result = {
                'overall_score': match_analysis.get('overall_score', 50),
                'skills_match': skills_match,
                'experience_match': experience_match,
                'strengths': match_analysis.get('strengths', []),
                'weaknesses': match_analysis.get('weaknesses', []),
                'missing_skills': missing_skills,
                'recommendations': recommendations,
                'detailed_analysis': match_analysis
            }
            
            logger.info(f"Job matching completed with overall score: {result['overall_score']}")
            return result
            
        except Exception as e:
            logger.error(f"Error in job matching: {str(e)}")
            raise
    
    async def _perform_job_matching(
        self, 
        resume_text: str, 
        job_description: str, 
        job_requirements: List[str],
        extracted_skills: List[str]
    ) -> Dict[str, Any]:
        """Perform comprehensive job matching analysis"""
        
        requirements_text = "\n".join([f"- {req}" for req in job_requirements])
        skills_text = ", ".join(extracted_skills[:15])  # Top 15 skills
        
        system_prompt = """You are an expert HR analyst specializing in candidate-job matching.
        Analyze how well this candidate matches the job requirements and provide a detailed assessment.
        Consider skills, experience, qualifications, and overall fit.
        Be objective and provide specific reasoning for your scores."""
        
        human_prompt = f"""
        Analyze how well this candidate matches the job requirements:
        
        JOB DESCRIPTION:
        {job_description}
        
        JOB REQUIREMENTS:
        {requirements_text}
        
        CANDIDATE SKILLS:
        {skills_text}
        
        CANDIDATE RESUME:
        {resume_text}
        
        Provide your analysis in the following JSON format:
        {{
            "overall_score": <score from 0-100>,
            "skills_match": <score from 0-100>,
            "experience_match": <score from 0-100>,
            "cultural_fit": <score from 0-100>,
            "strengths": ["strength1", "strength2", "strength3"],
            "weaknesses": ["weakness1", "weakness2", "weakness3"],
            "key_matches": ["match1", "match2", "match3"],
            "concerns": ["concern1", "concern2"],
            "reasoning": "Brief explanation of the overall assessment"
        }}
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        try:
            response = await self._invoke_llm(messages)
            analysis = self._extract_json_from_response(response)
            
            if isinstance(analysis, dict):
                return analysis
            else:
                # Fallback response
                return {
                    "overall_score": 50,
                    "skills_match": 50,
                    "experience_match": 50,
                    "cultural_fit": 50,
                    "strengths": ["Experience in relevant field"],
                    "weaknesses": ["Analysis incomplete"],
                    "key_matches": [],
                    "concerns": ["Unable to complete full analysis"],
                    "reasoning": "Partial analysis due to processing limitations"
                }
                
        except Exception as e:
            logger.warning(f"Could not complete job matching analysis: {str(e)}")
            return {
                "overall_score": 50,
                "skills_match": 50,
                "experience_match": 50,
                "cultural_fit": 50,
                "strengths": [],
                "weaknesses": [],
                "key_matches": [],
                "concerns": [],
                "reasoning": "Analysis failed"
            }
    
    async def _calculate_skills_match(self, candidate_skills: List[str], job_requirements: List[str]) -> float:
        """Calculate skills match percentage"""
        if not candidate_skills or not job_requirements:
            return 0.0
        
        system_prompt = """You are an expert at matching candidate skills to job requirements.
        Calculate what percentage of the job requirements are met by the candidate's skills.
        Consider both exact matches and related/transferable skills.
        Return only a number between 0 and 100."""
        
        skills_text = ", ".join(candidate_skills)
        requirements_text = ", ".join(job_requirements)
        
        human_prompt = f"""
        Calculate the skills match percentage:
        
        Candidate Skills: {skills_text}
        Job Requirements: {requirements_text}
        
        Return only a number between 0-100 representing the match percentage.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        try:
            response = await self._invoke_llm(messages)
            # Extract number from response
            import re
            numbers = re.findall(r'\d+\.?\d*', response)
            if numbers:
                score = float(numbers[0])
                return min(100, max(0, score))  # Ensure between 0-100
            return 50.0  # Default if no number found
        except:
            logger.warning("Could not calculate skills match, defaulting to 50")
            return 50.0
    
    async def _calculate_experience_match(self, resume_text: str, job_description: str) -> float:
        """Calculate experience match percentage"""
        system_prompt = """You are an expert at evaluating if a candidate's experience matches job requirements.
        Analyze the candidate's experience against what the job requires.
        Consider years of experience, relevant industries, similar roles, and transferable experience.
        Return only a number between 0 and 100."""
        
        human_prompt = f"""
        Calculate the experience match percentage:
        
        Job Description: {job_description}
        
        Candidate Resume: {resume_text}
        
        Return only a number between 0-100 representing how well their experience matches.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        try:
            response = await self._invoke_llm(messages)
            import re
            numbers = re.findall(r'\d+\.?\d*', response)
            if numbers:
                score = float(numbers[0])
                return min(100, max(0, score))
            return 50.0
        except:
            logger.warning("Could not calculate experience match, defaulting to 50")
            return 50.0
    
    async def _identify_missing_skills(self, candidate_skills: List[str], job_requirements: List[str]) -> List[str]:
        """Identify skills that are required but missing from candidate"""
        if not job_requirements:
            return []
        
        system_prompt = """You are an expert at identifying skill gaps.
        Compare the candidate's skills with job requirements and identify what's missing.
        Focus on important technical skills, tools, or qualifications that are clearly required but not present.
        Return only a JSON array of missing skills."""
        
        skills_text = ", ".join(candidate_skills)
        requirements_text = ", ".join(job_requirements)
        
        human_prompt = f"""
        Identify missing skills:
        
        Candidate Skills: {skills_text}
        Job Requirements: {requirements_text}
        
        Return format: ["missing_skill1", "missing_skill2", ...]
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        try:
            response = await self._invoke_llm(messages)
            missing_skills = self._extract_list_from_response(response)
            
            # Clean and limit missing skills
            cleaned_missing = []
            for skill in missing_skills:
                if isinstance(skill, str) and skill.strip():
                    cleaned_missing.append(skill.strip())
            
            return cleaned_missing[:8]  # Limit to top 8 missing skills
        except:
            logger.warning("Could not identify missing skills")
            return []
    
    async def _generate_recommendations(
        self, 
        resume_text: str, 
        job_description: str, 
        missing_skills: List[str]
    ) -> List[str]:
        """Generate recommendations for the candidate"""
        system_prompt = """You are an expert career advisor.
        Based on the candidate's profile and the job requirements, provide actionable recommendations
        to help them become a better fit for this role or similar positions.
        Focus on skill development, experience building, and career advancement.
        Return only a JSON array of recommendations."""
        
        missing_skills_text = ", ".join(missing_skills) if missing_skills else "None identified"
        
        human_prompt = f"""
        Generate career recommendations:
        
        Job Description: {job_description}
        
        Candidate Resume: {resume_text}
        
        Missing Skills: {missing_skills_text}
        
        Provide 3-5 actionable recommendations to help this candidate improve their fit for this role.
        
        Return format: ["recommendation1", "recommendation2", ...]
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        try:
            response = await self._invoke_llm(messages)
            recommendations = self._extract_list_from_response(response)
            
            # Clean and limit recommendations
            cleaned_recommendations = []
            for rec in recommendations:
                if isinstance(rec, str) and rec.strip():
                    cleaned_recommendations.append(rec.strip())
            
            return cleaned_recommendations[:5]  # Limit to top 5 recommendations
        except:
            logger.warning("Could not generate recommendations")
            return ["Continue developing relevant skills", "Gain more experience in the field"]
