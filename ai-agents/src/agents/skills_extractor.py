from typing import Dict, Any, List
from langchain_core.messages import HumanMessage, SystemMessage
from agents.base_agent import BaseAgent
from core.logging import logger

class SkillsExtractorAgent(BaseAgent):
    """Agent responsible for extracting skills from resume text"""
    
    def __init__(self):
        super().__init__("SkillsExtractor", temperature=0.1)
        self.skill_categories = {
            'programming': ['python', 'java', 'javascript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift'],
            'web': ['html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask'],
            'database': ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sql server'],
            'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins'],
            'data': ['pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'tableau', 'power bi'],
            'mobile': ['android', 'ios', 'react native', 'flutter', 'xamarin', 'swift', 'kotlin'],
            'tools': ['git', 'jira', 'confluence', 'slack', 'trello', 'figma', 'photoshop']
        }
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract skills from resume text"""
        resume_text = input_data.get('resume_text', '')
        
        if not resume_text:
            raise ValueError("Resume text is required for skill extraction")
        
        try:
            # Extract technical skills
            technical_skills = await self._extract_technical_skills(resume_text)
            
            # Extract soft skills
            soft_skills = await self._extract_soft_skills(resume_text)
            
            # Categorize skills
            categorized_skills = self._categorize_skills(technical_skills)
            
            # Calculate skill confidence scores
            skill_analysis = await self._analyze_skill_proficiency(resume_text, technical_skills)
            
            all_skills = technical_skills + soft_skills
            
            logger.info(f"Extracted {len(all_skills)} skills from resume")
            
            return {
                'skills': all_skills,
                'technical_skills': technical_skills,
                'soft_skills': soft_skills,
                'categorized_skills': categorized_skills,
                'skill_analysis': skill_analysis
            }
            
        except Exception as e:
            logger.error(f"Error extracting skills: {str(e)}")
            raise
    
    async def _extract_technical_skills(self, resume_text: str) -> List[str]:
        """Extract technical skills from resume"""
        system_prompt = """You are an expert at extracting technical skills from resumes. 
        Extract all technical skills, programming languages, frameworks, tools, and technologies mentioned.
        Return only a JSON array of skills, no explanations."""
        
        human_prompt = f"""
        Extract technical skills from this resume text:
        
        {resume_text}
        
        Return format: ["skill1", "skill2", "skill3", ...]
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        response = await self._invoke_llm(messages)
        skills = self._extract_list_from_response(response)
        
        # Clean and deduplicate skills
        cleaned_skills = []
        for skill in skills:
            if isinstance(skill, str) and skill.strip():
                cleaned_skill = skill.strip().lower()
                if cleaned_skill not in [s.lower() for s in cleaned_skills]:
                    cleaned_skills.append(skill.strip())
        
        return cleaned_skills[:20]  # Limit to top 20 skills
    
    async def _extract_soft_skills(self, resume_text: str) -> List[str]:
        """Extract soft skills from resume"""
        system_prompt = """You are an expert at identifying soft skills from resumes.
        Extract soft skills like leadership, communication, teamwork, problem-solving, etc.
        Return only a JSON array of soft skills."""
        
        human_prompt = f"""
        Extract soft skills from this resume text:
        
        {resume_text}
        
        Return format: ["skill1", "skill2", "skill3", ...]
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        response = await self._invoke_llm(messages)
        skills = self._extract_list_from_response(response)
        
        # Clean and limit soft skills
        cleaned_skills = []
        for skill in skills:
            if isinstance(skill, str) and skill.strip():
                cleaned_skill = skill.strip()
                if cleaned_skill not in cleaned_skills:
                    cleaned_skills.append(cleaned_skill)
        
        return cleaned_skills[:10]  # Limit to top 10 soft skills
    
    def _categorize_skills(self, skills: List[str]) -> Dict[str, List[str]]:
        """Categorize technical skills"""
        categorized = {category: [] for category in self.skill_categories.keys()}
        uncategorized = []
        
        for skill in skills:
            skill_lower = skill.lower()
            categorized_flag = False
            
            for category, category_skills in self.skill_categories.items():
                if any(cat_skill in skill_lower for cat_skill in category_skills):
                    categorized[category].append(skill)
                    categorized_flag = True
                    break
            
            if not categorized_flag:
                uncategorized.append(skill)
        
        if uncategorized:
            categorized['other'] = uncategorized
        
        # Remove empty categories
        return {k: v for k, v in categorized.items() if v}
    
    async def _analyze_skill_proficiency(self, resume_text: str, skills: List[str]) -> List[Dict]:
        """Analyze skill proficiency levels"""
        if not skills:
            return []
        
        skills_str = ", ".join(skills[:10])  # Analyze top 10 skills
        
        system_prompt = """You are an expert at analyzing skill proficiency from resumes.
        For each skill, determine the proficiency level based on context, experience, and usage.
        Return a JSON array with skill analysis."""
        
        human_prompt = f"""
        Analyze the proficiency level for these skills based on the resume context:
        Skills: {skills_str}
        
        Resume text:
        {resume_text}
        
        For each skill, provide:
        - skill name
        - proficiency level (beginner/intermediate/advanced/expert)
        - confidence score (0-1)
        - evidence (brief context from resume)
        
        Return format:
        [
            {{
                "skill": "skill_name",
                "proficiency": "level",
                "confidence": 0.8,
                "evidence": "brief context"
            }}
        ]
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt)
        ]
        
        try:
            response = await self._invoke_llm(messages)
            analysis = self._extract_json_from_response(response)
            
            if isinstance(analysis, list):
                return analysis
            elif isinstance(analysis, dict):
                return [analysis]
            else:
                return []
                
        except Exception as e:
            logger.warning(f"Could not analyze skill proficiency: {str(e)}")
            return []

