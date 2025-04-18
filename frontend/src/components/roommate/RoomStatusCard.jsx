// RoomStatusCard.jsx - Extracted reusable component
import React from "react";
import { Box, Card, CardContent, Grid, Typography, Chip } from "@mui/material";

const RoomStatusCard = ({ currentUserRoom, residenceHall }) => {
  const occupancyPercentage = currentUserRoom
    ? Math.round(
        (currentUserRoom.current_occupants / currentUserRoom.capacity) * 100
      )
    : 0;

  return (
    <Card
      elevation={4}
      sx={{
        mb: 4,
        borderRadius: 3,
        p: 2,
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Your Room Status
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Room Number
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {currentUserRoom?.room_number}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Room Type
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {currentUserRoom?.room_type}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Price
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              ${currentUserRoom?.price}/month
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Residence Hall
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {residenceHall?.name || "Loading..."}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Lease End
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {currentUserRoom?.lease_end
                ? new Date(currentUserRoom.lease_end).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Occupancy
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="body1" fontWeight="medium">
                {currentUserRoom?.current_occupants}/{currentUserRoom?.capacity}{" "}
                spots filled
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

export default RoomStatusCard;
