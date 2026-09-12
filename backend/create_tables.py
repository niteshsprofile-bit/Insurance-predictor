from supabase import create_client
from config import SUPABASE_URL, SUPABASE_KEY

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def create_users_table():
    """Create users table in Supabase if it doesn't exist."""
    try:
        # Check if table exists by querying it
        supabase.table("users").select("*").limit(1).execute()
        print("✅ Users table already exists")
    except:
        print("⚠️ Users table doesn't exist - creating now...")
        # Note: Supabase requires manual table creation via dashboard
        print("Please create 'users' table manually in Supabase with these columns:")
        print("""
        - id: UUID (primary key)
        - email: Text (unique)
        - password_hash: Text
        - full_name: Text
        - created_at: Timestamp (auto)
        """)

if __name__ == "__main__":
    create_users_table()
