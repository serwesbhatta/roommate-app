import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { PreferenceCard } from '../../../components/profile';

const RoommatePreferencesTab = ({ questions, userResponses, onUpdatePreferences }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedResponses, setEditedResponses] = useState({});

  // Group questions by category
  const groupedQuestions = questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  useEffect(() => {
    setEditedResponses(userResponses); // preload with current answers
  }, [userResponses]);

  const handleResponseChange = (questionId, selectedOption) => {
    setEditedResponses(prev => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    const editedResponsesArray = Object.entries(editedResponses).map(([questionId, selectedOption]) => ({
      question_id: parseInt(questionId),
      selected_option: selectedOption,
    }));
    
    const result = await onUpdatePreferences(editedResponsesArray);
    
    if (result.success) {
      setEditMode(false);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Roommate Preferences</Typography>
        <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditMode(true)}>
          Edit Preferences
        </Button>
      </Box>

      <Grid container spacing={3}>
        {Object.entries(groupedQuestions).map(([category, prefs]) => (
          <Grid item xs={12} md={6} key={category}>
            <PreferenceCard
              title={category}
              preferences={prefs.map(q => ({
                label: q.question_text,
                value: userResponses[q.id] || 'Not answered',
              }))}
            />
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editMode} onClose={() => setEditMode(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Roommate Preferences</DialogTitle>
        <DialogContent dividers>
          {Object.entries(groupedQuestions).map(([category, prefs]) => (
            <Box key={category} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>{category}</Typography>
              <Grid container spacing={2}>
                {prefs.map((q) => (
                  <Grid item xs={12} sm={6} key={q.id}>
                    <TextField
                      select
                      label={q.question_text}
                      value={editedResponses[q.id] || ''}
                      onChange={(e) => handleResponseChange(q.id, e.target.value)}
                      fullWidth
                      SelectProps={{ native: true }}
                    >
                      <option value="" disabled></option>
                      {q.options.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </TextField>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMode(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Save Preferences</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoommatePreferencesTab;