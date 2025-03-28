from sqlalchemy.orm import Session
from ..schemas.user_schema import AuthUserCreate
from ..crud.user_crud import create_user as crud_create_user
from ..crud.user_crud import authenticate_user as crud_authenticate_user
from ..crud.user_crud import delete_user_by_admin, update_auth

def create_user_service(user_data: AuthUserCreate, db: Session):
    """
    Service layer method for creating a user with additional validation and preprocessing
    """
    # Pass the database session to the CRUD layer
    return crud_create_user(user_data, db)

def authenticate_user_service(email: str, password: str, db: Session):
    """
    Service layer method for user authentication
    
    This can be left as a pass-through to the CRUD layer authentication method,
    or you can add additional validation or processing if needed.
    """
    return crud_authenticate_user(email, password, db)

def delete_user_service(id: int, db: Session):
    """
    Service layer method for deleting user
    """
    return delete_user_by_admin(id, db)

def update_auth_user_service(
    user_id: int,
    user: AuthUserCreate,
    db: Session
):
    """
    Service layer method for updating user authentication details
    """
    return update_auth(user_id, user, db)