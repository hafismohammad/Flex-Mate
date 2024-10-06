import axios from "axios";
import { User } from "../features/user/userTypes";
import API_URL from '../../axios/API_URL'; 

const register = async (userDetails: User) => {
  const response = await axios.post(`${API_URL}/signup`, userDetails);

  if (response.data) {
    console.log('register', response.data);
  }

  return response.data;
};
const login = (userData: { email: string; password: string }) => {
  return axios.post(`${API_URL}/login`, userData);
};

const verifyOtp = async ({
  userData,
  otp,
}: {
  userData: User;
  otp: string;
}) => {
  const response = await axios.post(`${API_URL}/otp`, { userData, otp });

  if (response.data) {
    // Store the user data in localStorage after successful OTP verification
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  return axios.post(`${API_URL}/logout`, {});  // Using POST request to logout
}



const userService = {
  register,
  verifyOtp,
  login,
  logout
};

export default userService;
