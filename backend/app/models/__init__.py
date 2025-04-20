# Database models (using SQLAlchemy or your preferred ORM)
# Represent the database table structure
# Used by SQLAlchemy to interact with the database
# Define columns, relationships, and database-specific details
# Inherit from SQLAlchemy's Base class
# Directly map to database tables
from .user_model import AuthUser, UserProfile
from .residence_hall_model import ResidenceHall
from .room_model import Room
from .feedback_model import Feedback
from .option_model import Option
from .question_model import Question
from .user_response_model import UserResponse