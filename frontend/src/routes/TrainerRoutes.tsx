import TrainerLoginPage from "../pages/trainer/TrainerLoginPage";
import TrainerSignupPage from "../pages/trainer/TrainerSignupPage";
import TrainerOtpPage from "../pages/trainer/TrainerOtpPage";
import TrainerDashboard from "../components/trainer/TrainerDashboard";
import { Route, Routes } from "react-router-dom";
import TrainerLayout from "../components/trainer/TrainerLayout";
import TrainerKycPage from "../pages/trainer/TrainerKycPage";
import ProtectRoute from "./protectRoutes/TrainerProtectRoute";

function TrainerRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<TrainerLoginPage />} />
      <Route path="/signup" element={<TrainerSignupPage />} />
      <Route path="/otp" element={<TrainerOtpPage />} />

      <Route path="/" element={<TrainerLayout />}>
        <Route path="dashboard" element={<ProtectRoute><TrainerDashboard /></ProtectRoute>} />
      </Route>
    </Routes>
  );
}

export default TrainerRoutes;
