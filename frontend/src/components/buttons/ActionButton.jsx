import { Button } from "@mui/material";
import React from "react";

// Reusable button component
const ActionButton = ({ variant, onClick, disabled, children, color }) => {
  const baseStyles = {
    borderRadius: 1,
    padding: "8px 20px",
    textTransform: "none",
    fontSize: "16px",
  };

  const variantStyles =
    variant === "contained"
      ? {
          backgroundColor: color || "#3498DB",
          color: "white",
        }
      : {};

  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      sx={{ ...baseStyles, ...variantStyles }}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
