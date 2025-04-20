import pandas as pd
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user_model import AuthUser
from app.models.user_model import UserProfile
from app.models.user_response_model import UserResponse
from app.models.feedback_model import Feedback
from app.models.question_model import Question
from app.models.option_model import Option

from datetime import datetime
from pytz import utc

import os

# Get the absolute path of the directory this script is in
DATA_DIR = os.path.join(os.path.dirname(__file__), "csv")

def clear_all_tables(session: Session):
    session.query(UserResponse).delete()
    session.query(Feedback).delete()
    session.query(UserProfile).delete()
    session.query(AuthUser).delete()
    session.query(Option).delete()
    session.query(Question).delete()
    session.commit()


def load_questions(session: Session, df: pd.DataFrame):
    for _, row in df.iterrows():
        question = Question(
            id=row["id"],
            question_text=row["question_text"],
            category=row["category"]
        )
        session.add(question)
    session.commit()


def load_options(session: Session, df: pd.DataFrame):
    for _, row in df.iterrows():
        option = Option(
            id=row["id"],
            question_id=row["question_id"],
            option_text=row["option_text"]
        )
        session.add(option)
    session.commit()


def load_auth_users(session: Session, df: pd.DataFrame):
    for _, row in df.iterrows():
        user = AuthUser(
            id=row["id"],
            msu_email=row["msu_email"],
            password=row["password"],
            role=row["role"],
            created_at=datetime.now(utc),
            is_blocked=False
        )
        session.add(user)
    session.commit()


def load_user_profiles(session: Session, df: pd.DataFrame):
    for _, row in df.iterrows():
        if session.query(UserProfile).filter_by(msu_email=row["msu_email"]).first():
            continue  # skip if already exists
        profile = UserProfile(
            id=row["id"],
            user_id=row["user_id"],
            msu_email=row["msu_email"],
            first_name=row["first_name"],
            last_name=row["last_name"],
            age=row["age"],
            gender=row["gender"],
            bio=row["bio"],
            majors=row["majors"],
            created_profile_at=datetime.now(utc)
        )
        session.add(profile)
    session.commit()


def load_user_responses(session: Session, df: pd.DataFrame):
    for _, row in df.iterrows():
        response = UserResponse(
            user_profile_id=row["user_profile_id"],
            question_id=row["question_id"],
            selected_option=row["selected_option"]
        )
        session.add(response)
    session.commit()


def load_feedback(session: Session, df: pd.DataFrame):
    for _, row in df.iterrows():
        feedback = Feedback(
            giver_user_id=row["giver_user_id"],
            receiver_user_id=row["receiver_user_id"],
            feedback_text=row["feedback_text"],
            rating=row["rating"],
            created_at=datetime.now(utc)
        )
        session.add(feedback)
    session.commit()

def main():
    db: Session = SessionLocal()

    print("Cleearning existing tables")
    clear_all_tables(db)

    print("Loading CSV files...")

    auth_df = pd.read_csv(os.path.join(DATA_DIR, "auth_users.csv"))
    profile_df = pd.read_csv(os.path.join(DATA_DIR, "user_profiles.csv"))
    questions_df = pd.read_csv(os.path.join(DATA_DIR, "questions.csv"))
    options_df = pd.read_csv(os.path.join(DATA_DIR, "options.csv"))
    response_df = pd.read_csv(os.path.join(DATA_DIR, "user_responses.csv"))
    feedback_df = pd.read_csv(os.path.join(DATA_DIR, "feedback.csv"))


    print("Inserting data into database...")
    load_auth_users(db, auth_df)
    load_user_profiles(db, profile_df)
    load_questions(db, questions_df)
    load_options(db, options_df)
    load_user_responses(db, response_df)
    load_feedback(db, feedback_df)

    db.close()
    print("Done loading seed data!")


if __name__ == "__main__":
    main()
