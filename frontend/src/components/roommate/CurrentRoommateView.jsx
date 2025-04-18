// Update CurrentRoommateView.jsx to handle feedback
import React, { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import RoomStatusCard from "./RoomStatusCard";
import RoommateListView from "./RoommateListView";
import FeedbackModal from "./FeedbackModal";

const CurrentRoommateView = ({
  currentUserRoom,
  residenceHall,
  roommates,
  currentPage,
  roommatesPerPage,
  totalRoommatePages,
  gridView,
  onViewModeChange,
  onPageChange,
  onViewProfile,
  onMessage,
  onFeedback,
  onFindRoommate,
}) => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState(null);

  const handleFeedbackClick = (roommate) => {
    setSelectedRoommate(roommate);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackModalClose = () => {
    setFeedbackModalOpen(false);
    setSelectedRoommate(null);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
        Roommate Management
      </Typography>

      {currentUserRoom && (
        <RoomStatusCard
          currentUserRoom={currentUserRoom}
          residenceHall={residenceHall}
        />
      )}

      <RoommateListView
        roommates={roommates}
        currentPage={currentPage}
        roommatesPerPage={roommatesPerPage}
        totalPages={totalRoommatePages}
        gridView={gridView}
        onViewModeChange={onViewModeChange}
        onPageChange={onPageChange}
        onViewProfile={onViewProfile}
        onMessage={onMessage}

        onFeedback={handleFeedbackClick}
      />

      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onFindRoommate}
          sx={{ textTransform: "none", px: 4 }}
        >
          Find a Roommate
        </Button>
      </Box>

      {currentUserRoom &&
        currentUserRoom.current_occupants >= currentUserRoom.capacity && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Paper
              elevation={2}
              sx={{ p: 3, borderRadius: 3, bgcolor: "info.light" }}
            >
              <Typography align="center" color="info.contrastText">
                Your room is fully occupied. No more roommates can be added.
              </Typography>
            </Paper>
          </Box>
        )}

      <FeedbackModal
        open={feedbackModalOpen}
        onClose={handleFeedbackModalClose}
        roommate={selectedRoommate}
      />
    </Box>
  );
};

export default CurrentRoommateView;
