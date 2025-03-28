# Database models (using SQLAlchemy or your preferred ORM)
# Represent the database table structure
# Used by SQLAlchemy to interact with the database
# Define columns, relationships, and database-specific details
# Inherit from SQLAlchemy's Base class
# Directly map to database tables
from .user_model import AuthUser, UserProfile
from .residence_hall import ResidenceHall