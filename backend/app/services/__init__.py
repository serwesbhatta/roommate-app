# backend/app/services/__init__.py

# The services layer in a FastAPI/Python application serves as an intermediate layer 
# between your routes (API endpoints) and your data access layer (CRUD operations). 
# It's responsible for implementing business logic, complex operations, and orchestrating 
# interactions between different components of your application.

from .user_services import create_user_service, authenticate_user_service, delete_user_service, update_auth_user_service