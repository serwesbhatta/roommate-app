import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RoommateFinderSrcBar from "../others/RoommateFinderSrcBar";
import { ProfileCardGrid } from "../matchProfile";
import NoDataPlaceholder from "./NoDataPlaceholder";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilterProfiles } from "../../redux/slices/userSlice";
import { getImageUrl } from "../../utils/imageURL";


const LIMIT = 10;

const RoommateFinderView = ({ onBackClick, onSearch, searchParams, showMatches ,onViewProfile }) => {
  const dispatch = useDispatch();
  const { filterResults, status, error, totalCount } = useSelector(
    (s) => s.user
  );
  const [hasMore, setHasMore] = useState(true);

  // ─────────────── Event handlers ────────────────
  const runSearch = useCallback(
    (params) => {
      onSearch(params);
      setHasMore(true);
      dispatch(
        fetchFilterProfiles({
          majors: params.major,
          gender: params.gender,
          age: params.age ? Number(params.age) : undefined,
          skip: 0,
          limit: LIMIT,
        })
      );
    },
    [dispatch, onSearch]
  );

  const handleLoadMore = useCallback(() => {
    if (!hasMore) return;
    dispatch(
      fetchFilterProfiles({
        majors: searchParams.major,
        gender: searchParams.gender,
        age: searchParams.age ? Number(searchParams.age) : undefined,
        skip: filterResults.length,
        limit: LIMIT,
      })
    ).then((action) => {
      const newResults = action.payload?.results || [];
      if (
        newResults.length === 0 ||
        filterResults.length + newResults.length >= totalCount
      ) {
        setHasMore(false);
      }
    });
  }, [dispatch, hasMore, searchParams, filterResults.length, totalCount]);

  // Auto‑disable load‑more when dataset exhausted
  useEffect(() => {
    if (totalCount !== undefined && filterResults.length >= totalCount) {
      setHasMore(false);
    }
  }, [filterResults.length, totalCount]);

  // ─────────────── Render ────────────────────────
  return (
    <Box>
      {/* Header ------------------------------------------------------------ */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={onBackClick} sx={{ mr: 2 }}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          Find a New Roommate
        </Typography>
      </Box>

      {/* Search bar -------------------------------------------------------- */}
      <Box sx={{ mb: 4 }}>
        <RoommateFinderSrcBar onSearch={runSearch} setSearchParams={onSearch} />
      </Box>

      {/* Applied filters chips -------------------------------------------- */}
      {showMatches && (
        <Box mb={3}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {searchParams.major && (
              <Chip label={`Major: ${searchParams.major}`} size="medium" color="info" />
            )}
            {searchParams.gender && (
              <Chip label={`Gender: ${searchParams.gender}`} size="medium" color="info" />
            )}
            {searchParams.age && (
              <Chip label={`Age: ${searchParams.age}`} size="medium" color="info" />
            )}
          </Box>
        </Box>
      )}

      {/* Result list ------------------------------------------------------- */}
      {showMatches && (
        <Box mt={4} sx={{ maxHeight: "600px", overflowY: "auto", pr: 1 }}>
          {status === "loading" ? (
            <Box display="flex" justifyContent="center" my={8}>
              <CircularProgress />
            </Box>
          ) : filterResults.length > 0 ? (
            <>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {totalCount
                  ? `${filterResults.length} of ${totalCount} Matches Found`
                  : `${filterResults.length} Matches Found`}
              </Typography>
              <ProfileCardGrid profiles={filterResults} onViewProfile={onViewProfile}  getImageUrl={getImageUrl}/>

              {/* Load‑more button */}
              <Box display="flex" justifyContent="center" mt={3} mb={2}>
                {hasMore ? (
                  <Button variant="contained" onClick={handleLoadMore} sx={{ textTransform: "none" }}>
                    Load More
                  </Button>
                ) : (
                  filterResults.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No more profiles to load.
                    </Typography>
                  )
                )}
              </Box>
            </>
          ) : (
            <NoDataPlaceholder message="No matches found for your search criteria." />
          )}
        </Box>
      )}
    </Box>
  );
};

export default RoommateFinderView;