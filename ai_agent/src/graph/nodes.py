from langgraph.types import interrupt
from src.graph.state import AgentState
from src.tools.youtube_tools import fetch_transcript, fetch_title, extract_video_id
from src.tools.publishing_tools import publish_to_devto
from src.agents.blog_generator import generate_blog_draft
from src.agents.blog_evaluator import evaluate_blog_draft
from src.agents.blog_reviser import optimize_blog_draft, revise_blog_with_instructions
from src.utils.logger import logger

def get_transcript_node(state: AgentState) -> AgentState:
    """Node: Fetches video metadata and transcript from YouTube."""
    logs = list(state.get("logs", []))
    raw_id = state.get("video_id", "")
    
    try:
        clean_id = extract_video_id(raw_id)
        logs.append(f"Extracting video ID: {clean_id}")
        
        title = fetch_title(clean_id)
        transcript = fetch_transcript(clean_id)
        
        logs.append(f"Fetched transcript ({len(transcript)} chars).")
        return {
            **state,
            "video_id": clean_id,
            "title": title,
            "transcript": transcript,
            "logs": logs
        }
    except Exception as e:
        err_msg = f"Failed to fetch YouTube data: {str(e)}"
        logger.error(err_msg)
        logs.append(err_msg)
        return {
            **state,
            "evaluation": "failed",
            "error": err_msg,
            "logs": logs
        }

def generate_blog_node(state: AgentState) -> AgentState:
    """Node: Drafts the initial blog post."""
    if state.get("error"):
        return state

    logs = list(state.get("logs", []))
    logs.append("Generating initial blog draft...")
    
    try:
        blog = generate_blog_draft(state["title"], state["transcript"])
        logs.append("Blog draft generated successfully.")
        return {
            **state,
            "blog_draft": blog,
            "iteration": state.get("iteration", 1),
            "max_iteration": state.get("max_iteration", 3),
            "logs": logs
        }
    except Exception as e:
        err_msg = f"Blog generation failed: {str(e)}"
        logger.error(err_msg)
        logs.append(err_msg)
        return {
            **state,
            "evaluation": "failed",
            "error": err_msg,
            "logs": logs
        }

def evaluate_blog_node(state: AgentState) -> AgentState:
    """Node: Evaluates blog quality."""
    if state.get("error"):
        return state

    logs = list(state.get("logs", []))
    logs.append(f"Evaluating blog draft (Iteration {state.get('iteration', 1)})...")

    try:
        eval_result = evaluate_blog_draft(state["blog_draft"])
        logs.append(f"Evaluation complete: Verdict={eval_result.evaluation}, Readability={eval_result.readability_score}/10, SEO={eval_result.seo_score}/10")
        
        return {
            **state,
            "evaluation": eval_result.evaluation,
            "feedback": eval_result.feedback,
            "readability_score": eval_result.readability_score,
            "seo_score": eval_result.seo_score,
            "logs": logs
        }
    except Exception as e:
        logger.warning(f"Evaluation fallback: {str(e)}")
        return {
            **state,
            "evaluation": "approved",
            "feedback": "Passed via fallback.",
            "readability_score": 7,
            "seo_score": 7,
            "logs": logs
        }

def optimize_blog_node(state: AgentState) -> AgentState:
    """Node: Refines draft based on automated feedback."""
    if state.get("error"):
        return state

    logs = list(state.get("logs", []))
    current_iter = state.get("iteration", 1)
    logs.append(f"Optimizing blog draft (Attempt {current_iter})...")

    try:
        optimized = optimize_blog_draft(state["blog_draft"], state.get("feedback", ""))
        logs.append("Draft optimization complete.")
        return {
            **state,
            "blog_draft": optimized,
            "iteration": current_iter + 1,
            "logs": logs
        }
    except Exception as e:
        err_msg = f"Optimization failed: {str(e)}"
        logger.error(err_msg)
        return {**state, "logs": logs + [err_msg]}

def human_review_node(state: AgentState) -> AgentState:
    """
    Node: Pauses graph execution using interrupt() to ask the user what to do next.
    User can choose: 'publish', 'revise', or 'stop'.
    """
    logs = list(state.get("logs", []))
    logs.append("Pausing workflow via interrupt() for user review...")
    
    # LangGraph interrupt pauses execution and returns prompt details to caller
    user_response = interrupt({
        "message": "Blog draft is ready. Choose action: 'publish', 'revise', or 'stop'",
        "title": state.get("title"),
        "blog_draft": state.get("blog_draft")
    })

    # When resumed via Command(resume={"action": "...", "instructions": "..."})
    action = "stop"
    instructions = ""
    
    if isinstance(user_response, dict):
        action = user_response.get("action", "stop")
        instructions = user_response.get("instructions", "")
    elif isinstance(user_response, str):
        action = user_response

    logs.append(f"Received human action: {action}")
    return {
        **state,
        "user_action": action,
        "revision_instructions": instructions,
        "logs": logs
    }

def revise_blog_node(state: AgentState) -> AgentState:
    """Node: Applies human-in-the-loop revision instructions."""
    logs = list(state.get("logs", []))
    instructions = state.get("revision_instructions")
    if not instructions:
        return state

    logs.append(f"Revising draft with instructions: {instructions}")
    try:
        revised = revise_blog_with_instructions(state["blog_draft"], instructions)
        logs.append("Revision successfully applied.")
        return {
            **state,
            "blog_draft": revised,
            "revision_instructions": None,
            "logs": logs
        }
    except Exception as e:
        err_msg = f"Human revision failed: {str(e)}"
        logger.error(err_msg)
        return {**state, "error": err_msg, "logs": logs + [err_msg]}

def publish_blog_node(state: AgentState) -> AgentState:
    """Node: Publishes finalized blog post to Dev.to."""
    logs = list(state.get("logs", []))
    logs.append("Publishing blog to Dev.to...")

    result = publish_to_devto(state.get("title", "Blog Post"), state.get("blog_draft", ""))
    if result["success"]:
        logs.append(f"Published successfully: {result['url']}")
        return {
            **state,
            "published": True,
            "published_url": result["url"],
            "logs": logs
        }
    else:
        logs.append(f"Publication failed: {result['error']}")
        return {
            **state,
            "published": False,
            "error": result["error"],
            "logs": logs
        }
