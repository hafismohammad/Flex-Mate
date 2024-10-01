import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { registerUser } from "../../actions/userAction";
import { User } from "../../features/user/userTypes";

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  cpassword?: string;
}

const Signup: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCpassword] = useState<string>("");

  const [errors, setErrors] = useState<Errors>({});

  const dispatch = useDispatch<AppDispatch>();

  const { userInfo, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  const validate = (): Errors => {
    const newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name = "Please fill the name field";
    }

    if (!email.trim()) {
      newErrors.email = "Please fill the email field";
    } else if (!email.includes("@")) {
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

    if (!cpassword.trim()) {
      newErrors.cpassword = "Please fill the confirm password field";
    } else if (password !== cpassword) {
      newErrors.cpassword = "Passwords do not match";
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
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-10/12 md:w-8/12 bg-white rounded-xl shadow-lg overflow-hidden flex flex-row">
        {/* Left section: Image/Logo */}
        <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-gray-50">
          <img
            src="path/to/your/logo.png" // Replace with your logo image path
            alt="FlexMate Logo"
            className="w-32 h-auto mb-4"
          />
          <h1 className="text-2xl font-bold">Welcome to FlexMate</h1>
          <p>Your platform for flexible work solutions.</p>
        </div>

        {/* Right section: Registration Form */}
        <div
          className="w-1/2 p-8 overflow-y-auto"
          style={{ maxHeight: "90vh" }}
        >
          <h1 className="text-2xl font-bold mb-4">Register</h1>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mt-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="mt-4">
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mt-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mt-4">
              <input
                type="password"
                placeholder="Confirm Password"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              {errors.cpassword && (
                <p className="text-red-500 text-sm mt-1">{errors.cpassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
