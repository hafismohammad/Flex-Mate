import adminAxiosInstance from "../../axios/adminAxiosInstance";
import API_URL from "../../axios/API_URL";

const adminLogin = (adminData: { email: string; password: string }) => {
  return adminAxiosInstance.post(`/api/admin/adminLogin`, adminData);
};

const adminLogout = () => {
  return adminAxiosInstance.post(`/api/admin/logout`);
};

const addSpecialization = (formData: FormData) => {
  return adminAxiosInstance.post(`/api/admin/addSpecialization`, formData);
};

const getAllSpecialization = () => {
  return adminAxiosInstance.get(`/api/admin/allSpecializations`);
};

const adminService = {
  adminLogin,
  adminLogout,
  addSpecialization,
  getAllSpecialization,
};

export default adminService;
