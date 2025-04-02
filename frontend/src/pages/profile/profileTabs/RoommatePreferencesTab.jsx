import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import {PreferenceCard} from  '../../../components/profile';

// Preference data organized by category
const preferencesData = {
  livingArrangement: [
    { label: "Preferred living arrangement", value: "Pierce Hall" },
    { label: "Typical sleeping hours", value: "11 PM to 7 AM" },
    { label: "Temperature preference", value: "Cool (69-70°F)" }
  ],
  studyAcademic: [
    { label: "Academic major", value: "Computer Science" },
    { label: "Study habits", value: "In complete silence" },
    { label: "Handles stress during finals/midterms", value: "I study well in advance" }
  ],
  lifestyleHabits: [
    { label: "Cleanliness habits", value: "Extremely neat (clean daily)" },
    { label: "Food preferences/habits", value: "I cook most meals" },
    { label: "Weekend activities", value: "Studying most of the time" }
  ],
  socialPreferences: [
    { label: "Guest preferences", value: "Rarely or never" },
    { label: "Noise level preference", value: "Complete silence most of the time" },
    { label: "Item sharing preferences", value: "Prefer not to share personal items" }
  ],
  campusLife: [
    { label: "Campus activities involvement", value: "Academic Clubs" },
    { label: "Transportation", value: "I have my own car" }
  ]
};

const RoommatePreferencesTab = () => {
  const [preferencesEditMode, setPreferencesEditMode] = useState(false);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Roommate Preferences
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<EditIcon />}
          onClick={() => setPreferencesEditMode(true)}
        >
          Edit Preferences
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Living Arrangement Card */}
        <Grid item xs={12} md={6}>
          <PreferenceCard 
            title="Living Arrangement" 
            preferences={preferencesData.livingArrangement} 
          />
        </Grid>
        
        {/* Study & Academic Card */}
        <Grid item xs={12} md={6}>
          <PreferenceCard 
            title="Study & Academic" 
            preferences={preferencesData.studyAcademic} 
          />
        </Grid>
        
        {/* Lifestyle & Habits Card */}
        <Grid item xs={12} md={6}>
          <PreferenceCard 
            title="Lifestyle & Habits" 
            preferences={preferencesData.lifestyleHabits} 
          />
        </Grid>
        
        {/* Social Preferences Card */}
        <Grid item xs={12} md={6}>
          <PreferenceCard 
            title="Social Preferences" 
            preferences={preferencesData.socialPreferences} 
          />
        </Grid>
        
        {/* Campus Life Card */}
        <Grid item xs={12} md={6}>
          <PreferenceCard 
            title="Campus Life" 
            preferences={preferencesData.campusLife} 
          />
        </Grid>
      </Grid>
      
      {/* Preference Edit Dialog */}
      <Dialog 
        open={preferencesEditMode} 
        onClose={() => setPreferencesEditMode(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Roommate Preferences</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Living Arrangement
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Preferred living arrangement"
                defaultValue="Pierce Hall"
                fullWidth
                SelectProps={{
                  native: true,
                }}
              >
                <option value="Pierce Hall">Pierce Hall</option>
                <option value="Killingsworth Hall">Killingsworth Hall</option>
                <option value="Legacy Hall">Legacy Hall</option>
                <option value="Sundance Court">Sundance Court</option>
                <option value="Off-campus apartment">Off-campus apartment</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Typical sleeping hours"
                defaultValue="11 PM to 7 AM"
                fullWidth
                SelectProps={{
                  native: true,
                }}
              >
                <option value="10 PM to 6 AM">10 PM to 6 AM</option>
                <option value="11 PM to 7 AM">11 PM to 7 AM</option>
                <option value="Midnight to 8 AM">Midnight to 8 AM</option>
                <option value="1 AM to 9 AM">1 AM to 9 AM</option>
                <option value="Variable">Variable - I'm a night owl</option>
              </TextField>
            </Grid>
            {/* Add more fields as needed */}
          </Grid>
          
          {/* More preference sections would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreferencesEditMode(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => setPreferencesEditMode(false)}
          >
            Save Preferences
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoommatePreferencesTab;