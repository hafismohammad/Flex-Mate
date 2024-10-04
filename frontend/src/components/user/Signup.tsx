import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { registerUser } from "../../actions/userAction";
import { User } from "../../features/user/userTypes";
import bg_img from "../../assets/signup-img.jpg";
import logo from "../../assets/logo_1 (2).png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  cpassword?: string;
}

const Signup = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errors, setErrors] = useState<Errors>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  console.log("userInfo register------------->", userInfo);
  
  const validate = (): Errors => {
    const newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name = "Please fill the name field";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
        newErrors.email = "Please fill the email field";
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Valid email is required";
      }

    if (!phone.trim()) {
      newErrors.phone = "Please fill the phone field";
    } else if (!phone.match(/^\d{10}$/)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!password.trim()) {
      newErrors.password = "Please fill the password field";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const clearErrors = () => {
    setTimeout(() => {
      setErrors({});
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      clearErrors();
      return;
    }

    setErrors({});

    const userData: User = {
      name,
      email,
      phone,
      password,
    };

    // Dispatch the action to register the user
    dispatch(registerUser(userData));
    navigate("/user/otp", { state: userData });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row w-full max-w-4xl">
        {/* Left Section */}
        <div
          className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bg_img})`,
          }}
        >
          <h1 className="text-xl md:text-2xl font-bold text-white text-center">
            Welcome to FlexMate
          </h1>
          <p className="text-white text-center">
            Your platform for flexible work solutions.
          </p>
        </div>
  
        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto" style={{ maxHeight: '90vh' }}>
          {/* Center the logo */}
          <div className="flex justify-center">
            <img src={logo} alt="Logo" className="w-40 h-40" />
          </div>
  
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (<p className="text-red-500 text-sm mt-1">{errors.name}</p>)}
            </div>
  
            <div className="mt-4">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
  
            <div className="mt-4">
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
  
            <div className="mt-4">
              <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
  
            <button
              type="submit"
              className="w-full mt-6 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Register
            </button>
            <div className="text-center mt-4">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to='/user/login' className="text-blue-500 hover:underline">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default Signup;
