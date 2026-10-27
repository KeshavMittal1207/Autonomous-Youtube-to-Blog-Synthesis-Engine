from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from src.config import GROQ_API_KEY, MODEL

def _get_llm(temperature: float = 0.4):
    return ChatGroq(
        model=MODEL,
        api_key=GROQ_API_KEY,
        temperature=temperature
    )

def optimize_blog_draft(blog_draft: str, feedback: str) -> str:
    """Optimizes draft based on evaluator feedback."""
    llm = _get_llm(temperature=0.3)
    
    system_prompt = "You are an expert copy editor. Refine the draft according to the feedback."
    user_prompt = f"Current Draft:\n{blog_draft}\n\nFeedback:\n{feedback}\n\nProvide improved Markdown blog."
    
    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt)
    ])
    return str(response.content)

def revise_blog_with_instructions(blog_draft: str, instructions: str) -> str:
    """Revises draft based on human instructions."""
    llm = _get_llm(temperature=0.5)

    system_prompt = "You are an AI editor. Rewrite the draft following the user's instructions."
    user_prompt = f"Current Draft:\n{blog_draft}\n\nUser Instructions:\n{instructions}\n\nRewrite draft:"

    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt)
    ])
    return str(response.content)
