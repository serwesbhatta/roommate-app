# backend/app/services/__init__.py

# The services layer in a FastAPI/Python application serves as an intermediate layer 
# between your routes (API endpoints) and your data access layer (CRUD operations). 
# It's responsible for implementing business logic, complex operations, and orchestrating 
# interactions between different components of your application.

from .auth_services import (
    create_user_service,
    authenticate_user_service,
    delete_user_by_admin_service,
    update_auth_user_service,
    update_student_password_service,
    get_all_auth_users_service,
    get_total_auth_users_service,
    get_new_users_service
)
from .user_services import (
    get_user_profile_service,
    update_user_profile_service,
    get_all_user_profiles_service,
    get_total_user_profiles_service
)

