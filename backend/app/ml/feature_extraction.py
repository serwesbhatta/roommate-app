import numpy as np
from typing import Dict, List, Any, Tuple


# def extract_user_features(
#     user_profile: Dict[str, Any],
#     user_responses: List[Dict[str, Any]],
#     all_questions: List[Dict[str, Any]]
# ) -> np.ndarray:
#     """
#     Extract features for a single user based on profile and question responses
    
#     Parameters:
#     - user_profile: Dictionary containing user profile data
#     - user_responses: List of dictionaries containing user's question responses
#     - all_questions: List of all questions in the system
    
#     Returns:
#     - numpy array of numerical features
#     """
#     features = []
    
#     # --- Profile Features ---
#     # Age (normalized later)
#     features.append(float(user_profile.get('age', 20)))
    
#     # Gender (one-hot encoding)
#     # 1 for Male, 0 for Female, 0.5 for Other/Non-binary
#     if user_profile.get('gender', '').lower() == 'male':
#         features.append(1.0)
#     elif user_profile.get('gender', '').lower() == 'female':
#         features.append(0.0)
#     else:
#         features.append(0.5)  # Other/Non-binary
    
#     # Major 
#     # We'll use a simple hash technique to convert string to number
#     major = user_profile.get('majors', '')
#     if major:
#         # Use hash to create a number between 0-99
#         major_hash = abs(hash(major)) % 100 / 100.0
#         features.append(major_hash)
#     else:
#         features.append(0.5)  # Default value
    
#     # Residence hall
#     hall_id = user_profile.get('residence_hall_id')
#     if hall_id is not None:
#         features.append(float(hall_id))
#     else:
#         features.append(-1.0)  # Default value for no hall
    
#     # --- Bio Features (optional) ---
#     # For simplicity, we'll just use the length of bio as a feature
#     bio = user_profile.get('bio', '')
#     features.append(min(len(bio) / 500.0, 1.0))  # Normalize by max expected length
    
#     # --- Question Responses ---
#     # Create a dictionary to map question_id to response
#     response_map = {resp['question_id']: resp['selected_option'] for resp in user_responses}
    
#     # For each question in the system, add the user's response or a default value
#     for question in all_questions:
#         question_id = question['id']
#         if question_id in response_map:
#             # Get the option text and hash it to a number
#             option_text = response_map[question_id]
#             # Convert the option to a value between 0 and 1
#             option_value = abs(hash(str(option_text))) % 1000 / 1000.0
#             features.append(option_value)
#         else:
#             # User didn't answer this question
#             features.append(-1.0)  # Special value to indicate missing
    
#     return np.array(features)


def extract_user_features(
    user_profile: Dict[str, Any],
    user_responses: List[Dict[str, Any]],
    all_questions: List[Dict[str, Any]]
) -> np.ndarray:
    """
    Extract features for a single user based on profile and question responses
    """
    features: list[float] = []

    # ── Profile features ────────────────────────────────────────────────
    # 1️⃣ Age  ── guard against None so float() never fails
    age_val = user_profile.get("age")          # may be None
    if age_val is None:
        age_val = 20                           # <-- fallback of your choice
    features.append(float(age_val))            # ← safe float()

    # 2️⃣ Gender (one-hot encoding)
    gender = (user_profile.get("gender") or "").lower()
    if gender == "male":
        features.append(1.0)
    elif gender == "female":
        features.append(0.0)
    else:
        features.append(0.5)                   # other / non-binary

    # 3️⃣ Major  (hash → 0-1)
    major = user_profile.get("majors", "")
    if major:
        major_hash = abs(hash(major)) % 100 / 100.0
        features.append(major_hash)
    else:
        features.append(0.5)

    # 4️⃣ Residence hall ID (also guard against None)
    hall_id = user_profile.get("residence_hall_id")
    features.append(float(hall_id) if hall_id is not None else -1.0)

    # 5️⃣ Bio length (0-1)
    bio = user_profile.get("bio") or ""
    features.append(min(len(bio) / 500.0, 1.0))

    # ── Question-response features ──────────────────────────────────────
    response_map = {
        resp["question_id"]: resp["selected_option"] for resp in user_responses
    }

    for q in all_questions:
        qid = q["id"]
        if qid in response_map:
            opt_val = abs(hash(str(response_map[qid]))) % 1000 / 1000.0
            features.append(opt_val)
        else:
            features.append(-1.0)              # missing answer marker

    return np.array(features)


def normalize_features(features_list: List[np.ndarray]) -> List[np.ndarray]:
    """
    Normalize features across all users to ensure fair comparison
    
    Parameters:
    - features_list: List of feature vectors for all users
    
    Returns:
    - List of normalized feature vectors
    """
    # Ensure all feature vectors have the same length
    max_length = max(len(f) for f in features_list)
    padded_features = []
    
    for features in features_list:
        # Pad with zeros if needed
        padded = np.zeros(max_length)
        padded[:len(features)] = features
        padded_features.append(padded)
    
    # Convert to numpy array for easier processing
    feature_array = np.array(padded_features)
    
    # Calculate mean and std for each feature (column)
    means = np.mean(feature_array, axis=0)
    stds = np.std(feature_array, axis=0)
    
    # Replace zero stds with 1 to avoid division by zero
    stds[stds == 0] = 1.0
    
    # Normalize features (z-score normalization)
    normalized_features = []
    for features in padded_features:
        normalized = (features - means) / stds
        normalized_features.append(normalized)
    
    return normalized_features


def extract_features_for_all_users(
    user_profiles: List[Dict[str, Any]],
    all_responses: List[Dict[str, Any]],
    all_questions: List[Dict[str, Any]]
) -> Tuple[Dict[int, np.ndarray], List[int]]:
    """
    Extract and normalize features for all users
    
    Parameters:
    - user_profiles: List of user profile dictionaries
    - all_responses: List of all question responses
    - all_questions: List of all questions
    
    Returns:
    - Dictionary mapping user_id to normalized feature vector
    - List of user IDs in the same order as the feature vectors
    """
    # Group responses by user_id
    responses_by_user = {}
    for response in all_responses:
        user_id = response['user_profile_id']
        if user_id not in responses_by_user:
            responses_by_user[user_id] = []
        responses_by_user[user_id].append(response)
    
    # Extract features for each user
    features_list = []
    user_ids = []
    
    for profile in user_profiles:
        user_id = profile['user_id']
        user_responses = responses_by_user.get(user_id, [])
        
        features = extract_user_features(profile, user_responses, all_questions)
        features_list.append(features)
        user_ids.append(user_id)
    
    # Normalize features
    normalized_features = normalize_features(features_list)
    
    # Create dictionary mapping user_id to features
    user_features = {user_ids[i]: normalized_features[i] for i in range(len(user_ids))}
    
    return user_features, user_ids