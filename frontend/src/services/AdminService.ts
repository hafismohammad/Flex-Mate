import axios from "axios";
import API_URL from "../../axios/API_URL";

const adminLogin = (adminData: { email: string; password: string }) => {
  return axios.post(`${API_URL}/api/admin/adminLogin`, adminData);
};

const adminLogout = () => {
  return axios.post(`${API_URL}/api/admin/logout`);
};

const addSpecialization = ({ name, description }: { name: string; description: string }) => {
  
  return axios.post(`${API_URL}/api/admin/addSpecialization`, { name, description });
};

const getAllSpecializaton= () => {
  return  axios.get(`${API_URL}/api/admin/allSpecializations`);
}

// Make sure to include addSpecialization in the exported object
const adminService = {
  adminLogin,
  adminLogout,
  addSpecialization,
  getAllSpecializaton
};

export default adminService;
