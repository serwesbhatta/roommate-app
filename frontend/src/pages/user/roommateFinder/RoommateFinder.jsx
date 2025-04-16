import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Button, Paper, Grid, IconButton, 
  Avatar, Chip, Divider, Card, CardContent, CardActions,
  Pagination
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { RoommateFinderSrcBar } from '../../../components/others';
import { ProfileCardGrid } from '../../../components/matchProfile';
import { useSelector, useDispatch } from 'react-redux';
import { userRoom } from "../../../redux/slices/roomSlice";
import { fetchResidenceHalls } from "../../../redux/slices/residenceHallSlice"
import { getImageUrl } from "../../../utils/imageURL";

// Enhanced Roommate Card Component
const RoommateCard = ({ roommate, onViewProfile, onMessage, onFeedback, gridView = false }) => (
  <Card 
    elevation={4} 
    sx={{ 
      height: '100%',
      mb: gridView ? 0 : 3, 
      borderRadius: 3, 
      transition: 'transform 0.3s, box-shadow 0.3s', 
      '&:hover': { transform: 'scale(1.02)', boxShadow: 6 },
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Box display="flex" alignItems="center">
        <Avatar 
          src={getImageUrl(roommate?.profile_image ||"/default-avatar.png")}
          alt={`${roommate.first_name} ${roommate.last_name}`}
          sx={{ width: 72, height: 72, mr: 3, border: '2px solid', borderColor: 'primary.main' }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {roommate.first_name} {roommate.last_name}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {roommate.majors}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            <Chip 
              label={roommate.gender} 
              size="small" 
              sx={{ 
                mr: 1, 
                backgroundColor: roommate.gender === 'Male' ? 'lightblue' : 'secondary.light', 
                color: 'secondary.contrastText'
              }} 
            />
            <Chip 
              label={`Age: ${roommate.age}`} 
              size="small" 
              color="info" 
            />
          </Box>
        </Box>
      </Box>
      {roommate.bio && (
        <Box mt={2}>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Bio
          </Typography>
          <Typography variant="body2" sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {roommate.bio}
          </Typography>
        </Box>
      )}
    </CardContent>

    <CardActions sx={{ p: 2, m:2 }}>
      <Button 
        startIcon={<PersonIcon />} 
        variant="outlined" 
        size="small" 
        onClick={() => onViewProfile(roommate.id)}
        sx={{ textTransform: 'none' }}
      >
        Profile
      </Button>
      <Button 
        startIcon={<MessageIcon />} 
        variant="outlined" 
        size="small" 
        onClick={() => onMessage(roommate.id)}
        sx={{ textTransform: 'none' }}
      >
        Message
      </Button>
      <Button 
        startIcon={<StarIcon />} 
        variant="outlined" 
        size="small"
        onClick={() => onFeedback(roommate.id)}
        sx={{ textTransform: 'none' }}
      >
        Feedback
      </Button>
    </CardActions>
  </Card>
);

const RoommateFinder = () => {
  const dispatch = useDispatch();
  const [currentView, setCurrentView] = useState('current');
  const [showMatches, setShowMatches] = useState(false);
  const [searchParams, setSearchParams] = useState({
    major: '',
    gender: '',
    graduationYear: '',
  });
  const [gridView, setGridView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const roommatesPerPage = 6;
  
  const { id } = useSelector((state) => state.auth);
  const { currentUserRoom } = useSelector((state) => state.rooms);
  const { residenceHalls } = useSelector((state) => state.residenceHall);
  const [matchedRoommates, setMatchedRoommates] = useState([]);

  useEffect(() => {
    dispatch(userRoom({ user_id: id }));
    dispatch(fetchResidenceHalls({skip:0, limit: 100}));
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [gridView]);
  
  // Get roommates (other residents in the same room)
  const roommates = currentUserRoom?.user_profiles?.filter(profile => profile.user_id !== id) || [];

  // Calculate pagination for current roommates
  const indexOfLastRoommate = currentPage * roommatesPerPage;
  const indexOfFirstRoommate = indexOfLastRoommate - roommatesPerPage;
  const currentRoommates = roommates.slice(indexOfFirstRoommate, indexOfLastRoommate);
  const totalRoommatePages = Math.ceil(roommates.length / roommatesPerPage);

  // Get residence hall information
  const residenceHall = residenceHalls?.find(hall => 
    hall.id === currentUserRoom?.residence_hall_id
  );


  // Handler functions
  const handleSearch = (params) => {
    setSearchParams(params);
    setShowMatches(true);
    setMatchedRoommates([]); 
  };
  
  const handleLoadMore = () => {
    console.log('Loading more matches...');
  };
  
  const goToFindRoommate = () => {
    setCurrentView('finder');
  };
  
  const goBackToCurrent = () => {
    setCurrentView('current');
    setShowMatches(false);
  };

  const handleViewProfile = (roommateId) => {
    console.log(`View profile of roommate ${roommateId}`);
  };

  const handleMessage = (roommateId) => {
    console.log(`Message roommate ${roommateId}`);
  };

  const handleFeedback = (roommateId) => {
    console.log(`Give feedback for roommate ${roommateId}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewModeChange = () => {
    setGridView(!gridView);
  };

  // Enhanced Room Status Card Component
  const RoomStatusCard = () => {
    const occupancyPercentage = currentUserRoom ? 
      Math.round((currentUserRoom.current_occupants / currentUserRoom.capacity) * 100) : 0;
    
    return (
      <Card 
        elevation={4} 
        sx={{ 
          mb: 4, 
          borderRadius: 3, 
          p: 2, 
          background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)' 
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Your Room Status
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">Room Number</Typography>
              <Typography variant="body1" fontWeight="medium">
                {currentUserRoom?.room_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">Room Type</Typography>
              <Typography variant="body1" fontWeight="medium">
                {currentUserRoom?.room_type}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">Price</Typography>
              <Typography variant="body1" fontWeight="medium">
                ${currentUserRoom?.price}/month
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">Residence Hall</Typography>
              <Typography variant="body1" fontWeight="medium">
                {residenceHall?.name || 'Loading...'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">Lease End</Typography>
              <Typography variant="body1" fontWeight="medium">
                {currentUserRoom?.lease_end ? new Date(currentUserRoom.lease_end).toLocaleDateString() : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">Occupancy</Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" fontWeight="medium">
                  {currentUserRoom?.current_occupants}/{currentUserRoom?.capacity} spots filled
                </Typography>
                <Chip 
                  size="small" 
                  label={`${occupancyPercentage}%`} 
                  color={occupancyPercentage > 70 ? "success" : "primary"}
                  sx={{ ml: 1 }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Current Roommate View
  const CurrentRoommateView = () => {
    // Check if there are no current roommates
    const noRoommatesFound = roommates.length === 0;
    
    return (
      <Box>
        <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
          Roommate Management
        </Typography>
        
        {currentUserRoom && <RoomStatusCard />}
        
        {/* View mode controls shown only if there are current roommates */}
        {roommates.length > 0 && (
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="600">
              Current Roommates ({roommates.length})
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton onClick={handleViewModeChange} color="primary">
                {gridView ? <ViewListIcon /> : <ViewModuleIcon />}
              </IconButton>
            </Box>
          </Box>
        )}
        
        {noRoommatesFound ? (
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, textAlign: 'center', mb: 4 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No roommate records found.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You currently have no roommates.
            </Typography>
          </Paper>
        ) : (
          gridView ? (
            <Grid container spacing={3}>
              {currentRoommates.map(roommate => (
                <Grid item xs={12} sm={6} md={4} key={roommate.id}>
                  <RoommateCard 
                    roommate={roommate}
                    onViewProfile={handleViewProfile}
                    onMessage={handleMessage}
                    onFeedback={handleFeedback}
                    gridView={true}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            currentRoommates.map(roommate => (
              <RoommateCard 
                key={roommate.id} 
                roommate={roommate}
                onViewProfile={handleViewProfile}
                onMessage={handleMessage}
                onFeedback={handleFeedback}
              />
            ))
          )
        )}

        {/* Pagination for current roommates */}
        {roommates.length > roommatesPerPage && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination 
              count={totalRoommatePages} 
              page={currentPage} 
              onChange={handlePageChange} 
              color="primary" 
              size="large"
            />
          </Box>
        )}
        
        {currentUserRoom && currentUserRoom.current_occupants < currentUserRoom.capacity && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={goToFindRoommate}
              sx={{ textTransform: 'none', px: 4 }}
            >
              Find a Roommate
            </Button>
          </Box>
        )}
        
        {currentUserRoom && currentUserRoom.current_occupants >= currentUserRoom.capacity && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: 'info.light' }}>
              <Typography align="center" color="info.contrastText">
                Your room is fully occupied. No more roommates can be added.
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>
    );
  };
  
  // Find Roommate View
  const FindRoommateView = () => (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={goBackToCurrent} sx={{ mr: 2 }}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <Typography variant="h5" fontWeight="700">
          Find a New Roommate
        </Typography>
      </Box>
      
      <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <RoommateFinderSrcBar onSearch={handleSearch} />
      </Paper>
      
      {showMatches && (
        <Box mb={3}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {searchParams.major && <Chip label={`Major: ${searchParams.major}`} size="small" color="secondary" />}
            {searchParams.gender && <Chip label={`Gender: ${searchParams.gender}`} size="small" color="secondary" />}
            {searchParams.graduationYear && <Chip label={`Class of: ${searchParams.graduationYear}`} size="small" color="secondary" />}
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
                onLoadMore={handleLoadMore} 
              />
            </>
          ) : (
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.default' }}>
              <Typography align="center" color="text.secondary">
                No matches found for your search criteria. Try adjusting your filters.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
      
      <Box display="flex" justifyContent="center" mt={4}>
        <Button 
          variant="outlined" 
          onClick={goBackToCurrent}
          sx={{ textTransform: 'none', px: 4 }}
        >
          Back to Roommates
        </Button>
      </Box>
    </Box>
  );
  
  return (
    <Container maxWidth="lg">
      <Box my={6}>
        {currentView === 'current' ? <CurrentRoommateView /> : <FindRoommateView />}
      </Box>
    </Container>
  );
};

export default RoommateFinder;