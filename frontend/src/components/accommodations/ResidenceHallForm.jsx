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
import { Box } from "@mui/system";

const ResidenceHallForm = ({
    open,
    onClose,
    formData,
    onChange,
    onSubmit,
    isEdit = false,
  }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>
            {isEdit ? "Edit Residence Hall" : "Add Residence Hall"}
        </DialogTitle>
        <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={onChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Amenities"
                            name="amenities"
                            value={formData.amenities}
                            onChange={onChange}
                        />
                    </Grid>
                </Grid>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onSubmit} variant="contained">
                {isEdit ? "Update" : "Create"}
            </Button>
        </DialogActions>
    </Dialog>
  )
}

export default ResidenceHallForm







  