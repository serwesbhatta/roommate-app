// Update useRoommates.js hook to incorporate feedback functionality
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userRoom } from "../../../redux/slices/roomSlice";
import { fetchResidenceHalls } from "../../../redux/slices/residenceHallSlice";
import { fetchFeedbackGave } from "../../../redux/slices/feedbackSlice";

export const useRoommates = () => {
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
  const [matchedRoommates, setMatchedRoommates] = useState([]);
  const roommatesPerPage = 6;
  
  const { id } = useSelector((state) => state.auth);
  const { currentUserRoom } = useSelector((state) => state.rooms);
  const { residenceHalls } = useSelector((state) => state.residenceHall);
  
  useEffect(() => {
    if (id) {
      dispatch(userRoom({ user_id: id }));
      dispatch(fetchResidenceHalls({skip:0, limit: 100}));
      
      // Fetch feedback data that the current user has given
      dispatch(fetchFeedbackGave({ 
        userId: id,
        skip: 0, 
        limit: 100 
      }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [gridView]);
  
  // Get roommates (other residents in the same room)
  const roommates = currentUserRoom?.user_profiles?.filter(profile => profile.user_id !== id) || [];
  
  // Calculate total pages for pagination
  const totalRoommatePages = Math.ceil(roommates.length / roommatesPerPage);

  // Get residence hall information
  const residenceHall = residenceHalls?.find(hall => 
    hall.id === currentUserRoom?.residence_hall_id
  );

  // Handler functions
  const handleSearch = (params) => {
    setSearchParams(params);
    setShowMatches(true);
    setMatchedRoommates([]); // Mock data - in production this would be populated by API call
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

  const handleFeedback = (roommate) => {
    console.log(`Give feedback for roommate ${roommate.user_id}`);
    // Note: The actual feedback handling is now in CurrentRoommateView component
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewModeChange = () => {
    setGridView(!gridView);
  };
  
  return {
    currentView,
    currentUserRoom,
    residenceHall,
    roommates,
    currentPage,
    roommatesPerPage,
    totalRoommatePages,
    gridView,
    showMatches,
    searchParams,
    matchedRoommates,
    handleSearch,
    handleLoadMore,
    goToFindRoommate,
    goBackToCurrent,
    handleViewProfile,
    handleMessage,
    handleFeedback,
    handlePageChange,
    handleViewModeChange
  };
};
