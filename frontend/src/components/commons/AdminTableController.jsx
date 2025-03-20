import React from "react";
import { Box, TextField, MenuItem, Typography } from "@mui/material";
import SearchBar from "../layouts/SearchBar";
import BlueButton from "./BlueButton";

const AdminTableController = ({ onSearchChange, onCategoryChange, onStatusChange, 
  onSearchClick, categoryOptions, statusOptions, searchPlaceholder}) => {
    
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        backgroundColor: "white",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        marginBottom: "16px"
      }}
    >
      {/* Filters Section */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Question */}
        <Typography variant="body1" sx={{ fontWeight: "500" }}>
          What are you looking for?
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Search Box */}
          <SearchBar 
            placeHolder={searchPlaceholder} 
            onChange={onSearchChange} 
          />

          {/* Category Dropdown */}
          <TextField
            select
            label="Category"
            variant="outlined"
            size="small"
            sx={{ minWidth: 150 }}
            onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {categoryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Status Dropdown */}
          <TextField
            select
            label="Status"
            variant="outlined"
            size="small"
            sx={{ minWidth: 150 }}
            onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Search Button */}
          <BlueButton btuTxt={"Search"} onClick={onSearchClick} />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminTableController;