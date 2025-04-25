import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box, CircularProgress } from "@mui/material";
import MatchesPage from "../../components/matchProfile/MatchesPage";
import QuestionnairePage from "../../components/questionnaire/QuestionnairePage";
import {
  getQuestionOptionsList,
  getUserResponses,
  postUserResponses,
} from "../../redux/slices/questionnaireSlice";
import { fetchTopMatches } from "../../redux/slices/compatibilitySlice";
import { getImageUrl } from "../../utils/imageURL";
import { useNavigate } from "react-router-dom";

const UserHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { questions, fetchStatus, userResponses } = useSelector(
    (state) => state.questionnaire
  );
  const { topMatches, loading: matchesLoading, error: matchesError } = useSelector(
    (state) => state.compatibility
  );
  const { id } = useSelector((state) => state.auth);

  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMoreMatches, setHasMoreMatches] = useState(true);
  const [selectedMajor, setSelectedMajor] = useState("");
  
  const limit = 9; // Number of matches per page
  const submitted = Object.keys(userResponses).length > 0;

  // Fetch questions when component mounts
  useEffect(() => {
    if (fetchStatus === "idle") {
      dispatch(getQuestionOptionsList({ skip: 0, limit: 100 }));
    }
  }, [dispatch, fetchStatus]);

  // Fetch user's existing responses if any
  useEffect(() => {
    if (id) {
      dispatch(getUserResponses(id));
    }
  }, [dispatch, id]);

  // Pre-load matches after responses are detected
  useEffect(() => {
    if (submitted && id) {
      loadMatches(0);
    }
  }, [dispatch, submitted, id]);

  const loadMatches = (pageNum) => {
    const skip = pageNum * limit;
    
    dispatch(fetchTopMatches({ 
      userId: id, 
      skip: skip, 
      limit 
    }))
    .unwrap()
    .then(result => {
      // If we received fewer items than the limit or none at all,
      // we've reached the end of available matches
      if (!result || result.length < limit) {
        setHasMoreMatches(false);
      } else {
        setHasMoreMatches(true);
      }
    })
    .catch(error => {
      console.error("Error fetching matches:", error);
      setHasMoreMatches(false);
    });
  };

  const handleCheckboxChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSelectChange = (event) => {
    setSelectedMajor(event.target.value);
    setAnswers({ ...answers, 1: event.target.value });
  };

  const handleSubmit = () => {
    const userProfileId = id;
    const formattedResponses = Object.entries(answers).map(
      ([questionId, selectedOption]) => ({
        question_id: parseInt(questionId),
        selected_option: selectedOption,
      })
    );
    
    setIsSubmitting(true);
    
    dispatch(
      postUserResponses({
        userProfileId,
        responses: { responses: formattedResponses },
      })
    )
      .unwrap()
      .then(() => {
        dispatch(getUserResponses(userProfileId))
          .unwrap()
          .then(() => {
            // Once responses are saved, fetch matches
            loadMatches(0);
            setIsSubmitting(false);
          });
      })
      .catch((err) => {
        console.error("Submit failed", err);
        setIsSubmitting(false);
      });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(Math.max(0, step - 1));
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadMatches(nextPage);
  };
  
  const handlePrevPage = () => {
    if (page > 0) {
      const prevPage = page - 1;
      setPage(prevPage);
      loadMatches(prevPage);
      
      // When going back, we know there are more matches ahead
      setHasMoreMatches(true);
    }
  };
  
  const handleViewProfile = (profileId) => {
    console.log("Viewing profile:", profileId);
    navigate(`/user/view-profile/${profileId}`)
  };

  const isLoading = fetchStatus !== "succeeded";
  const currentQuestion = questions[step];

  // Format matches data for the presentational component
  const formattedMatches = topMatches.map(match => ({
    id: match.user_id,
    name: `${match.profile.first_name || ""} ${match.profile.last_name || ""}`.trim() || "MSU Student",
    match: `${Math.round(match.compatibility_score)}%`,
    image: match.profile.profile_image,
    profile: match.profile // Pass the full profile object for additional details
  }));

  if (isLoading && !submitted) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      {isSubmitting ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : !submitted ? (
        <QuestionnairePage 
          currentQuestion={currentQuestion}
          step={step}
          totalSteps={questions.length}
          answers={answers}
          selectedMajor={selectedMajor}
          onCheckboxChange={handleCheckboxChange}
          onSelectChange={handleSelectChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
        />
      ) : (
        <MatchesPage 
          matches={formattedMatches}
          loading={matchesLoading}
          error={matchesError}
          page={page}
          hasMoreMatches={hasMoreMatches}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onViewProfile={handleViewProfile}
          getImageUrl={getImageUrl}
        />
      )}
    </Container>
  );
};

export default UserHome;