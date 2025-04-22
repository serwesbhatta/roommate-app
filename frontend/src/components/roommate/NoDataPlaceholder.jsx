// NoDataPlaceholder.jsx - Reusable placeholder component
import React from "react";
import { Paper, Typography } from "@mui/material";

const NoDataPlaceholder = ({ message, submessage }) => (
  <Paper
    elevation={2}
    sx={{ p: 4, borderRadius: 3, textAlign: "center", mb: 4 }}
  >
    <Typography variant="body1" color="text.secondary" gutterBottom>
      {message}
    </Typography>
    {submessage && (
      <Typography variant="body1" color="text.secondary">
        {submessage}
      </Typography>
    )}
  </Paper>
);

export default NoDataPlaceholder;
