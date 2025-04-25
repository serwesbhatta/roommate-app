# # backend/app/core/config.py
# import os
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# # database
# DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:password@db/roommate_app')


# # auth
# SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")  # Use a strong, randomly generated key in production
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30


import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    # ── Database ─────────────────────────────
    DATABASE_URL: str = os.getenv("DATABASE_URL")

    # ── Auth / JWT ───────────────────────────
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── SMTP / E-mail ────────────────────────
    MAIL_SERVER: str   = os.getenv("MAIL_SERVER")
    MAIL_PORT: int     = int(os.getenv("MAIL_PORT", 465))
    MAIL_USERNAME: str = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD")
    MAIL_FROM: str     = os.getenv("MAIL_FROM", "no-reply@example.com")
    MAIL_USE_TLS: bool = os.getenv("MAIL_USE_TLS", "false").lower() == "true"  # for port 587

    # ── Misc ─────────────────────────────────
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

# Create a singleton instance
settings = Settings()