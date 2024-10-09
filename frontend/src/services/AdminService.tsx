import axios from "axios";
import API_URL from "../../axios/API_URL";

const adminLogin = (adminData: { email: string; password: string }) => {
  return axios.post(`${API_URL}/api/admin/adminLogin`, adminData);
};

const adminLogout = () => {
    return axios.post(`${API_URL}/api/admin/logout`)
}

const adminService = {
  adminLogin,
  adminLogout
};

export default adminService;
