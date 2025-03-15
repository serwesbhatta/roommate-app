//import RouterPage from './RouterPage'
import { Navbar } from './components/commons';
import { LandingPage, Login, Signup, Admin, User, NotFound} from './pages';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

function App() {
  const userRole =  useSelector((state) => state.auth.role);

  return (
    <>
      {userRole !== "admin" && <Navbar/>}
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/user/*" element={<User/>} />
        <Route path= "/admin/*" element={<Admin/>} />
        <Route path="*" element={<NotFound/>}/> 
      </Routes>
    </> 
  )
}

export default App