import React from "react";
import { Box, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({placeHolder}) => {
  return (
    <Box sx={{ flex: 1, display: "flex" }}>
      <Box sx={{ width: "100%", borderRadius: "6px", backgroundColor: "#f5f5f5", paddingX: "10px", height: "40px", display: "flex", alignItems: "center" }}>
        <InputBase sx={{ flex: 1 }} placeholder={placeHolder} />
        <IconButton type="button" sx={{ borderRadius: "50%" }}>
          <SearchIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SearchBar;
