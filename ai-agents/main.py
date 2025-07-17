import os
import asyncio
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from langgraph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
import tempfile
import json
import re
from datetime import datetime

app = FastAPI(title="HR Portal AI Agents", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI
llm = ChatOpenAI(model="gpt-4", temperature=0.1)
embeddings = OpenAIEmbeddings()

class ResumeAnalysisRequest(BaseModel):
    resume_path: str
    job_description: str
    job_requirements: List[str]

class ResumeAnalysisResponse(BaseModel):
    summary: str
    score: float
    skills: List[str]
    experience: str
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]

class AgentState(BaseModel):
    resume_text: str = ""
    job_description: str = ""
    job_requirements: List[str] = []
    extracted_skills: List[str] = []
    experience_summary: str = ""
    analysis_score: float = 0.0
    detailed_analysis: dict = {}
    final_summary: str = ""

class ResumeParserAgent:
    def __init__(self):
        self.name = "ResumeParser"
    
    async def parse_resume(self, file_path: str) -> str:
        """Extract text from resume file"""
        try:
            if file_path.endswith('.pdf'):
                loader = PyPDFLoader(file_path)
            elif file_path.endswith(('.doc', '.docx')):
                loader = Docx2txtLoader(file_path)
            else:
                raise ValueError("Unsupported file format")
            
            documents = loader.load()
            text = "\n".join([doc.page_content for doc in documents])
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error parsing resume: {str(e)}")

class SkillsExtractorAgent:
    def __init__(self):
        self.name = "SkillsExtractor"
        self.llm = llm
    
    async def extract_skills(self, resume_text: str) -> List[str]:
        """Extract skills from resume text"""
        prompt = f"""
        Extract all technical skills, programming languages, frameworks, tools, and technologies 
        mentioned in the following resume. Return only a JSON list of skills.
        
        Resume:
        {resume_text}
        
        Return format: ["skill1", "skill2", "skill3", ...]
        """
        
        response = await self.llm.ainvoke([HumanMessage(content=prompt)])
        
        try:
            # Extract JSON from response
            skills_text = response.content
            skills_match = re.search(r'\[(.*?)\]', skills_text, re.DOTALL)
            if skills_match:
                skills_str = '[' + skills_match.group(1) + ']'
                skills = json.loads(skills_str)
                return [skill.strip('"') for skill in skills if isinstance(skill, str)]
            return []
        except:
            return []

class ExperienceAnalyzerAgent:
    def __init__(self):
        self.name = "ExperienceAnalyzer"
        self.llm = llm
    
    async def analyze_experience(self, resume_text: str) -> str:
        """Analyze work experience from resume"""
        prompt = f"""
        Analyze the work experience section of the following resume and provide a concise summary 
        including:
        - Total years of experience
        - Key roles and responsibilities
        - Notable achievements
        - Career progression
        
        Resume:
        {resume_text}
        
        Provide a 2-3 sentence summary.
        """
        
        response = await self.llm.ainvoke([HumanMessage(content=prompt)])
        return response.content

class JobMatchingAgent:
    def __init__(self):
        self.name = "JobMatcher"
        self.llm = llm
    
    async def calculate_match_score(self, resume_text: str, job_description: str, 
                                  job_requirements: List[str], extracted_skills: List[str]) -> dict:
        """Calculate how well the resume matches the job requirements"""
        
        requirements_text = "\n".join([f"- {req}" for req in job_requirements])
        skills_text = ", ".join(extracted_skills)
        
        prompt = f"""
        Analyze how well this candidate matches the job requirements and provide a detailed assessment.
        
        Job Description:
        {job_description}
        
        Job Requirements:
        {requirements_text}
        
        Candidate Skills:
        {skills_text}
        
        Resume:
        {resume_text}
        
        Provide your analysis in the following JSON format:
        {{
            "overall_score": <score from 0-100>,
            "skills_match": <score from 0-100>,
            "experience_match": <score from 0-100>,
            "strengths": ["strength1", "strength2", ...],
            "weaknesses": ["weakness1", "weakness2", ...],
            "missing_skills": ["skill1", "skill2", ...],
            "recommendations": ["recommendation1", "recommendation2", ...]
        }}
        """
        
        response = await self.llm.ainvoke([HumanMessage(content=prompt)])
        
        try:
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            if json_match:
                analysis = json.loads(json_match.group())
                return analysis
            return {
                "overall_score": 50,
                "skills_match": 50,
                "experience_match": 50,
                "strengths": [],
                "weaknesses": [],
                "missing_skills": [],
                "recommendations": []
            }
        except:
            return {
                "overall_score": 50,
                "skills_match": 50,
                "experience_match": 50,
                "strengths": [],
                "weaknesses": [],
                "missing_skills": [],
                "recommendations": []
            }

