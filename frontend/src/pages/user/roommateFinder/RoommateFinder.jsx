import React from "react";
import { Box, Container } from "@mui/material";
import { useRoommates } from "./useRoommates";
import {
  CurrentRoommateView,
  RoommateFinderView,
} from "../../../components/roommate";

const RoommateFinder = () => {
  const api = useRoommates();

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
    handleSearch,
    goToFindRoommate,
    goBackToCurrent,
    handleViewProfile,
    handleMessage,
    handleFeedback,
    handlePageChange,
    handleViewModeChange,
  } = api;

  return (
    <Container maxWidth="lg">
      <Box my={6}>
        {currentView === "current" ? (
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
            onViewProfile={handleViewProfile}
          />
        )}
      </Box>
    </Container>
  );
};

export default RoommateFinder;