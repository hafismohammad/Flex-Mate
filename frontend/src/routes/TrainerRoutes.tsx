import TrainerLoginPage from "../pages/trainer/TrainerLoginPage";
import TrainerSignupPage from "../pages/trainer/TrainerSignupPage";
import TrainerOtpPage from "../pages/trainer/TrainerOtpPage";
import TrainerDashboard from "../components/trainer/TrainerDashboard";
import { Route, Routes } from "react-router-dom";
import TrainerLayout from "../components/trainer/TrainerLayout";
import TrainerKycPage from "../pages/trainer/TrainerKycPage";

function TrainerRoutes() {
  return (
    <Routes>
      {/* Public routes for login, signup, and OTP */}
      <Route path="/login" element={<TrainerLoginPage />} />
      <Route path="/signup" element={<TrainerSignupPage />} />
      <Route path="/otp" element={<TrainerOtpPage />} />

      {/* Routes that require the TrainerLayout */}
      <Route path="/" element={<TrainerLayout />}>
        <Route index element={<TrainerDashboard />} /> {/* Default Dashboard Route */}
        <Route path="kyc" element={<TrainerKycPage />} /> {/* Nested KYC Page */}
      </Route>
    </Routes>
  );
}

export default TrainerRoutes;
