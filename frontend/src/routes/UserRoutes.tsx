import { Routes, Route } from 'react-router-dom';
import SignupPage from '../pages/user/SignupPage';
import Otp from '../pages/user/OtpPage';
import Login from '../pages/user/LoginPage';
import Home from '../pages/user/HomePage';
import Trainers from '../pages/user/TrainersPage';
import TrainerProfileViewPage from '../pages/user/TrainerProfileViewPage';
import SuccessPaymentPage from '../pages/user/SuccessPaymentPage';
import FailedPaymentPage from '../pages/user/FailedPaymentPage';
import UserProfilePage from '../pages/user/UserProfilePage';
import UserLayout from '../components/user/UserLayout';
import Sessions from '../components/user/sessions';

function UserRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/otp' element={<Otp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/trainers' element={<Trainers />} />
      <Route path='/trainers/:specId' element={<Trainers />} />
      <Route path='/trainerProfileView/:trainerId' element={<TrainerProfileViewPage />} />
      <Route path='/paymentSuccess' element={<SuccessPaymentPage />} />
      <Route path='/paymentFailed' element={<FailedPaymentPage />} />
      <Route path='/profile' element={<UserLayout />}>
        <Route index element={<UserProfilePage />} />
        <Route path='sessions' element={<Sessions />} />
      </Route>
    </Routes>
  );
}

export default UserRoutes;
