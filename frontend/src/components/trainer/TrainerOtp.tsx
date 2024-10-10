import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../app/store';

interface Errors {
    otp?: string;
  }

function TrainerOtp() {
    const [otp, setOtp] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({});

    const location = useLocation();
    const trainerData = location.state;

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

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

    // if (userData) {
      
    //     dispatch(verifyOtp({ userData, otp })).then((res) => {
    //       if (res.meta.requestStatus === "fulfilled") {
    //         setOtpVerified(true);
    //         toast.success("Registration successful");
    //       }
    //     });
    //   }
    }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
    {/* <Toaster /> */}
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

      {/* <button
        onClick={resendOtp}
        disabled={isDisabled}
        className={`w-full mt-4 py-2 px-4 ${
          isDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } text-white rounded-md transition duration-200`}
      >
        {isDisabled ? `Resend OTP in ${seconds}s` : "Resend OTP"}
      </button> */}
    </div>
  </div>
  )
}

export default TrainerOtp