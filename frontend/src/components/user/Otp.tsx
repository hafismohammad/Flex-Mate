import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { verifyOtp } from "../../actions/userAction";
import axios from 'axios'
import API_URL from '../../../axios/API_URL'; 
import { Toaster, toast } from 'react-hot-toast';


interface Errors {
  otp?: string;
}

const Otp = () => {
  const [otp, setOtp] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [seconds, setSeconds] = useState<number>(60); 
  const [isDisabled, setIsDisabled] = useState<boolean>(true); 

  // Get the email from the URL
  const location = useLocation();
  const userData = location.state;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  console.log('timer', seconds);

  const { userInfo, loading, error } = useSelector((state: RootState) => state.user);
console.log('otp error', error);


  const validate = () => {
    const newError: Errors = {};
    if (!otp.trim()) {
      newError.otp = "Please enter OTP";
    } else if (otp.length !== 4) {
      newError.otp = "OTP should be 4 digits";
    }
    return newError;
  };

  const clearErrors = () => {
    setTimeout(() => {
      setErrors({});
    }, 3000);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    const otpErrors = validate();
    setErrors(otpErrors);

    if (Object.keys(otpErrors).length > 0) {
      clearErrors();
      return;
    }

    setErrors({});
    console.log("userData", userData, otp);

    if (userData) {
      dispatch(verifyOtp({ userData, otp }));
    }
  };

 
  const resendOtp = async () => {
    try {
      console.log(userData, userData.email);
      
      const response = await axios.post(`${API_URL}/resend-otp`, {
        email: userData.email,
      });
      console.log(response.data.message); 
      
    
      setSeconds(60); 
      setIsDisabled(true); 
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  useEffect(() => {
    if (error) {
      if(error)
      toast.error('Invalid OTP');
    }
  }, [error, navigate]);

  useEffect(() => {
    if (userInfo) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1500); 

      return () => clearTimeout(timer); 
    }
  }, [userInfo, navigate]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Toaster />
      <div className="w-[40%] bg-white p-6 rounded-xl shadow-lg ">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Enter OTP
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {" "}
          Please enter the 4-digit OTP sent to your mobile number.
        </p>
        <div className="mt-4">
          <input
            type="text"
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            value={otp}
            className="block w-full mt-10 mb-10 border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          {errors.otp && (
            <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
          )}
        </div>

        <button
          onClick={handleClick}
          className="w-full mt-6 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Verify OTP
        </button>

        <button
          onClick={resendOtp}
          disabled={isDisabled}
          className={`w-full mt-4 py-2 px-4 ${
            isDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-md transition duration-200`}
        >
          {isDisabled ? `Resend OTP in ${seconds}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default Otp;
