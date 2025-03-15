import React from "react";
import { Box, TextField, MenuItem, Button, Typography } from "@mui/material";
import SearchBar from "../layouts/SearchBar";
import BlueButton from "./BlueButton";

const AdminTableController = ({ title }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        backgroundColor: "white",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      {/* Page Title */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {title}
      </Typography>

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
          <SearchBar placeHolder="Search name, email.." />

          {/* Category Dropdown */}
          <TextField
            select
            label="Category"
            variant="outlined"
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="users">Users</MenuItem>
            <MenuItem value="rooms">Rooms</MenuItem>
            <MenuItem value="events">Events</MenuItem>
          </TextField>

          {/* Status Dropdown */}
          <TextField
            select
            label="Status"
            variant="outlined"
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </TextField>

          {/* Search Button */}
          <BlueButton btuTxt={"Search"} />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminTableController;
