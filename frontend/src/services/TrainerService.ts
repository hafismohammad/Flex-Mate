import axios from "axios";
import API_URL from "../../axios/API_URL";

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
 

const trainerService = {
  getAllSpecializations,
  registerTrainer,
  verifyOtp,
  trainerLogin
};

export default trainerService;
