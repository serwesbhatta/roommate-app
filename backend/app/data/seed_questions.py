# seed_questions.py
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.question_model import Question
from app.models.option_model import Option

# List of questions and options
questions_data = [
    {
        "question_text": "What time do you usually go to bed?",
        "category": "lifestyle",
        "options": ["Before 10 PM", "10–12 PM", "After midnight"]
    },
    {
        "question_text": "How clean do you keep your living space?",
        "category": "habits",
        "options": ["Very clean", "Moderate", "Messy"]
    },
    {
        "question_text": "Do you prefer quiet or noise while studying?",
        "category": "study",
        "options": ["Quiet", "Some noise", "Doesn’t matter"]
    },
    {
        "question_text": "Are you a morning or night person?",
        "category": "personality",
        "options": ["Morning", "Night", "Depends"]
    },
    {
        "question_text": "How often do you invite guests?",
        "category": "social",
        "options": ["Rarely", "Occasionally", "Frequently"]
    },
    {
        "question_text": "How do you feel about sharing food?",
        "category": "social",
        "options": ["Fine with it", "Depends", "Prefer not to"]
    },
    {
        "question_text": "Do you like to listen to music out loud?",
        "category": "habits",
        "options": ["Often", "Sometimes", "Never"]
    },
    {
        "question_text": "What’s your ideal room temperature?",
        "category": "preferences",
        "options": ["Cold", "Mild", "Warm"]
    }
]

def seed_questions(db: Session):
    for q in questions_data:
        question = Question(question_text=q["question_text"], category=q["category"])
        db.add(question)
        db.flush()  # to get question.id before adding options

        for opt in q["options"]:
            db.add(Option(option_text=opt, question_id=question.id))

    db.commit()

def main():
    db = SessionLocal()
    seed_questions(db)
    db.close()
    print("Questions and options seeded successfully!")

if __name__ == "__main__":
    main()