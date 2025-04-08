import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";

const EventForm = ({
  open,
  onClose,
  formData,
  onChange,
  onSubmit,
  isEdit = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? "Edit Event Request" : "Request Event at MSU"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Event Title"
              fullWidth
              value={formData.title}
              onChange={onChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="description"
              label="Event Description"
              multiline
              rows={4}
              fullWidth
              value={formData.description}
              onChange={onChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="event_start"
              label="Event Start"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.event_start}
              onChange={onChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="event_end"
              label="Event End"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.event_end}
              onChange={onChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="location"
              label="Event Location"
              fullWidth
              value={formData.location}
              onChange={onChange}
              required
              helperText="Specify the exact location on MSU campus"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={
            !formData.title ||
            !formData.description ||
            !formData.event_start ||
            !formData.event_end ||
            !formData.location
          }
        >
          {isEdit ? "Update Request" : "Submit Request"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventForm;