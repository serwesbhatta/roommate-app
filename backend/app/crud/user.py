from ..models.user import User
from ..database import session_factory

def create_user(first_name:str, last_name:str, msu_id:int, msu_email:str, password:str):
    try:
        session = session_factory()
        new_user = User(
            first_name=first_name, 
            last_name=last_name, 
            msu_id=msu_id, 
            msu_email=msu_email, 
            password=password
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        session.close()
        return new_user
    finally:
        session.close()

