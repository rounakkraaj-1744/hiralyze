from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from langchain_openai import ChatOpenAI
from core.config import settings
from core.logging import logger

class BaseAgent(ABC):
    """Base class for all AI agents"""
    
    def __init__(self, name: str, model: str = None, temperature: float = None):
        self.name = name
        self.model = model or settings.OPENAI_MODEL
        self.temperature = temperature or settings.OPENAI_TEMPERATURE
        self.llm = ChatOpenAI(
            model=self.model,
            temperature=self.temperature,
            api_key=settings.GROQ_API_KEY
        )
        logger.info(f"Initialized {self.name} agent with model {self.model}")
    
    @abstractmethod
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input data and return results"""
        pass
    
    async def _invoke_llm(self, messages: list) -> str:
        """Invoke the language model with error handling"""
        try:
            response = await self.llm.ainvoke(messages)
            return response.content
        except Exception as e:
            logger.error(f"Error invoking LLM in {self.name}: {str(e)}")
            raise
    
    def _extract_json_from_response(self, response: str) -> Optional[Dict]:
        """Extract JSON from LLM response"""
        import json
        import re
        
        try:
            # Try to find JSON in the response
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                return json.loads(json_str)
            
            # Try to parse the entire response as JSON
            return json.loads(response)
        except json.JSONDecodeError:
            logger.warning(f"Could not extract JSON from {self.name} response")
            return None
    
    def _extract_list_from_response(self, response: str) -> list:
        """Extract list from LLM response"""
        import json
        import re
        
        try:
            # Try to find list in the response
            list_match = re.search(r'\[.*\]', response, re.DOTALL)
            if list_match:
                list_str = list_match.group()
                return json.loads(list_str)
            
            # Try to parse the entire response as list
            return json.loads(response)
        except json.JSONDecodeError:
            logger.warning(f"Could not extract list from {self.name} response")
            return []
