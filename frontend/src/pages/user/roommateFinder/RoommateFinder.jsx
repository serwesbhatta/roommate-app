import React, { useState } from 'react';
import { Box, Container, Typography, Button, Paper, Grid, IconButton, Avatar, Rating, Chip, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { RoommateFinderSrcBar } from '../../../components/others';
import { EnhancedCurrentRoommateCard, ProfileCardGrid } from '../../../components/matchProfile';

const RoommateFinder = () => {
  // Track the current view state
  const [currentView, setCurrentView] = useState('current'); // 'current' or 'finder'
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
    photo: '/path/to/profile-photo.jpg',
    matchPercentage: 85,
    rating: 4.5,
    reviews: 12,
    major: 'Computer Science',
    graduationYear: '2025',
    gender: 'Male',
  };
  
  const matchedRoommates = [
    { id: '1', name: 'Jane Smith', photo: '/path/to/jane.jpg', matchPercentage: 92, rating: 4.8, reviews: 15, major: 'Biology' },
    { id: '2', name: 'Alex Johnson', photo: '/path/to/alex.jpg', matchPercentage: 87, rating: 4.2, reviews: 8, major: 'Engineering' },
    { id: '3', name: 'Taylor Wilson', photo: '/path/to/taylor.jpg', matchPercentage: 85, rating: 4.6, reviews: 11, major: 'Psychology' },
    { id: '4', name: 'Casey Rodriguez', photo: '/path/to/casey.jpg', matchPercentage: 83, rating: 4.3, reviews: 9, major: 'Business' },
    { id: '5', name: 'Jordan Lee', photo: '/path/to/jordan.jpg', matchPercentage: 80, rating: 4.0, reviews: 7, major: 'Chemistry' },
    { id: '6', name: 'Riley Thompson', photo: '/path/to/riley.jpg', matchPercentage: 78, rating: 4.1, reviews: 5, major: 'Mathematics' },
  ];
  
  const handleSearch = (params) => {
    setSearchParams(params);
    setShowMatches(true);
  };
  
  const handleLoadMore = () => {
    // Implementation for loading more matches
    console.log('Loading more matches...');
  };
  
  const goToFindRoommate = () => {
    setCurrentView('finder');
  };
  
  const goBackToCurrent = () => {
    setCurrentView('current');
    setShowMatches(false); // Reset matches when going back
  };
  

  
  // Current Roommate View
  const CurrentRoommateView = () => (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Your Current Roommate
      </Typography>
      
      {currentRoommate ? (
        <EnhancedCurrentRoommateCard roommate={currentRoommate} />
      ) : (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            You don't have a roommate yet. Find one below!
          </Typography>
        </Paper>
      )}
      
      <Box display="flex" justifyContent="center" mt={4}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={goToFindRoommate}
        >
          Find a New Roommate
        </Button>
      </Box>
    </Box>
  );
  
  // Find Roommate View - maintaining previous structure with improvements
  const FindRoommateView = () => (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={goBackToCurrent} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h2">
          Find a New Roommate
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <RoommateFinderSrcBar onSearch={handleSearch} />
      </Paper>
      
      {/* Display search parameters if search was performed */}
      {showMatches && (
        <Box mb={3}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {searchParams.major && <Chip label={`Major: ${searchParams.major}`} size="small" />}
            {searchParams.gender && <Chip label={`Gender: ${searchParams.gender}`} size="small" />}
            {searchParams.graduationYear && <Chip label={`Class of: ${searchParams.graduationYear}`} size="small" />}
          </Box>
        </Box>
      )}
      
      {/* Results Section - using the original ProfileCardGrid */}
      {showMatches && (
        <Box mt={4}>
          <Typography variant="h6" component="h3" gutterBottom>
            Matches Based on Your Preferences
          </Typography>
          <ProfileCardGrid 
            profiles={matchedRoommates} 
            onLoadMore={handleLoadMore} 
          />
        </Box>
      )}
      
      <Box display="flex" justifyContent="center" mt={4}>
        <Button 
          variant="outlined" 
          onClick={goBackToCurrent}
        >
          Back to Current Roommate
        </Button>
      </Box>
    </Box>
  );
  
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        {currentView === 'current' ? <CurrentRoommateView /> : <FindRoommateView />}
      </Box>
    </Container>
  );
};

export default RoommateFinder;