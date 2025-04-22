// UserHome.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@mui/material";
import { MatchesPage } from "../../components/matchProfile";
import { QuestionnairePage } from "../../components/questionnaire";
import {
  getQuestionOptionsList,
  getUserResponses,
  postUserResponses,
} from "../../redux/slices/questionnaireSlice";

const UserHome = () => {
  const dispatch = useDispatch();
  const { questions, fetchStatus, userResponses } = useSelector(
    (state) => state.questionnaire
  );
  const { id } = useSelector((state) => state.auth);

  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const submitted = Object.keys(userResponses).length > 0;
  const [selectedMajor, setSelectedMajor] = useState("");

  useEffect(() => {
    if (fetchStatus === "idle") {
      dispatch(getQuestionOptionsList({ skip: 0, limit: 100 }));
    }
  }, [dispatch, fetchStatus]);


  useEffect(() => {
    dispatch(getUserResponses(id));
  }, [dispatch, id]);
  

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
  
    dispatch(
      postUserResponses({
        userProfileId,
        responses: { responses: formattedResponses },
      })
    )
      .unwrap()
      .then(() => {
        dispatch(getUserResponses(userProfileId));
      })
      .catch((err) => {
        console.error("Submit failed", err);
      });
  };
  

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(Math.max(0, step - 1));
  };

  const isLoading = fetchStatus !== "succeeded";
  const currentQuestion = questions[step];

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {!submitted ? (
        !isLoading && (
          <QuestionnairePage
            questions={questions}
            currentStep={step}
            answers={answers}
            selectedMajor={selectedMajor}
            onAnswerChange={handleCheckboxChange}
            onSelectChange={handleSelectChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
          />
        )
      ) : (
        <MatchesPage profiles={[]} /> // Replace with matched profiles logic if available
      )}
    </Container>
  );
};

export default UserHome;
