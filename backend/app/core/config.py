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
    # Database Configuration
    DATABASE_URL: str = os.getenv('DATABASE_URL')
    
    # Authentication Configuration
    SECRET_KEY: str = os.getenv('SECRET_KEY')
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Additional configurable settings
    DEBUG: bool = os.getenv('DEBUG', 'False').lower() == 'true'

# Create a singleton instance
settings = Settings()