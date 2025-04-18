// Update RoommateFinder.jsx to pass the onFeedback prop
import React from 'react';
import { Box, Container } from '@mui/material';
import { useRoommates } from './useRoommates';
import {CurrentRoommateView, RoommateFinderView} from '../../../components/roommate';


const RoommateFinder = () => {
  const {
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
  } = useRoommates();
  
  return (
    <Container maxWidth="lg">
      <Box my={6}>
        {currentView === 'current' ? (
          <CurrentRoommateView 
            currentUserRoom={currentUserRoom}
            residenceHall={residenceHall}
            roommates={roommates}
            currentPage={currentPage}
            roommatesPerPage={roommatesPerPage}
            totalRoommatePages={totalRoommatePages}
            gridView={gridView}
            onViewModeChange={handleViewModeChange}
            onPageChange={handlePageChange}
            onViewProfile={handleViewProfile}
            onMessage={handleMessage}
            onFeedback={handleFeedback}
            onFindRoommate={goToFindRoommate}
          />
        ) : (
          <RoommateFinderView 
            onBackClick={goBackToCurrent}
            onSearch={handleSearch}
            searchParams={searchParams}
            showMatches={showMatches}
            matchedRoommates={matchedRoommates}
            onLoadMore={handleLoadMore}
          />
        )}
      </Box>
    </Container>
  );
};

export default RoommateFinder;