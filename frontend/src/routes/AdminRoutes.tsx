import { Routes, Route } from "react-router-dom";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminLayout from "../components/admin/AdminLayout ";
import Verification from "../components/admin/Verification";
import SpecializationsPage from "../pages/admin/SpecializationsPage";

function AdminRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/specializations" element={<SpecializationsPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default AdminRoutes;
