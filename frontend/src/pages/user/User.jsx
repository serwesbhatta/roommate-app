import React, { useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Profile from '../profile/Profile';
import UserHome from './UserHome';
import RoommateFinder from './roommateFinder/RoommateFinder';
import UserEvents from './userevents/UserEvents';
import Chat from '../chat/Chat'

const User = () => {
  // const currentUserId = useSelector((state) => state.auth.id);
  // const navigate = useNavigate();


  return (
    <Routes>
      <Route path="user_home" element={<UserHome />} /> 
      <Route path="roommate" element={<RoommateFinder />} /> 
      <Route path="events" element={<UserEvents/>} /> 
      <Route path="chat" element={<Chat/>} /> 
      <Route path="profile/:userId" element={<Profile />} />
      <Route path="view-profile/:userId" element={<Profile />} />
    </Routes>
  );
};

export default User;