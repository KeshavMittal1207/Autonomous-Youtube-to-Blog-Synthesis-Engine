from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from src.graph.state import AgentState
from src.graph.nodes import (
    get_transcript_node,
    generate_blog_node,
    evaluate_blog_node,
    optimize_blog_node,
    human_review_node,
    revise_blog_node,
    publish_blog_node
)
from src.utils.logger import logger

def route_evaluation(state: AgentState) -> str:
    """Conditional router following quality evaluation."""
    if state.get("error") or state.get("evaluation") == "failed":
        return END
    
    evaluation = state.get("evaluation", "approved")
    iteration = state.get("iteration", 1)
    max_iteration = state.get("max_iteration", 3)

    if evaluation == "approved" or iteration >= max_iteration:
        return "human_review"
    
    return "optimize_blog"

def route_human_action(state: AgentState) -> str:
    """Conditional router following human review decision."""
    action = state.get("user_action")
    if action == "publish":
        return "publish_blog"
    elif action == "revise":
        return "revise_blog"
    return END

def build_blog_workflow():

    graph = StateGraph(AgentState)

    # Register Nodes
    graph.add_node("get_transcript", get_transcript_node)
    graph.add_node("generate_blog", generate_blog_node)
    graph.add_node("evaluate_blog", evaluate_blog_node)
    graph.add_node("optimize_blog", optimize_blog_node)
    graph.add_node("human_review", human_review_node)
    graph.add_node("revise_blog", revise_blog_node)
    graph.add_node("publish_blog", publish_blog_node)

    # Edges
    graph.add_edge(START, "get_transcript")
    graph.add_edge("get_transcript", "generate_blog")
    graph.add_edge("generate_blog", "evaluate_blog")

    # Evaluation Routing
    graph.add_conditional_edges(
        "evaluate_blog",
        route_evaluation,
        {
            "human_review": "human_review",
            "optimize_blog": "optimize_blog",
            END: END
        }
    )

    graph.add_edge("optimize_blog", "evaluate_blog")

    # Human Review Action Routing
    graph.add_conditional_edges(
        "human_review",
        route_human_action,
        {
            "publish_blog": "publish_blog",
            "revise_blog": "revise_blog",
            END: END
        }
    )

    # After revision, loop back to human_review node
    graph.add_edge("revise_blog", "human_review")
    graph.add_edge("publish_blog", END)

    # MemorySaver is mandatory for state persistence with interrupt/Command
    checkpointer = MemorySaver()
    compiled_graph = graph.compile(checkpointer=checkpointer)
    logger.info("LangGraph workflow compiled successfully.")
    return compiled_graph
