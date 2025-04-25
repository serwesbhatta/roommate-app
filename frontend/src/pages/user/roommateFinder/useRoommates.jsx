import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userRoom } from "../../../redux/slices/roomSlice";
import { fetchResidenceHalls } from "../../../redux/slices/residenceHallSlice";
import {
  fetchFeedbackGave,
} from "../../../redux/slices/feedbackSlice";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook that centralises *all* state / behaviour shared by the
 * roommate‑management screens (Current‑Room view & Roommate‑Finder).
 *
 * @returns {object} public API consumed by containers + presentational comps
 */
export const useRoommates = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ─────────────── Local UI state ────────────────
  const [currentView, setCurrentView] = useState("current"); // "current" | "finder"
  const [searchParams, setSearchParams] = useState({
    major: "",
    gender: "",
    graduationYear: "",
  });
  const [gridView, setGridView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMatches, setShowMatches] = useState(false);
  const roommatesPerPage = 6;

  // ─────────────── Redux selectors ───────────────
  const { id: authId } = useSelector((s) => s.auth);
  const { currentUserRoom } = useSelector((s) => s.rooms);
  const { residenceHalls } = useSelector((s) => s.residenceHall);

  // ─────────────── Side‑effects ──────────────────
  useEffect(() => {
    if (!authId) return;
    // Fetch once on mount / authId change
    dispatch(userRoom({ user_id: authId }));
    dispatch(fetchResidenceHalls({ skip: 0, limit: 100 }));
    dispatch(fetchFeedbackGave({ userId: authId, skip: 0, limit: 100 }));
  }, [dispatch, authId]);

  // Reset pagination whenever the layout toggles
  useEffect(() => setCurrentPage(1), [gridView]);

  // ─────────────── Derived data (memoised) ───────
  /** list of *other* occupants in the same room */
  const roommates = useMemo(() => {
    return (
      currentUserRoom?.user_profiles?.filter((p) => p.user_id !== authId) || []
    );
  }, [currentUserRoom?.user_profiles, authId]);

  /** total page count for paginated RoommateListView */
  const totalRoommatePages = useMemo(
    () => Math.ceil(roommates.length / roommatesPerPage) || 1,
    [roommates.length]
  );

  /** convenience lookup for the current hall */
  const residenceHall = useMemo(
    () =>
      residenceHalls?.find(
        (hall) => hall.id === currentUserRoom?.residence_hall_id
      ),
    [residenceHalls, currentUserRoom?.residence_hall_id]
  );

  // ─────────────── Handlers (stable refs) ────────
  const handleSearch = useCallback((params) => {
    setSearchParams(params);
    setShowMatches(true);
    // Roommate‑Finder takes care of dispatching query → API
  }, []);

  const handleViewModeChange = useCallback(() => setGridView((v) => !v), []);

  const handlePageChange = useCallback((_, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goToFindRoommate = useCallback(() => setCurrentView("finder"), []);
  const goBackToCurrent = useCallback(() => {
    setCurrentView("current");
    setShowMatches(false);
  }, []);

  // Stub actions (UI only for now) ----------------
  const handleViewProfile = useCallback((uid) => navigate(`/user/view-profile/${uid}`), []);
  const handleMessage = useCallback((uid) => console.log("msg", uid), []);
  const handleFeedback = useCallback(
    (rm) => console.log("give feedback", rm.user_id),
    []
  );

  // ─────────────── Exposed API ───────────────────
  return {
    // state
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
    // actions / handlers
    setSearchParams,
    handleSearch,
    goToFindRoommate,
    goBackToCurrent,
    handleViewProfile,
    handleMessage,
    handleFeedback,
    handlePageChange,
    handleViewModeChange,
  };
};