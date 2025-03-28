
# Schemas (Pydantic Models)

# Used for data validation and serialization
# Define the structure of request/response data
# Validate incoming and outgoing data
# Used for API input/output
# Provide type checking and data validation
# Do not interact directly with the database

from .user_schema import AuthUserCreate, AuthUserResponse, UserProfileCreate, UserProfileResponse