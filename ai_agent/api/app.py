import sys
import os

# Ensure src modules are resolvable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from typing import Optional, List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from langgraph.types import Command

from src.config import validate_config
from src.graph.workflow import build_blog_workflow
from src.utils.logger import logger

# Simple startup validation
validate_config()

app = FastAPI(
    title="YouTube-to-Blog Agentic API",
    description="Simple REST API for YouTube to Blog workflow using LangGraph interrupt & Command.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compiled graph with MemorySaver checkpointer
graph = build_blog_workflow()

class GenerateBlogRequest(BaseModel):
    video_id: str = Field(..., description="YouTube Video ID or full URL", json_schema_extra={"example": "dQw4w9WgXcQ"})
    thread_id: str = Field(default="thread-1", description="Session thread ID for state persistence")
    max_iteration: Optional[int] = Field(default=3, ge=1, le=5)

class ResumeWorkflowRequest(BaseModel):
    thread_id: str = Field(default="thread-1", description="Session thread ID")
    action: str = Field(..., description="Action: 'publish', 'revise', or 'stop'", json_schema_extra={"example": "publish"})
    instructions: Optional[str] = Field(default="", description="Instructions if action is 'revise'")

class BlogResponse(BaseModel):
    thread_id: Optional[str] = None
    title: Optional[str] = None
    blog_draft: Optional[str] = None
    evaluation: Optional[str] = None
    feedback: Optional[str] = None
    readability_score: Optional[int] = None
    seo_score: Optional[int] = None
    status: str = "completed"
    published: Optional[bool] = False
    published_url: Optional[str] = None
    error: Optional[str] = None
    logs: List[str] = []

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai_agent"}

@app.post("/generate-blog", response_model=BlogResponse)
def generate_blog_endpoint(request: GenerateBlogRequest):
    """Starts the workflow. If draft is approved, graph pauses via interrupt() for user action."""
    config = {"configurable": {"thread_id": request.thread_id}}
    initial_state = {
        "video_id": request.video_id,
        "iteration": 1,
        "max_iteration": request.max_iteration,
        "logs": []
    }
    
    result = graph.invoke(initial_state, config=config)
    
    if result.get("error"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
        
    return BlogResponse(
        thread_id=request.thread_id,
        title=result.get("title"),
        blog_draft=result.get("blog_draft"),
        evaluation=result.get("evaluation"),
        feedback=result.get("feedback"),
        readability_score=result.get("readability_score"),
        seo_score=result.get("seo_score"),
        status="interrupted" if result.get("user_action") is None and not result.get("published") else "completed",
        published=result.get("published", False),
        published_url=result.get("published_url"),
        error=result.get("error"),
        logs=result.get("logs", [])
    )

@app.post("/resume-workflow", response_model=BlogResponse)
def resume_workflow_endpoint(request: ResumeWorkflowRequest):
    """Resumes graph execution passing user decision via Command(resume=...)."""
    config = {"configurable": {"thread_id": request.thread_id}}
    
    resume_payload = {
        "action": request.action,
        "instructions": request.instructions or ""
    }
    
    # Resume graph using LangGraph Command
    result = graph.invoke(Command(resume=resume_payload), config=config)
    
    return BlogResponse(
        thread_id=request.thread_id,
        title=result.get("title"),
        blog_draft=result.get("blog_draft"),
        evaluation=result.get("evaluation"),
        feedback=result.get("feedback"),
        readability_score=result.get("readability_score"),
        seo_score=result.get("seo_score"),
        status="completed" if request.action != "revise" else "interrupted",
        published=result.get("published", False),
        published_url=result.get("published_url"),
        error=result.get("error"),
        logs=result.get("logs", [])
    )
