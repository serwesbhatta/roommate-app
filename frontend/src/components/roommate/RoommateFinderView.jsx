// RoommateFinderView.jsx - Component for finding new roommates
import React from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import  RoommateFinderSrcBar  from "../others/RoommateFinderSrcBar";
import { ProfileCardGrid } from "../matchProfile";
import NoDataPlaceholder from "./NoDataPlaceholder";

const RoommateFinderView = ({
  onBackClick,
  onSearch,
  searchParams,
  showMatches,
  matchedRoommates,
  onLoadMore,
}) => (
  <Box>
    <Box display="flex" alignItems="center" mb={3}>
      <IconButton onClick={onBackClick} sx={{ mr: 2 }}>
        <ArrowBackIcon fontSize="large" />
      </IconButton>
      <Typography variant="h5" fontWeight="700">
        Find a New Roommate
      </Typography>
    </Box>

    <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
      <RoommateFinderSrcBar onSearch={onSearch} />
    </Paper>

    {showMatches && (
      <Box mb={3}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {searchParams.major && (
            <Chip
              label={`Major: ${searchParams.major}`}
              size="small"
              color="secondary"
            />
          )}
          {searchParams.gender && (
            <Chip
              label={`Gender: ${searchParams.gender}`}
              size="small"
              color="secondary"
            />
          )}
          {searchParams.graduationYear && (
            <Chip
              label={`Class of: ${searchParams.graduationYear}`}
              size="small"
              color="secondary"
            />
          )}
        </Box>
      </Box>
    )}

    {showMatches && (
      <Box mt={4}>
        {matchedRoommates.length > 0 ? (
          <>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Matches Based on Your Preferences
            </Typography>
            <ProfileCardGrid
              profiles={matchedRoommates}
              onLoadMore={onLoadMore}
            />
          </>
        ) : (
          <NoDataPlaceholder message="No matches found for your search criteria. Try adjusting your filters." />
        )}
      </Box>
    )}

    <Box display="flex" justifyContent="center" mt={4}>
      <Button
        variant="outlined"
        onClick={onBackClick}
        sx={{ textTransform: "none", px: 4 }}
      >
        Back to Roommates
      </Button>
    </Box>
  </Box>
);

export default RoommateFinderView;
