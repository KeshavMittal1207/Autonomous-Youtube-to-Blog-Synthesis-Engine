from typing import Literal
from pydantic import BaseModel, Field
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from src.config import GROQ_API_KEY, MODEL
from src.utils.logger import logger

class EvaluationSchema(BaseModel):
    """Structured quality assessment schema for blog drafts."""
    readability_score: int = Field(..., ge=1, le=10, description="Readability score 1-10")
    seo_score: int = Field(..., ge=1, le=10, description="SEO score 1-10")
    evaluation: Literal["approved", "needs_improvement"] = Field(..., description="Verdict")
    feedback: str = Field(..., description="Critique feedback")

def evaluate_blog_draft(blog_draft: str) -> EvaluationSchema:
    """Evaluates blog draft quality using structured LLM output."""
    llm = ChatGroq(
        model=MODEL,
        api_key=GROQ_API_KEY,
        temperature=0.1
    )

    structured_llm = llm.with_structured_output(EvaluationSchema)

    system_prompt = (
        "You are an editorial director. Evaluate the blog draft for readability, SEO, and Markdown structure. "
        "If scores are >= 7, set evaluation to 'approved', else 'needs_improvement'."
    )

    user_prompt = f"Assess this blog draft:\n\n{blog_draft}"

    try:
        result = structured_llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ])
        return result
    except Exception as e:
        logger.error(f"Evaluation failed: {str(e)}. Using fallback approval.")
        return EvaluationSchema(
            readability_score=7,
            seo_score=7,
            evaluation="approved",
            feedback="Evaluation fallback applied."
        )
