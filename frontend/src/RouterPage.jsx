// import React, {useEffect} from 'react'
// import { UserDashboard, AdminDashboard } from './Container'
// import {Login, Registration, NotFound} from './Components'

import { LandingPage, Login, Signup } from './pages';
import { Routes, Route, useNavigate } from 'react-router-dom'


const RouterPage = () => {

  const navigate = useNavigate();

//   useEffect(() => {

//     const logInUserName = localStorage.getItem("LogInUserName");
//     const logInAdminName = localStorage.getItem("LogInAdminName");

//     if(!logInUserName||!logInAdminName){
//       navigate("/")
//     }

//   }, [])

  return (
    <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
          {/* <Route path="/userDashboard/*" element={<UserDashboard/>} />
        <Route path= "/adminDashboard/*" element={<AdminDashboard/>} />
        <Route path="*" element={<NotFound/>}/> */}
    </Routes>
  )
}

export default RouterPage