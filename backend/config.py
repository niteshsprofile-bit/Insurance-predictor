import os
from urllib.parse import urlsplit
from dotenv import load_dotenv

load_dotenv()


def normalize_supabase_url(raw_url: str) -> str:
    """Accept either the project base URL or a REST/auth endpoint and normalize to the root project URL."""
    if not raw_url:
        return raw_url

    cleaned = raw_url.strip().rstrip("/")
    for suffix in ("/rest/v1", "/auth/v1", "/storage/v1", "/realtime/v1"):
        if cleaned.endswith(suffix):
            cleaned = cleaned[: -len(suffix)]
            break
    return cleaned


# Supabase Configuration
SUPABASE_URL = normalize_supabase_url(os.getenv("SUPABASE_URL"))
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Validate that required env vars are set
if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL not set in .env file")
if not SUPABASE_KEY:
    raise ValueError("SUPABASE_KEY not set in .env file")
if not SECRET_KEY or SECRET_KEY == "your-secret-key-change-this":
    raise ValueError("SECRET_KEY not properly set in .env file")

print(f"✓ Config loaded: SUPABASE_URL={SUPABASE_URL}")
print(f"✓ JWT configured with SECRET_KEY")
