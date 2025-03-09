import { LandingPage, Login, Signup, Admin, User} from './pages';
import { Routes, Route, useNavigate } from 'react-router-dom'


const RouterPage = () => {

  return (
    <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/user/*" element={<User/>} />
        <Route path= "/admin/*" element={<Admin/>} />
        {/* <Route path="*" element={<NotFound/>}/>  */}
    </Routes>
  )
}

export default RouterPage