from typing import TypedDict, Literal, Optional, List

class AgentState(TypedDict, total=False):
    """
    State definition for YouTube-to-Blog LangGraph workflow.
    """
    video_id: str
    title: str
    transcript: str
    
    blog_draft: str
    evaluation: Literal["approved", "needs_improvement", "failed"]
    feedback: str
    readability_score: int
    seo_score: int
    
    iteration: int
    max_iteration: int
    
    # Human-in-the-loop fields
    user_action: Optional[Literal["publish", "revise", "stop"]]
    revision_instructions: Optional[str]
    
    # Publication state
    published: bool
    published_url: Optional[str]
    
    error: Optional[str]
    logs: List[str]
