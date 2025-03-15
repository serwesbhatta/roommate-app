import React from 'react'
import { Routes, Route } from "react-router-dom";
import Profile from '../profile/Profile';
import UserHome from './UserHome';


const User = () => {
  return (
    <Routes>
      <Route path="/" element={<UserHome />} /> 
      <Route path="profile" element={<Profile />} />
    </Routes>
  )
}

export default User