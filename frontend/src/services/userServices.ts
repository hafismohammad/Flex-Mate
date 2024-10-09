import axios from "axios";
import { User } from "../features/user/userTypes";
import API_URL from '../../axios/API_URL'; 

const register = async (userDetails: User) => {
  const response = await axios.post(`${API_URL}/api/user/signup`, userDetails);

  if (response.data) {
    console.log('register', response.data);
  }

  return response.data;
};
const login = async (userData: { email: string; password: string }) => {
  console.log('kljj');
  
  const response =   await axios.post(`${API_URL}/api/user/login`, userData);
  return response
};

const verifyOtp = async ({
  userData,
  otp,
}: {
  userData: User;
  otp: string;
}) => {
  const response = await axios.post(`${API_URL}/api/user/otp`, { userData, otp });

  if (response.data) {
    // Store the user data in localStorage after successful OTP verification
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  return axios.post(`${API_URL}/api/user/logout`, {}); 
}



const userService = {
  register,
  verifyOtp,
  login,
  logout
};

export default userService;
