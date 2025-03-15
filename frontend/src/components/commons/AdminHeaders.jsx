import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import BlueButton from "./BlueButton";

const AdminHeaders = ({ title, subtitle }) => {
  return (
    <Box
      sx={{
        display: "flex",
        //flexDirection: "column",
        justifyContent: "space-between",
        height: "100px",
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle1" color="gray">
            {subtitle}
          </Typography>
        )}
      </Box>

      <BlueButton btuTxt="Add New" />
    </Box>
  );
};

export default AdminHeaders;
