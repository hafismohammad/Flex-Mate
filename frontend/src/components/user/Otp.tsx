import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { useLocation, useParams } from "react-router-dom";
import { verifyOtp } from "../../actions/userAction";

interface Errors {
  otp?: string;
}

const Otp: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  // Get the email from the URL
  const location = useLocation();
  const userData = location.state;

  const dispatch = useDispatch<AppDispatch>();
  // const { userInfo, loading, error } = useSelector((state: RootState) => state.user);
  // This will now show the email from the route

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

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
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
      </div>
    </div>
  );
};

export default Otp;
