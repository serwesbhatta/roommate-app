import { Box, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import React from "react";
import { ProfileCard } from ".";

// Matches page component
const MatchesPage = ({ profiles }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Your Matches
      </Typography>
      <Grid container spacing={3}>
        {profiles.map((profile) => (
          <Grid item xs={12} sm={6} md={4} key={profile.id}>
            <ProfileCard profile={profile} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default MatchesPage;
