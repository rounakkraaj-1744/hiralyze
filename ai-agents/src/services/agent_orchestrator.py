import asyncio
import time
from typing import Dict, Any, List
from datetime import datetime

from models.schemas import ResumeAnalysisResponse, ExperienceAnalysis, JobMatchAnalysis
from agents.resume_parser import ResumeParserAgent
from agents.skills_extractor import SkillsExtractorAgent
from agents.experience_analyzer import ExperienceAnalyzerAgent
from agents.job_matcher import JobMatcherAgent
from agents.summary_generator import SummaryGeneratorAgent
from core.logging import logger

class AgentOrchestrator:
    """Orchestrates the workflow of AI agents for resume processing"""
    
    def __init__(self):
        self.resume_parser = ResumeParserAgent()
        self.skills_extractor = SkillsExtractorAgent()
        self.experience_analyzer = ExperienceAnalyzerAgent()
        self.job_matcher = JobMatcherAgent()
        self.summary_generator = SummaryGeneratorAgent()
        
        logger.info("Agent orchestrator initialized")
    
    async def process_resume(
        self, 
        resume_path: str, 
        job_description: str, 
        job_requirements: List[str]
    ) -> ResumeAnalysisResponse:
        """Process resume through the complete AI pipeline"""
        start_time = time.time()
        
        try:
            logger.info(f"Starting resume processing pipeline for: {resume_path}")
            
            # Step 1: Parse resume
            parse_result = await self.resume_parser.process({
                'resume_path': resume_path
            })
            
            resume_text = parse_result['resume_text']
            logger.info(f"Resume parsed successfully, {parse_result['word_count']} words")
            
            # Step 2: Extract skills (parallel with experience analysis)
            skills_task = self.skills_extractor.process({
                'resume_text': resume_text
            })
            
            # Step 3: Analyze experience
            experience_task = self.experience_analyzer.process({
                'resume_text': resume_text
            })
            
            # Wait for both to complete
            skills_result, experience_result = await asyncio.gather(
                skills_task, experience_task
            )
            
            logger.info(f"Extracted {len(skills_result['skills'])} skills")
            logger.info(f"Experience analysis completed")
            
            # Step 4: Job matching analysis
            job_match_result = await self.job_matcher.process({
                'resume_text': resume_text,
                'job_description': job_description,
                'job_requirements': job_requirements,
                'extracted_skills': skills_result['skills']
            })
            
            logger.info(f"Job matching completed with score: {job_match_result['overall_score']}")
            
            # Step 5: Generate summary
            summary_result = await self.summary_generator.process({
                'resume_text': resume_text,
                'skills': skills_result['skills'],
                'experience': experience_result['experience_summary'],
                'job_match': job_match_result
            })
            
            # Calculate processing time
            processing_time = time.time() - start_time
            
            # Build response
            response = ResumeAnalysisResponse(
                summary=summary_result['summary'],
                score=job_match_result['overall_score'],
                skills=skills_result['skills'][:15],  # Top 15 skills
                experience=experience_result['experience_summary'],
                strengths=job_match_result.get('strengths', []),
                weaknesses=job_match_result.get('weaknesses', []),
                recommendations=job_match_result.get('recommendations', []),
                detailed_skills=skills_result.get('skill_analysis', []),
                experience_analysis=ExperienceAnalysis(
                    total_years=experience_result.get('total_years'),
                    summary=experience_result['experience_summary'],
                    key_roles=experience_result.get('key_roles', []),
                    achievements=experience_result.get('achievements', [])
                ),
                job_match=JobMatchAnalysis(
                    overall_score=job_match_result['overall_score'],
                    skills_match=job_match_result.get('skills_match', 0),
                    experience_match=job_match_result.get('experience_match', 0),
                    strengths=job_match_result.get('strengths', []),
                    weaknesses=job_match_result.get('weaknesses', []),
                    missing_skills=job_match_result.get('missing_skills', []),
                    recommendations=job_match_result.get('recommendations', [])
                ),
                processing_time=processing_time
            )
            
            logger.info(f"Resume processing completed in {processing_time:.2f} seconds")
            return response
            
        except Exception as e:
            logger.error(f"Error in resume processing pipeline: {str(e)}")
            raise
    
    async def extract_skills(self, resume_text: str) -> List[str]:
        """Extract skills from resume text only"""
        try:
            result = await self.skills_extractor.process({
                'resume_text': resume_text
            })
            return result['skills']
        except Exception as e:
            logger.error(f"Error extracting skills: {str(e)}")
            raise
    
    async def analyze_experience(self, resume_text: str) -> str:
        """Analyze experience from resume text only"""
        try:
            result = await self.experience_analyzer.process({
                'resume_text': resume_text
            })
            return result['experience_summary']
        except Exception as e:
            logger.error(f"Error analyzing experience: {str(e)}")
            raise
    
    async def match_job(
        self, 
        resume_text: str, 
        job_description: str, 
        job_requirements: List[str],
        skills: List[str]
    ) -> Dict[str, Any]:
        """Perform job matching analysis"""
        try:
            result = await self.job_matcher.process({
                'resume_text': resume_text,
                'job_description': job_description,
                'job_requirements': job_requirements,
                'extracted_skills': skills
            })
            return result
        except Exception as e:
            logger.error(f"Error in job matching: {str(e)}")
            raise
