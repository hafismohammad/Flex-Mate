import { Routes, Route } from "react-router-dom";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminLayout from "../components/admin/AdminLayout ";
import Verification from "../components/admin/Verification";
import SpecializationsPage from "../pages/admin/SpecializationsPage";
import TrianerVerificationViewPage from "../pages/admin/TrianerVerificationViewPage";
import UserListingPage from "../pages/admin/UserListingPage";
import TrainerListingPage from "../pages/admin/TrainerListingPage";

function AdminRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/specializations" element={<SpecializationsPage />} />
          <Route path="/trainerView/:trainerId" element={<TrianerVerificationViewPage />} />
          <Route path="/userListing" element={<UserListingPage />}/>
          <Route path="/trainerListing" element={<TrainerListingPage />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default AdminRoutes;
