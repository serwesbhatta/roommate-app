
import React, { useState, useEffect } from "react";
import { InputAdornment, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, Box, Typography, CircularProgress, Paper } from "@mui/material";
import { Search, PersonAdd } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchProfiles } from "../../redux/slices/userSlice";
import { formatLastSeen } from "../../utils/formatters";

const UserSearch = ({ onSelectUser }) => {
  const dispatch = useDispatch();
  const { searchResults, status } = useSelector(s => s.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  /* debounce */
  useEffect(() => { const t = setTimeout(() => setDebouncedQuery(searchQuery), 500); return () => clearTimeout(t); }, [searchQuery]);

  /* fetch */
  useEffect(() => { if (debouncedQuery && showResults) dispatch(fetchSearchProfiles({ query: debouncedQuery })); }, [debouncedQuery, dispatch, showResults]);

  const handleUserSelect = user => {
    onSelectUser({
      id: user.user_id.toString(),
      user: {
        id: user.user_id.toString(),
        name: `${user.first_name} ${user.last_name}`.trim(),
        avatar: user.profile_image || "/default-avatar.png",
      },
      lastMessage: "",
      unread: 0,
      timestamp: "",
      isGroup: false,
      online: user.is_logged_in ?? false,
      lastSeen: user.last_login ?? null,
    });
    setSearchQuery("");
    setShowResults(false);
  };

  const isLoading = status === "loading";

  return (
    <Box sx={{ position: "relative", width: "100%", mb: 2 }}>
      <TextField fullWidth placeholder="Search users..." variant="outlined" size="small" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => { setShowResults(true); if (searchQuery) dispatch(fetchSearchProfiles({ query: searchQuery })); }} onBlur={() => setTimeout(() => setShowResults(false), 200)} InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px', '&.Mui-focused fieldset': { borderColor: '#4a7fff' } } }} />

      {showResults && (
        <Paper elevation={3} sx={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10, mt: 0.5, maxHeight: 300, overflowY: "auto", borderRadius: 2 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}><CircularProgress size={24} sx={{ color: "#4a7fff" }} /></Box>
          ) : Array.isArray(searchResults) && searchResults.length ? (
            <List disablePadding>
              {searchResults.map(u => (
                <ListItem button key={u.user_id} onClick={() => handleUserSelect(u)} sx={{ '&:hover': { bgcolor: '#f5f7ff' } }}>
                  <ListItemAvatar><Avatar src={u.profile_image} /></ListItemAvatar>
                  <ListItemText primary={`${u.first_name} ${u.last_name}`} secondary={<Box sx={{ display: 'flex', alignItems: 'center' }}><PersonAdd sx={{ mr: 0.5, fontSize: 14, color: '#4a7fff' }} /><Typography variant="caption">Start conversation · {u.is_logged_in ? 'Online' : formatLastSeen(u.last_login)}</Typography></Box>} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}><Typography color="text.secondary">{searchQuery ? 'No users found' : 'Type to search users'}</Typography></Box>
          )}
        </Paper>
      )}
    </Box>
  );
};
export default UserSearch;