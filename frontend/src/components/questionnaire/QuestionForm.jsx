// QuestionForm.js
import React from "react";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";

const QuestionForm = ({ question, answer, onAnswerChange }) => {

  console.log("question",question)
  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: "normal", mb: 3 }}>
        {question.question_text}
      </Typography>

      {question.options.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={answer === option}
              onChange={() => onAnswerChange(question.id, option)}
            />
          }
          label={option}
          sx={{ display: "block", mb: 1 }}
        />
      ))}
    </>
  );
};

export default QuestionForm;
