import React from "react";
import { Box, TextField, MenuItem, Typography, Button } from "@mui/material";
import SearchBar from "../others/SearchBar";

const AdminTableController = ({
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onSearchClick,
  categoryOptions,
  statusOptions,
  searchPlaceholder,
  searchTerm,
<<<<<<< HEAD
  onAddClick,
=======
>>>>>>> d315eb7 (Event integration.)
})=> {
    
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
            value={searchTerm}
            onSearchClick={onSearchClick}
          />

          {/* Category Dropdown */}
          {categoryOptions.length !== 0 && (
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
          )}


          {/* Status Dropdown */}
          {statusOptions.length !== 0 && (
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
          )}
<<<<<<< HEAD

          <Button variant="contained" color="primary" onClick={onAddClick}>
            Add New Record
          </Button>
=======
>>>>>>> d315eb7 (Event integration.)
        </Box>
      </Box>
    </Box>
  );
};

export default AdminTableController;