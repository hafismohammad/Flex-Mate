import { Routes, Route } from 'react-router-dom';
import SignupPage from '../pages/user/SignupPage';
import Otp from '../pages/user/OtpPage'
import Login from '../pages/user/LoginPage';
import Home from '../pages/user/HomePage';
import Trainers from '../pages/user/TrainersPage'

function UserRoutes() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/otp' element={<Otp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/trainers' element={<Trainers />} />
      </Routes>
    </div>
  );
}

export default UserRoutes;
