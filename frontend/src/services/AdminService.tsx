import axios from "axios";
import API_URL from "../../axios/API_URL";

const adminLogin = (adminData: { email: string; password: string }) => {
  return axios.post(`${API_URL}/admin/api/adminLogin`, adminData);
};

const adminService = {
  adminLogin,
};

export default adminService;
