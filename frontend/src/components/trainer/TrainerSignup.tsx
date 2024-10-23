import BG_IMG from "../../assets/signup-img.jpg";
import LOGO from "../../assets/LOGO-3 (2).png";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { fetchSpecializations } from "../../actions/trainerAction";
import { useSelector } from "react-redux";
import {registerTrainer} from '../../actions/trainerAction'
import toast, { Toaster } from "react-hot-toast";
import { log } from "console";

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  specialization?: string;
}

interface Specialization {
  id: string;
  name: string;
}

function TrainerSignup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>(""); 
  const [errors, setErrors] = useState<Errors>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const specializationsData = useSelector(
    (state: RootState) => state.trainer.specializations
  );
 const signupError = useSelector((state: RootState) => state.trainer.error)
  useEffect(() => {
    dispatch(fetchSpecializations());
  }, [dispatch]);

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

    if (!specialization) { 
      newErrors.specialization = "Please select a specialization";
    }

    return newErrors;
  };

  const clearErrors = () => {
    setTimeout(() => {
      setErrors({});
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);
  
    if (Object.keys(formErrors).length > 0) {
      clearErrors();
      return;
    }
  
    setErrors({});
  
    const trainerData = {
      name,
      email,
      phone,
      password,
      specialization,
    };

    // Dispatch the registration action
    await dispatch(registerTrainer(trainerData));

    // Check if there's an error related to registration
    if (!signupError) {  // Changed from checking if signupError
      console.log('signup', signupError);
      navigate("/trainer/otp", { state: trainerData }); 
    } else {
      toast.error(signupError);  // Show error using toast if it exists
    }
  };
  

  // useEffect(() => {
  //   console.log('signup',signupError);
  //   toast.error(signupError); 
    
  // },[handleSubmit])

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">
        <div
          className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-cover bg-center"
          style={{ backgroundImage: `url(${BG_IMG})` }}
        >
          <h1 className="text-xl md:text-2xl font-bold text-white text-center">
            Welcome to Flex Mate
          </h1>
          <p className="text-white text-center">
            Your platform for flexible work solutions.
          </p>
        </div>
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto" style={{ maxHeight: "90vh" }}>
          <div className="flex justify-center mb-6">
            <img src={LOGO} alt="logo" className="w-30 h-10 object-contain" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">
            Trainer Register
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="mt-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mt-4">
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="mt-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="mt-4">
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)} // Update specialization state
                className="bg-white font-normal border border-gray-300 text-gray-700 text-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200 ease-in-out hover:border-blue-500 hover:shadow-md"
              >
                <option value="" disabled>
                  Choose a Specialization
                </option>
                {specializationsData.map((specializationItem: Specialization) => (
                  <option key={specializationItem.id} value={specializationItem.id}>
                    {specializationItem.name}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>
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
                <Link to="/trainer/login" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TrainerSignup;
