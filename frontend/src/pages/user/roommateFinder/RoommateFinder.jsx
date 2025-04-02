// RoommateFinder.jsx
import React, { useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import {RoommateFinderSrcBar} from '../../../components/others';
import { ProfileCardGrid, CurrentRoommateCard } from '../../../components/matchProfile';

const RoommateFinder = () => {
  const [showMatches, setShowMatches] = useState(false);
  const [searchParams, setSearchParams] = useState({
    major: '',
    gender: '',
    graduationYear: '',
  });
  
  // Mock data for demonstration
  const currentRoommate = {
    id: '123',
    name: 'John Doe',
    matchPercentage: 85,
    rating: 4.5,
    reviews: 12,
  };
  
  const matchedRoommates = [
    { id: '1', name: 'John Doe', matchPercentage: 80 },
    { id: '2', name: 'John Doe', matchPercentage: 80 },
    { id: '3', name: 'John Doe', matchPercentage: 80 },
    { id: '4', name: 'John Doe', matchPercentage: 80 },
    { id: '5', name: 'John Doe', matchPercentage: 80 },
    { id: '6', name: 'John Doe', matchPercentage: 80 },
  ];
  
  const handleSearch = (params) => {
    setSearchParams(params);
    setShowMatches(true);
  };
  
  const handleLoadMore = () => {
    // Implementation for loading more matches
    console.log('Loading more matches...');
  };
  
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Roommate Finder
        </Typography>
        
        {/* Current Roommate Section */}
        <Box mb={4}>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Current Roommate
          </Typography>
          <CurrentRoommateCard roommate={currentRoommate} />
        </Box>
        
        {/* Search Section */}
        <Box mb={4}>
          <Typography variant="h5" component="h2" gutterBottom>
            Find a New Roommate
          </Typography>
          <RoommateFinderSrcBar onSearch={handleSearch} />
        </Box>
        
        {/* Results Section */}
        {showMatches && (
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              Matches
            </Typography>
            <ProfileCardGrid 
              profiles={matchedRoommates} 
              onLoadMore={handleLoadMore} 
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default RoommateFinder;