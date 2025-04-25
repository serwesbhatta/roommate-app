import React, { useMemo } from "react";
import { Box, Grid, IconButton, Pagination, Typography } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import RoommateCard from "./RoommateCard";
import NoDataPlaceholder from "./NoDataPlaceholder";
import { useSelector } from "react-redux";

const RoommateListView = ({
  roommates,
  currentPage,
  roommatesPerPage,
  gridView,
  onViewModeChange,
  onPageChange,
  onViewProfile,
  onMessage,
  onFeedback,
}) => {
  const { id } = useSelector((s) => s.auth);

  // filter + paginate only recalculated when deps change --------------
  const { filteredRoommates, currentSlice, totalPages } = useMemo(() => {
    const filtered = roommates.filter((u) => Number(u.user_id) !== Number(id));
    const pages = Math.ceil(filtered.length / roommatesPerPage) || 1;
    const last = currentPage * roommatesPerPage;
    const first = last - roommatesPerPage;
    return {
      filteredRoommates: filtered,
      currentSlice: filtered.slice(first, last),
      totalPages: pages,
    };
  }, [roommates, id, currentPage, roommatesPerPage]);

  // -------------------------------------------------------------------
  return (
    <Box>
      {filteredRoommates.length > 0 ? (
        <>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Current Roommates ({filteredRoommates.length})
            </Typography>
            <IconButton onClick={onViewModeChange} color="primary">
              {gridView ? <ViewListIcon /> : <ViewModuleIcon />}
            </IconButton>
          </Box>

          {/* Grid / List switch */}
          {gridView ? (
            <Grid container spacing={3}>
              {currentSlice.map((rm) => (
                <Grid item xs={12} sm={6} md={4} key={rm.user_id ?? rm.id}>
                  <RoommateCard
                    roommate={rm}
                    onViewProfile={onViewProfile}
                    onMessage={onMessage}
                    onFeedback={onFeedback}
                    gridView
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            currentSlice.map((rm) => (
              <RoommateCard
                key={rm.user_id ?? rm.id}
                roommate={rm}
                onViewProfile={onViewProfile}
                onMessage={onMessage}
                onFeedback={onFeedback}
              />
            ))
          )}

          {/* Pagination */}
          {filteredRoommates.length > roommatesPerPage && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={onPageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <NoDataPlaceholder submessage="You currently have no roommates." />
      )}
    </Box>
  );
};

export default RoommateListView;