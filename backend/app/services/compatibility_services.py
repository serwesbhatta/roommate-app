from typing import List, Dict, Any, Tuple
import numpy as np
from sqlalchemy.orm import Session
from app.ml.feature_extraction import extract_features_for_all_users, extract_user_features
from app.ml.similarity import calculate_compatibility_score, get_top_matches, calculate_similarity_matrix

# Import your database models
from app.models import UserProfile, Question, UserResponse

class MatchingService:
    def __init__(self, db):
        self.db = db

    def get_user_profiles_from_db(self) -> List[Dict[str, Any]]:
        """Get all user profiles from the database"""
        profiles = self.db.query(UserProfile).all()
        return [
            {
                'user_id': profile.user_id,
                'age': profile.age,
                'gender': profile.gender,
                'majors': profile.majors,
                'bio': profile.bio,
                'residence_hall_id': profile.residence_hall_id
            }
            for profile in profiles
        ]


    def get_user_responses_from_db(self) -> List[Dict[str, Any]]:
        """Get all user responses from the database"""
        responses = self.db.query(UserResponse).all()
        return [
            {
                'user_profile_id': response.user_profile_id,
                'question_id': response.question_id,
                'selected_option': response.selected_option
            }
            for response in responses
        ]


    def get_questions_from_db(self) -> List[Dict[str, Any]]:
        """Get all questions from the database"""
        questions = self.db.query(Question).all()
        return [
            {
                'id': question.id,
                'question_text': question.question_text,
                'category': question.category
            }
            for question in questions
        ]


    def get_user_feature_vectors(self) -> Dict[int, np.ndarray]:
        """
        Extract feature vectors for all users in the database
        
        Returns:
        - Dictionary mapping user_id to feature vector
        """
        # Get data from database
        user_profiles = self.get_user_profiles_from_db()
        user_responses = self.get_user_responses_from_db()
        questions = self.get_questions_from_db()
        
        # Extract features
        user_features, _ = extract_features_for_all_users(user_profiles, user_responses, questions)
        
        return user_features


    def get_compatibility_between_users(
        self,
        user1_id: int,
        user2_id: int
    ) -> float:
        """
        Calculate compatibility score between two users
        
        Parameters:
        - db: Database session
        - user1_id: ID of first user
        - user2_id: ID of second user
        
        Returns:
        - Compatibility score (0-100)
        """
        # Get user feature vectors
        user_features = self.get_user_feature_vectors()
        
        # Calculate compatibility score
        score = calculate_compatibility_score(user1_id, user2_id, user_features)
        
        return score


    def get_top_compatible_users(
        self,
        user_id: int,
        n: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Get top N compatible users for a given user
        
        Parameters:
        - db: Database session
        - user_id: ID of the user to find matches for
        - n: Number of matches to return
        
        Returns:
        - List of user IDs and compatibility scores
        """
        # Get data from database
        user_profiles = self.get_user_profiles_from_db()
        user_responses = self.get_user_responses_from_db()
        questions = self.get_questions_from_db()
        
        # Extract features for all users
        user_features, user_ids = extract_features_for_all_users(user_profiles, user_responses, questions)
        
        # Calculate similarity matrix
        similarity_dict = calculate_similarity_matrix(user_features, user_ids)
        
        # Get top matches
        top_matches = get_top_matches(user_id, similarity_dict, n)
        
        # Format results
        results = [
            {
                'user_id': match_id,
                'compatibility_score': round(score, 2)
            }
            for match_id, score in top_matches
        ]
        
        return results