class SummaryGeneratorAgent:
    def __init__(self):
        self.name = "SummaryGenerator"
        self.llm = llm
    
    async def generate_summary(self, resume_text: str, analysis: dict, 
                             extracted_skills: List[str], experience: str) -> str:
        """Generate a comprehensive summary of the candidate"""
        
        skills_text = ", ".join(extracted_skills[:10])  # Top 10 skills
        
        prompt = f"""
        Generate a professional summary for this candidate based on their resume analysis.
        
        Experience Summary: {experience}
        Key Skills: {skills_text}
        Overall Match Score: {analysis.get('overall_score', 0)}%
        Strengths: {', '.join(analysis.get('strengths', [])[:3])}
        
        Create a 2-3 sentence professional summary that highlights the candidate's key qualifications,
        experience, and potential fit for the role.
        """
        
        response = await self.llm.ainvoke([HumanMessage(content=prompt)])
        return response.content

# Initialize agents
resume_parser = ResumeParserAgent()
skills_extractor = SkillsExtractorAgent()
experience_analyzer = ExperienceAnalyzerAgent()
job_matcher = JobMatchingAgent()
summary_generator = SummaryGeneratorAgent()

# Define the workflow graph
def create_resume_analysis_workflow():
    workflow = StateGraph(AgentState)
    
    async def parse_resume_node(state: AgentState):
        resume_text = await resume_parser.parse_resume(state.resume_path)
        state.resume_text = resume_text
        return state
    
    async def extract_skills_node(state: AgentState):
        skills = await skills_extractor.extract_skills(state.resume_text)
        state.extracted_skills = skills
        return state
    
    async def analyze_experience_node(state: AgentState):
        experience = await experience_analyzer.analyze_experience(state.resume_text)
        state.experience_summary = experience
        return state
    
    async def match_job_node(state: AgentState):
        analysis = await job_matcher.calculate_match_score(
            state.resume_text, 
            state.job_description, 
            state.job_requirements,
            state.extracted_skills
        )
        state.detailed_analysis = analysis
        state.analysis_score = analysis.get('overall_score', 0)
        return state
    
    async def generate_summary_node(state: AgentState):
        summary = await summary_generator.generate_summary(
            state.resume_text,
            state.detailed_analysis,
            state.extracted_skills,
            state.experience_summary
        )
        state.final_summary = summary
        return state
    
    # Add nodes
    workflow.add_node("parse_resume", parse_resume_node)
    workflow.add_node("extract_skills", extract_skills_node)
    workflow.add_node("analyze_experience", analyze_experience_node)
    workflow.add_node("match_job", match_job_node)
    workflow.add_node("generate_summary", generate_summary_node)
    
    # Add edges
    workflow.set_entry_point("parse_resume")
    workflow.add_edge("parse_resume", "extract_skills")
    workflow.add_edge("extract_skills", "analyze_experience")
    workflow.add_edge("analyze_experience", "match_job")
    workflow.add_edge("match_job", "generate_summary")
    workflow.add_edge("generate_summary", END)
    
    return workflow.compile()

# Create the workflow
resume_workflow = create_resume_analysis_workflow()

@app.post("/process-resume", response_model=ResumeAnalysisResponse)
async def process_resume(request: ResumeAnalysisRequest):
    """Process a resume and analyze it against job requirements"""
    try:
        # Initialize state
        initial_state = AgentState(
            resume_path=request.resume_path,
            job_description=request.job_description,
            job_requirements=request.job_requirements
        )
        
        # Run the workflow
        result = await resume_workflow.ainvoke(initial_state)
        
        # Prepare response
        response = ResumeAnalysisResponse(
            summary=result.final_summary,
            score=result.analysis_score,
            skills=result.extracted_skills[:15],  # Top 15 skills
            experience=result.experience_summary,
            strengths=result.detailed_analysis.get('strengths', []),
            weaknesses=result.detailed_analysis.get('weaknesses', []),
            recommendations=result.detailed_analysis.get('recommendations', [])
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and temporarily store resume file"""
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.split('.')[-1]}") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        return {"file_path": tmp_file_path, "filename": file.filename}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
