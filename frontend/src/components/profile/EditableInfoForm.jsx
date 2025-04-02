



// File: components/EditableInfoForm.jsx
import React from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

const EditableInfoForm = ({ fields, onSave }) => {
  return (
    <Grid container spacing={3}>
      {fields.map((field) => (
        <Grid item xs={field.xs || 6} key={field.id}>
          <TextField 
            label={field.label} 
            defaultValue={field.value}
            multiline={field.multiline}
            rows={field.rows || 1}
            variant="outlined" 
            size="small" 
            fullWidth
          />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<SaveIcon />}
          onClick={onSave}
        >
          Save Changes
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditableInfoForm;