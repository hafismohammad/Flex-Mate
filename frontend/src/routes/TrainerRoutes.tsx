import TrainerLoginPage from "../pages/trainer/TrainerLoginPage";
import TrainerSignupPage from "../pages/trainer/TrainerSignupPage";
import TrainerOtpPage from "../pages/trainer/TrainerOtpPage";
import TrainerDashboard from "../components/trainer/TrainerDashboard";
import { Route, Routes } from "react-router-dom";
import TrainerLayout from "../components/trainer/TrainerLayout";
import ProtectRoute from "./protectRoutes/TrainerProtectRoute";
import TrainerProfilePage from "../pages/trainer/TrainerProfilePage";
import BookingsPage from "../pages/trainer/BookingsPage";
import TrainerProfileEditPage from "../pages/trainer/TrainerProfileEditPage";
import CurrentSchedulesPage from "../pages/trainer/CurrentSchedulesPage";

function TrainerRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<TrainerLoginPage />} />
      <Route path="/signup" element={<TrainerSignupPage />} />
      <Route path="/otp" element={<TrainerOtpPage />} />

      <Route path="/" element={<TrainerLayout />}>
        <Route path="/" element={<ProtectRoute><TrainerDashboard /></ProtectRoute>} />
        <Route path="/profile" element={<ProtectRoute><TrainerProfilePage /></ProtectRoute>} />
        <Route path="/editProfile" element={<ProtectRoute><TrainerProfileEditPage /></ProtectRoute>} />
        <Route path="/bookings" element={<ProtectRoute><BookingsPage /></ProtectRoute>} />
        <Route path="/currentSchedules" element={<ProtectRoute><CurrentSchedulesPage /></ProtectRoute>} />

      </Route>
    </Routes>
  );
}

export default TrainerRoutes;
