import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
DEV_API_KEY = os.getenv("DEV_API_KEY", "")

MODEL = os.getenv("MODEL", os.getenv("DEFAULT_MODEL", "llama-3.1-8b-instant"))
DEFAULT_MODEL = MODEL
FAST_MODEL = os.getenv("FAST_MODEL", MODEL)
MAX_ITERATIONS = int(os.getenv("MAX_ITERATIONS", "3"))
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.3"))

def validate_config():
    """Simple check to verify required environment variables."""
    if not GROQ_API_KEY:
        print("[WARNING] GROQ_API_KEY is not set in .env file!")
