import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";

const RoomForm = ({
  open,
  onClose,
  formData,
  onChange,
  onSubmit,
  actionType, // "add", "edit", "allocate", or "vacate"
  residenceHallOptions, // for the residence hall dropdown
  formError, // error message to display
}) => {
  const getTitle = () => {
    switch (actionType) {
      case "add":
        return "Add New Room";
      case "edit":
        return "Edit Room";
      case "allocate":
        return "Allocate Students";
      case "vacate":
        return "Vacate Room";
      default:
        return "Room Operation";
    }
  };

  // For allocate/vacate, we now expect formData.student_ids to be an array.
  const isFormValid = () => {
    if (actionType === "add" || actionType === "edit") {
      return (
        formData.room_number &&
        formData.room_type &&
        formData.capacity &&
        formData.price &&
        formData.lease_end &&
        formData.residence_hall_id &&
        formData.room_status
      );
    } else if (actionType === "allocate" || actionType === "vacate") {
      // Validate that student_ids is a non-empty string
      return (
        (typeof formData.student_ids === "string" && formData.student_ids.trim().length > 0) ||
        (Array.isArray(formData.student_ids) && formData.student_ids.length > 0)
      );
    }
    return false;
  };
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {(actionType === "add" || actionType === "edit") && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Room Number"
                  name="room_number"
                  value={formData.room_number || ""}
                  onChange={onChange}
                  disabled={actionType === "edit"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Room Type"
                  name="room_type"
                  value={formData.room_type || ""}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity || ""}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Lease End Date"
                  name="lease_end"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.lease_end || ""}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                {residenceHallOptions ? (
                  <TextField
                    select
                    fullWidth
                    label="Residence Hall"
                    name="residence_hall_id"
                    value={formData.residence_hall_id || ""}
                    onChange={onChange}
                  >
                    {residenceHallOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    fullWidth
                    label="Residence Hall ID"
                    name="residence_hall_id"
                    type="number"
                    value={formData.residence_hall_id || ""}
                    onChange={onChange}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Room Status"
                  name="room_status"
                  value={formData.room_status || ""}
                  onChange={onChange}
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="partially_occupied">Partially Occupied</MenuItem>
                  <MenuItem value="full">Full</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                </TextField>
              </Grid>
            </>
          )}
          {(actionType === "allocate" || actionType === "vacate") && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Student IDs (comma separated)"
                name="student_ids"
                value={formData.student_ids || ""}
                onChange={onChange}
              />
            </Grid>
          )}
        </Grid>
        {formError && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {formError}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" disabled={!isFormValid()}>
          {actionType === "add"
            ? "Add"
            : actionType === "edit"
            ? "Update"
            : actionType === "allocate"
            ? "Allocate"
            : actionType === "vacate"
            ? "Vacate"
            : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoomForm;
