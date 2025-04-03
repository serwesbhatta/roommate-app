import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react'
import QuestionProgress from './QuestionProgress';
import { ActionButton } from '../buttons';
import HighlightText from '../others/HighlightText';
import QuestionForm from './QuestionForm';

const QuestionnairePage = ({ 
    questions, 
    currentStep, 
    answers, 
    selectedMajor,
    onAnswerChange, 
    onSelectChange, 
    onNext, 
    onPrevious, 
    onSubmit 
  }) => {
    const currentQuestion = questions[currentStep];
    
    return (
      <>
        <Box sx={{ mb: 4, textAlign: 'left' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'normal', mb: 1 }}>
            Set up your account to find the <HighlightText>perfect roommate.</HighlightText>
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Hello! Fill in the details to complete sign up.
          </Typography>
          <QuestionProgress current={currentStep} total={questions.length} />
        </Box>
  
        <Card elevation={2} sx={{ borderRadius: 2, p: 2 }}>
          <CardContent>
            <QuestionForm 
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onAnswerChange={onAnswerChange}
              onSelectChange={onSelectChange}
              selectedMajor={selectedMajor}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <ActionButton 
                variant="outlined" 
                onClick={onPrevious}
                disabled={currentStep === 0}
              >
                Previous
              </ActionButton>
              
              {currentStep < questions.length - 1 ? (
                <ActionButton 
                  variant="contained" 
                  onClick={onNext}
                >
                  Next
                </ActionButton>
              ) : (
                <ActionButton 
                  variant="contained" 
                  onClick={onSubmit}
                  color="#2ECC71"
                >
                  Submit
                </ActionButton>
              )}
            </Box>
          </CardContent>
        </Card>
      </>
    );
  };
  

export default QuestionnairePage