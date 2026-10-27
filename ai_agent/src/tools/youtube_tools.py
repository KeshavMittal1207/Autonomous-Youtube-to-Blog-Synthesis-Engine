import re
import requests
from typing import Tuple
from youtube_transcript_api import (
    YouTubeTranscriptApi,
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
    InvalidVideoId
)
from src.utils.logger import logger

def extract_video_id(url_or_id: str) -> str:
    """Extract YouTube 11-character video ID from full URL or raw ID."""
    url_or_id = url_or_id.strip()
    if not url_or_id:
        raise ValueError("Video URL or ID cannot be empty.")
        
    # Regex patterns for various YouTube URL formats
    patterns = [
        r"(?:v=|\/)([0-9A-Za-z_-]{11}).*",
        r"youtu\.be\/([0-9A-Za-z_-]{11})",
        r"embed\/([0-9A-Za-z_-]{11})",
        r"^([0-9A-Za-z_-]{11})$"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url_or_id)
        if match:
            return match.group(1)
            
    return url_or_id

def fetch_title(video_id: str) -> str:
    """Fetch video title using YouTube oEmbed service with fallback."""
    clean_id = extract_video_id(video_id)
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={clean_id}&format=json"
    
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return response.json().get("title", f"YouTube Video ({clean_id})")
        logger.warning(f"Failed to fetch oEmbed title for video {clean_id}. Status code: {response.status_code}")
    except Exception as e:
        logger.error(f"Error fetching YouTube video title: {str(e)}")
        
    return f"YouTube Video ({clean_id})"

def fetch_transcript(video_id: str, languages: Tuple[str, ...] = ("en", "en-US", "en-GB")) -> str:
    """
    Fetch transcript for a given YouTube video ID.
    Handles multiple languages, auto-generated transcripts, and API exceptions gracefully.
    """
    clean_id = extract_video_id(video_id)
    
    try:
        # Initial attempt with specified English language preferences
        transcript_list = YouTubeTranscriptApi().fetch(video_id=clean_id, languages=list(languages))
        full_text = " ".join([snippet.text for snippet in transcript_list.snippets])
        logger.info(f"Successfully retrieved transcript for video {clean_id} ({len(full_text)} characters).")
        return full_text
        
    except (NoTranscriptFound, TranscriptsDisabled):
        logger.warning(f"Preferred transcripts not found for {clean_id}. Attempting to list all available transcripts...")
        try:
            # Fallback: Find any available transcript or auto-translated transcript
            transcript_manifest = YouTubeTranscriptApi().list(video_id = clean_id)
            
            # Try to get an auto-translated English version if available
            try:
                transcript = transcript_manifest.find_transcript(list(languages))
            except Exception:
                # Pick first available manual or generated transcript and translate to English
                first_transcript = next(iter(transcript_manifest))
                transcript = first_transcript.translate("en")
                
            transcript_data = transcript.fetch()
            full_text = " ".join([item["text"] for item in transcript_data])
            logger.info(f"Retrieved translated transcript for video {clean_id}.")
            return full_text
            
        except Exception as fallback_error:
            raise RuntimeError(f"Could not retrieve transcript for video ID '{clean_id}': {str(fallback_error)}")
            
    except VideoUnavailable:
        raise ValueError(f"The YouTube video '{clean_id}' is unavailable or private.")
    except InvalidVideoId:
        raise ValueError(f"The provided video ID '{clean_id}' is invalid.")
    except Exception as e:
        raise RuntimeError(f"Unexpected error fetching transcript for video '{clean_id}': {str(e)}")
