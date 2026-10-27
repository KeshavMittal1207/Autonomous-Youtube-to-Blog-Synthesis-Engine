from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from src.config import GROQ_API_KEY, MODEL, TEMPERATURE
from src.utils.logger import logger

def _get_llm(temperature: float = TEMPERATURE):
    return ChatGroq(
        model=MODEL,
        api_key=GROQ_API_KEY,
        temperature=temperature
    )

def preprocess_transcript(transcript: str, max_chars: int = 16000) -> str:
    """Truncates transcript if it exceeds context limit."""
    if len(transcript) <= max_chars:
        return transcript
    logger.warning(f"Transcript length ({len(transcript)} chars) truncated for safety window...")
    return transcript[:max_chars] + "\n\n...[Transcript truncated due to length limits]..."

def generate_blog_draft(title: str, transcript: str) -> str:
    """Generates a structured, engaging, SEO-optimized markdown blog post from transcript."""
    llm = _get_llm()
    clean_transcript = preprocess_transcript(transcript)

    system_prompt = (
        "You are an expert technical content writer and SEO specialist. "
        "Transform raw YouTube video transcripts into compelling, well-structured Markdown blog articles."
    )

    user_prompt = f"""
    Please convert the following YouTube video transcript into a high-quality blog post.

    **Video Title:** {title}

    **Requirements:**
    1. **Title**: Catchy H1 heading.
    2. **TL;DR**: 2-3 sentence summary at the start.
    3. **Structure**: H2 and H3 subheadings.
    4. **Formatting**: Markdown lists, bold text, code blocks where applicable.
    5. **Conclusion**: Key takeaways at the end.

    **Raw Video Transcript:**
    {clean_transcript}
    """

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt)
    ]

    response = llm.invoke(messages)
    return str(response.content)
