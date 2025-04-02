import React, { useState } from 'react';
import { Container } from '@mui/material';
import { MatchesPage} from '../../components/matchProfile';
import { QuestionnairePage } from '../../components/questionnaire';



// Separate data module
const questionsData = [
  { id: 1, text: 'What is your major?', options: ['Computer Science', 'Business Administration', 'Nursing', 'Radiology', 'Other'] },
  { id: 2, text: 'What is your preferred study time?', options: ['Morning', 'Afternoon', 'Evening', 'Night'] },
  { id: 3, text: 'Do you smoke?', options: ['Yes', 'No'] },
  { id: 4, text: 'Do you prefer a quiet environment?', options: ['Yes', 'No', 'Sometimes'] },
  { id: 5, text: 'How often do you clean your room?', options: ['Daily', 'Weekly', 'Monthly', 'Rarely'] },
  { id: 6, text: 'What are your sleeping habits?', options: ['Early sleeper', 'Night owl', 'Flexible'] },
  { id: 7, text: 'Do you like pets?', options: ['Yes', 'No', 'Depends on the pet'] },
  { id: 8, text: 'Are you comfortable with guests?', options: ['Yes', 'No', 'Occasionally'] },
  { id: 9, text: 'What is your favorite leisure activity?', options: ['Gaming', 'Reading', 'Sports', 'Watching Movies'] },
];

const studentProfilesData = [
  { id: 1, name: 'John Doe', match: 80 },
  { id: 2, name: 'Jane Smith', match: 75 },
  { id: 3, name: 'Michael Lee', match: 85 },
  { id: 4, name: 'Emily Davis', match: 78 },
  { id: 6, name: 'Sarah Wilson', match: 76 },
  { id: 5, name: 'Robert Johnson', match: 82 },
];

// Main app container
const UserHome = () => {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState('');

  const handleCheckboxChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSelectChange = (event) => {
    setSelectedMajor(event.target.value);
    setAnswers({ ...answers, 1: event.target.value });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(Math.max(0, step - 1));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {!submitted ? (
        <QuestionnairePage 
          questions={questionsData}
          currentStep={step}
          answers={answers}
          selectedMajor={selectedMajor}
          onAnswerChange={handleCheckboxChange}
          onSelectChange={handleSelectChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
        />
      ) : (
        <MatchesPage profiles={studentProfilesData} />
      )}
    </Container>
  );
};




export default UserHome;