// File: components/EditableInfoForm.jsx
import React from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

const EditableInfoForm = ({
  fields,
  onFieldChange,    // <-- accept this prop
  onSave,           // your handler that expects an object of updated fields
  onCancel          // accept cancel so we can wire up a Cancel button
}) => {
  // build a payload object to pass back on save
  const handleSaveClick = () => {
    const updated = fields.reduce(
      (acc, { id, value }) => ({ ...acc, [id]: value }),
      {}
    );
    onSave(updated);
  };

  return (
    <Grid container spacing={3}>
      {fields.map(field => (
        <Grid item xs={field.xs || 6} key={field.id}>
          <TextField
            id={field.id}
            label={field.label}
            type={field.type || 'text'}
            value={field.value}
            onChange={e => onFieldChange(field.id, e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            required={field.required}
            multiline={field.multiline}
            rows={field.rows || 1}
            disabled={field.disabled}
            slotProps={{
              inputLabel: field.type === 'date' ? { shrink: true } : {}
            }}
            error={Boolean(field.errTxt)}
            helperText={field.errTxt}
          />
        </Grid>
      ))}

      <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveClick}
        >
          Save Changes
        </Button>

        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditableInfoForm;
