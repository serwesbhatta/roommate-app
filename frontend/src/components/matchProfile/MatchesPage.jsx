import React from "react";
import { Box, Typography, Button, CircularProgress, IconButton, Grid } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ProfileCard from "./ProfileCard";

const MatchesPage = ({ 
  matches = [],
  loading = false,
  error = null,
  page = 0,
  hasMoreMatches = true,
  onNextPage = () => {},
  onPrevPage = () => {},
  onViewProfile = () => {},
  getImageUrl = (url) => url, // Default pass-through function
}) => {
  
  if (loading && matches.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography color="error" variant="h6">
          Error loading matches: {error}
        </Typography>
      </Box>
    );
  }
  
  if (matches.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {page > 0 ? "No more matches" : "No matches found"}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {page > 0 
            ? "You've seen all available matches. Check back later for new potential matches."
            : "We couldn't find any compatible matches for you at this time. Check back later or adjust your preferences."
          }
        </Typography>
        
        {page > 0 && (
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<ArrowBackIosNewIcon />}
            onClick={onPrevPage}
          >
            Go Back
          </Button>
        )}
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        mb: 3, 
        mt: 5
      }}>
        <Typography variant="h5">
          Your Top Matches
        </Typography>
        
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            Page {page + 1}
          </Typography>
          
          <IconButton 
            disabled={page === 0} 
            onClick={onPrevPage}
            sx={{ 
              mr: 1,
              backgroundColor: page === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)'
              }
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          
          <IconButton 
            disabled={loading || !hasMoreMatches} 
            onClick={onNextPage}
            sx={{ 
              backgroundColor: loading || !hasMoreMatches ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
              '&:hover': {
                backgroundColor: loading || !hasMoreMatches ? 'transparent' : 'rgba(0, 0, 0, 0.08)'
              }
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      {/* Scrollable container with fixed height */}
      <Box 
        sx={{ 
          height: "calc(100vh - 200px)", // Fixed height (viewport height minus space for header/navigation)
          overflowY: "auto", // Enable vertical scrolling
          pr: 1, // Add a bit of padding on the right to accommodate scrollbar
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: "10px"
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.3)"
            }
          }
        }}
      >
        <Grid container spacing={3}>
          {matches.map((match) => (
            <Grid item xs={12} sm={6} md={4} key={match.id || match.user_id}>
              <ProfileCard 
                profile={match}
                onViewProfile={onViewProfile}
                getImageUrl={getImageUrl}
              />
            </Grid>
          ))}
        </Grid>
        
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        
        {!loading && !hasMoreMatches && matches.length > 0 && (
          <Box sx={{ textAlign: "center", mt: 4, mb: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No more matches to show
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MatchesPage;