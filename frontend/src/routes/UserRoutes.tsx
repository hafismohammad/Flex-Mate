import { Routes, Route } from 'react-router-dom';
import SignupPage from '../pages/user/SignupPage';
import Otp from '../pages/user/OtpPage'
import Login from '../pages/user/LoginPage';

function UserRoutes() {
  return (
    <div>
      <Routes>
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/otp' element={<Otp />} />
        <Route path='/login' element={<Login />} />

      </Routes>
    </div>
  );
}

export default UserRoutes;
