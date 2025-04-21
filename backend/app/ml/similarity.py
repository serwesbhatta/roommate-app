# app/ml/similarity.py

import numpy as np
from typing import Dict, List, Tuple, Any
from sklearn.metrics.pairwise import cosine_similarity


def calculate_similarity_matrix(user_features: Dict[int, np.ndarray], user_ids: List[int]) -> Dict[int, Dict[int, float]]:
    """
    Calculate similarity matrix between all users
    
    Parameters:
    - user_features: Dictionary mapping user_id to feature vector
    - user_ids: List of user IDs
    
    Returns:
    - Dictionary mapping each user_id to a dictionary of {other_user_id: similarity_score}
    """
    # Create feature matrix
    feature_matrix = np.array([user_features[uid] for uid in user_ids])
    
    # Calculate cosine similarity
    similarity_matrix = cosine_similarity(feature_matrix)
    
    # Convert to dictionary format
    similarity_dict = {}
    for i, user_id in enumerate(user_ids):
        similarity_dict[user_id] = {
            user_ids[j]: (similarity_matrix[i, j] + 1) / 2  # Normalize from [-1,1] to [0,1]
            for j in range(len(user_ids)) if i != j  # Exclude self
        }
    
    return similarity_dict


def calculate_compatibility_score(
    user1_id: int,
    user2_id: int,
    user_features: Dict[int, np.ndarray]
) -> float:
    """
    Calculate compatibility score between two users
    
    Parameters:
    - user1_id: ID of first user
    - user2_id: ID of second user
    - user_features: Dictionary mapping user_id to feature vector
    
    Returns:
    - Compatibility score (0-5 scale)
    """
    # Get feature vectors for both users
    if user1_id not in user_features or user2_id not in user_features:
        return 0.0  # No data for one or both users
    
    user1_features = user_features[user1_id]
    user2_features = user_features[user2_id]
    
    # Calculate cosine similarity
    similarity = cosine_similarity([user1_features], [user2_features])[0][0]
    
    # Convert from [-1,1] to [0,5] scale
    compatibility_score = (similarity + 1) / 2 * 100
    
    return compatibility_score


def get_top_matches(
    user_id: int,
    similarity_dict: Dict[int, Dict[int, float]],
    n: int = 10
) -> List[Tuple[int, float]]:
    """
    Get top N compatible users for a given user
    
    Parameters:
    - user_id: ID of the user to find matches for
    - similarity_dict: Dictionary of user similarities
    - n: Number of matches to return
    
    Returns:
    - List of tuples (user_id, compatibility_score) sorted by score
    """
    if user_id not in similarity_dict:
        return []
    
    # Get similarities for this user
    user_similarities = similarity_dict[user_id]
    
    # Sort by similarity score (descending)
    sorted_matches = sorted(
        user_similarities.items(),
        key=lambda x: x[1],
        reverse=True
    )
    
    # Convert similarity (0-1) to compatibility score (0-5)
    return [(uid, score * 100) for uid, score in sorted_matches[:n]]