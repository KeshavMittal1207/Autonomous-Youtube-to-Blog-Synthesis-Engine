import requests
from typing import Dict, Any
from src.config import DEV_API_KEY
from src.utils.logger import logger

def publish_to_devto(
    title: str,
    blog_markdown: str,
    tags: str = "ai, technology, programming, python",
    series: str = "Agentic AI Series"
) -> Dict[str, Any]:
    """
    Publishes markdown content to Dev.to via REST API.
    Returns a dictionary containing success status, URL, or error details.
    """

    headers = {
        "api-key": DEV_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "article": {
            "title": title,
            "body_markdown": blog_markdown,
            "published": True,
            "series": series,
            "tags": [tag.strip() for tag in tags.split(",") if tag.strip()],
            "description": title[:150]
        }
    }

    try:
        response = requests.post(
            "https://dev.to/api/articles",
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 201:
            data = response.json()
            article_url = data.get("url")
            logger.info(f"Blog post successfully published to Dev.to: {article_url}")
            return {
                "success": True,
                "url": article_url,
                "error": None,
                "response_data": data
            }
        else:
            err_msg = f"Dev.to API returned status {response.status_code}: {response.text}"
            logger.error(err_msg)
            return {
                "success": False,
                "url": None,
                "error": err_msg
            }
    except Exception as e:
        err_msg = f"Failed to post to Dev.to due to network or request exception: {str(e)}"
        logger.error(err_msg)
        return {
            "success": False,
            "url": None,
            "error": err_msg
        }
