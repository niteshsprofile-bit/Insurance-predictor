import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_KEY, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_HOURS
from typing import Optional

# Password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Lazy-load Supabase client (only when needed)
_supabase: Optional[Client] = None

def _get_supabase_client() -> Client:
    """Get or create Supabase client (lazy initialization)."""
    global _supabase
    if _supabase is None:
        print("Initializing Supabase client...")
        try:
            _supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
            print("✓ Supabase client initialized successfully")
        except Exception as e:
            print(f"✗ Failed to initialize Supabase client: {e}")
            raise
    return _supabase


def _truncate_to_72_bytes(s: str) -> str:
    """Truncate string to at most 72 bytes when encoded as UTF-8 and return a safely decoded str."""
    b = s.encode("utf-8")[:72]
    return b.decode("utf-8", errors="ignore")


def _friendly_supabase_error(error: Exception) -> str:
    """Convert raw Supabase network/database errors into a helpful user message."""
    err = str(error).lower()

    if "getaddrinfo failed" in err or "name or service not known" in err or "failed to resolve" in err:
        return (
            "Supabase project is unavailable from this machine. This usually means the Supabase URL in backend/.env is wrong, "
            "the project is not active, or your machine cannot resolve the domain. Check the project URL and API key in backend/.env. "
            "If you created a new Supabase project, copy the correct URL and anon/service-role key from the Supabase dashboard."
        )

    if "401" in err or "forbidden" in err or "row level security" in err:
        return (
            "Supabase connected, but the API key or database permissions are blocking the request. "
            "Use the correct anon/service role key and make sure your users/medical_history tables allow the required inserts."
        )

    if "does not exist" in err or "relation" in err or "table" in err:
        return (
            "Supabase is reachable, but the required database table is missing. Create the users and medical_history tables in Supabase SQL editor."
        )

    return str(error)


def hash_password(password: str) -> str:
    """Hash password using bcrypt (truncate to 72 bytes)."""
    safe_pw = _truncate_to_72_bytes(password)
    return pwd_context.hash(safe_pw)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password (truncate to 72 bytes)."""
    safe_pw = _truncate_to_72_bytes(plain_password)
    try:
        return pwd_context.verify(safe_pw, hashed_password)
    except Exception:
        return False


def create_access_token(data: dict) -> str:
    """Create a JWT access token with expiry."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return payload or None."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None


def register_user(email: str, password: str, full_name: str) -> dict:
    """Register new user in Supabase users table."""
    try:
        supabase = _get_supabase_client()
        if not email or not password or not full_name:
            return {"success": False, "message": "Email, password and full name are required"}

        # Check for existing email
        existing = supabase.table("users").select("id").eq("email", email).execute()
        if existing.data:
            return {"success": False, "message": "Email already registered"}

        hashed_pw = hash_password(password)

        response = supabase.table("users").insert({
            "email": email,
            "password_hash": hashed_pw,
            "full_name": full_name
        }).execute()

        if response.data and len(response.data) > 0:
            return {"success": True, "user_id": response.data[0].get("id"), "message": "User registered successfully"}
        return {"success": False, "message": "Failed to register user"}
    except Exception as e:
        err = str(e)
        if "duplicate" in err.lower() or "unique" in err.lower():
            return {"success": False, "message": "Email already exists"}
        return {"success": False, "message": f"Registration error: {_friendly_supabase_error(e)}"}


def login_user(email: str, password: str) -> dict:
    """Login user and return JWT token on success."""
    try:
        supabase = _get_supabase_client()
        if not email or not password:
            return {"success": False, "message": "Email and password are required"}

        response = supabase.table("users").select("*").eq("email", email).execute()
        if not response.data:
            return {"success": False, "message": "User not found"}

        user = response.data[0]
        if not verify_password(password, user.get("password_hash", "")):
            return {"success": False, "message": "Incorrect password"}

        token = create_access_token({"user_id": user.get("id"), "email": user.get("email")})
        return {"success": True, "token": token, "user_id": user.get("id"), "email": user.get("email"), "full_name": user.get("full_name")}
    except Exception as e:
        return {"success": False, "message": f"Login error: {_friendly_supabase_error(e)}"}


def save_prediction(user_id: str, prediction_data: dict, predicted_charges: float) -> dict:
    """Save prediction record to Supabase."""
    try:
        supabase = _get_supabase_client()
        record = prediction_data.copy()
        record.update({"user_id": user_id, "predicted_charges": predicted_charges})
        response = supabase.table("medical_history").insert(record).execute()
        if response.error:
            return {"success": False, "message": str(response.error)}
        return {"success": True, "message": "Prediction saved"}
    except Exception as e:
        return {"success": False, "message": f"Save error: {_friendly_supabase_error(e)}"}


def get_user_history(user_id: str) -> dict:
    """Retrieve prediction history for a user."""
    try:
        supabase = _get_supabase_client()
        response = supabase.table("medical_history").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return {"success": True, "data": response.data}
    except Exception as e:
        return {"success": False, "message": f"History error: {_friendly_supabase_error(e)}"}
