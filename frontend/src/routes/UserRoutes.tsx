import { Routes, Route } from 'react-router-dom';
import SignupPage from '../pages/user/SignupPage';
import Otp from '../pages/user/OtpPage'

function UserRoutes() {
  return (
    <div>
      <Routes>
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/otp' element={<Otp />} />
      </Routes>
    </div>
  );
}

export default UserRoutes;
