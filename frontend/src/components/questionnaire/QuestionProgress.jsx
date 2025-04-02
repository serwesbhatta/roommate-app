import { LinearProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const QuestionProgress = ({ current, total }) => {
  const progressPercentage = ((current + 1) / total) * 100;

  return (
    <>
      <LinearProgress
        variant="determinate"
        value={progressPercentage}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#3498DB",
          },
        }}
      />
      <Box sx={{ textAlign: "right", mt: 2 }}>
        <Typography color="primary">
          Question {current + 1}/{total}
        </Typography>
      </Box>
    </>
  );
};

export default QuestionProgress;
