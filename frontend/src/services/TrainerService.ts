import axios from "axios";
import API_URL from "../../axios/API_URL";
import {KycSubmission} from '../types/trainer'

const getAllSpecializations = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/trainer/getSpecializations`
    );
    console.log("All data from backend", response.data);
    return response.data; 
  } catch (error) {
    console.error("Error fetching specializations:", error);
    throw error; 
  }
};


export interface ITrainer {
  trainerId?: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  specialization: string
  isBlocked?: boolean;
}

const registerTrainer = async (trainerData: ITrainer) => {
  try {
    const response = await axios.post(`${API_URL}/api/trainer/signup`, trainerData);
    return response.data;
  } catch (error) {
    console.error('Error registering trainer:', error);
    throw error; // Propagates the error so that the calling code can handle it
  }
};

const verifyOtp = async ({
  trainerData,
  otp,
}: {
  trainerData: ITrainer;
  otp: string;
}) => {
  console.log('trainer otp verify');
  
  const response = await axios.post(`${API_URL}/api/trainer/otp`, { trainerData, otp });

  if (response.data) {
    // Store the user data in localStorage after successful OTP verification
    localStorage.setItem("trainer", JSON.stringify(response.data));
  }

  return response.data;
};

const trainerLogin = async (trainerData: { email: string; password: string }) => {
  
  const response =   await axios.post(`${API_URL}/api/trainer/login`, trainerData);
  return response
};



const kycSubmission = async (kycData: FormData, token: string) => {
  try {
  
    const response = await axios.post(`${API_URL}/api/trainer/kyc`, kycData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error kyc submission trainer:', error);
    throw error; 
  }
};

const logoutTrainer = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/trainer/logout`);
    return response.data;
  } catch (error) {
    console.error('Error during trainer logout:', error);
    throw error;
  }
};





const trainerService = {
  getAllSpecializations,
  registerTrainer,
  verifyOtp,
  trainerLogin,
  kycSubmission,
  logoutTrainer
};

export default trainerService;
