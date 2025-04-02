import { Checkbox, FormControlLabel, MenuItem, Select, Typography } from '@mui/material';
import  {HighlightText}  from '../others';

// Question component
const QuestionForm = ({ question, answer, onAnswerChange, onSelectChange, selectedMajor }) => {
    if (question.id === 1) {
      // Major question with checkboxes
      return (
        <>
          <Typography variant="h5" sx={{ fontWeight: 'normal', mb: 3 }}>
            What is your <HighlightText>major</HighlightText>?
          </Typography>
          
          {question.options.slice(0, 4).map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox 
                  checked={answer === option}
                  onChange={() => onAnswerChange(question.id, option)}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                />
              }
              label={option}
              sx={{ display: 'block', mb: 1 }}
            />
          ))}
          
          <Select
            value={selectedMajor === 'Other' ? 'Other' : selectedMajor}
            onChange={onSelectChange}
            displayEmpty
            fullWidth
            sx={{ mt: 1, mb: 3 }}
            renderValue={(selected) => selected || <em>Other</em>}
          >
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </>
      );
    }
    
    // Standard question with checkboxes
    return (
      <>
        <Typography variant="h5" sx={{ fontWeight: 'normal', mb: 3 }}>
          {question.text}
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
            sx={{ display: 'block', mb: 1 }}
          />
        ))}
      </>
    );
  };
  

export default QuestionForm