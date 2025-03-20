import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import BlueButton from "./BlueButton";
import { useNavigate } from "react-router-dom";

const AdminHeaders = ({ title, subtitle, onAddClick }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
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
      {(title === "Users" || title == "Rooms") &&
        <BlueButton btuTxt="Add New" onClicked= {onAddClick} />
      }
    </Box>
  );
};

export default AdminHeaders;
