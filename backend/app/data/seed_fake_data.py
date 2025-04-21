from faker import Faker
import pandas as pd
import random
from datetime import datetime, timezone
import os

fake = Faker()

# Create output directory if it doesn't exist
output_dir = os.path.join(os.path.dirname(__file__), 'csv')
os.makedirs(output_dir, exist_ok=True)


NUM_USERS = 200
NUM_FEEDBACK = 300  # Can be less or more than users

# Questions to be seeded
questions = [
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
    },
]

MAJORS = ["Computer Science", "Biology", "Psychology", "Business", "Engineering", "Education"]
GENDERS = ["Male", "Female", "Other"]

# Generate user data
users = []
auth_users = []
for i in range(1, NUM_USERS + 1):
    fname = fake.first_name()
    lname = fake.last_name()
    msu_email = f"{fname.lower()}.{lname.lower()}{i}@my.msutexas.edu"
    user = {
        "id": i,
        "user_id": i,
        "first_name": fname,
        "last_name": lname,
        "msu_email": msu_email,
        "msu_id": f"M{random.randint(10000000, 99999999)}{i}{i}{i}",
        "profile_image": "",
        "modified_profile_at": datetime.now(),
        "created_profile_at": datetime.now(),
        "age": random.randint(18, 60),
        "gender": random.choice(GENDERS),
        "bio": fake.text(max_nb_chars=200),
        "majors": random.choice(MAJORS),
        "room_number": None,
        "residence_hall_id": None
    }
    auth_user = {
        "id": i,
        "msu_email": msu_email,
        "password": fake.password(length=10),
        "role": "user",
        "created_at": datetime.now(timezone.utc),
        "is_blocked": False
    }
    users.append(user)
    auth_users.append(auth_user)

# Generate feedbacks
feedbacks = []
for i in range(1, NUM_FEEDBACK + 1):
    giver = random.randint(1, NUM_USERS)
    receiver = random.randint(1, NUM_USERS)
    while receiver == giver:
        receiver = random.randint(1, NUM_USERS)
    feedbacks.append({
        "id": i,
        "giver_user_id": giver,
        "receiver_user_id": receiver,
        "rating": random.randint(1, 5),
        "feedback_text": fake.sentence(nb_words=12),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    })

# Save to CSV
users_df = pd.DataFrame(users)
auth_df = pd.DataFrame(auth_users)
feedback_df = pd.DataFrame(feedbacks)
questions_df = pd.DataFrame([
    {
        "id": i + 1,
        "question_text": q["question_text"],
        "category": q["category"]
    } for i, q in enumerate(questions)
])
options_df = pd.DataFrame([
    {
        "id": i * 3 + j + 1,
        "question_id": i + 1,
        "option_text": option
    }
    for i, q in enumerate(questions)
    for j, option in enumerate(q["options"])
])

users_df.to_csv(os.path.join(output_dir, "user_profiles.csv"), index=False)
auth_df.to_csv(os.path.join(output_dir, "auth_users.csv"), index=False)
feedback_df.to_csv(os.path.join(output_dir, "feedback.csv"), index=False)
questions_df.to_csv(os.path.join(output_dir, "questions.csv"), index=False)
options_df.to_csv(os.path.join(output_dir, "options.csv"), index=False)

# Generate user responses
user_responses = []

for user in users:
    for question in questions_df.to_dict(orient="records"):
        question_id = question["id"]
        # Get options for this question
        matching_options = options_df[options_df["question_id"] == question_id]
        if not matching_options.empty:
            selected_option_row = matching_options.sample(1).iloc[0]
            user_responses.append({
                "user_profile_id": user["user_id"],
                "question_id": question_id,
                "selected_option": selected_option_row["option_text"]
            })

user_responses_df = pd.DataFrame(user_responses)
user_responses_df.to_csv(os.path.join(output_dir, "user_responses.csv"), index=False)

"All CSV files have been generated successfully."
