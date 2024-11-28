import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import LOGO from "../../assets/LOGO-2.png";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import ProfileIcon from '../../assets/profile-icon.png';
import { logoutUser } from '../../actions/userAction';
import userAxiosInstance from "../../../axios/userAxionInstance";
import  { BsBell } from "react-icons/bs";


function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const { userInfo, token } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    dispatch(logoutUser()); 
    navigate("/login");
  };

  // Fetch user image if logged in
  useEffect(() => {
    if (!userInfo?.id) return;

    const fetchUserDetails = async () => {
      try {
        const response = await userAxiosInstance.get(`/api/user/users/${userInfo?.id}`);
        setImage(response.data.image);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };
    fetchUserDetails();
  }, [userInfo?.id]);

  return (
<header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center bg-blue-800 text-white p-4 shadow-xl">

      <div>
        <Link to="/">
          <img src={LOGO} alt="Logo" className="w-max h-7" />
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Nav Links */}
      <nav className={`${isOpen ? 'block' : 'hidden'} md:flex space-x-8`}>
        <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
          <li>
            <Link to="/" className="hover:text-gray-300">Home</Link>
          </li>
          <li>
            <Link to="/aboutUs" className="hover:text-gray-300">About</Link>
          </li>
          <li>
            <Link to="/trainers" className="hover:text-gray-300">Trainers</Link>
          </li>
          <li>
            <Link to="#" className="hover:text-gray-300">Contact</Link>
          </li>
        </ul>
      </nav>


  
      <div className="relative hidden md:block">
        {token ? (
        <div className="flex items-center justify-between space-x-4">
        <div className="relative">
          {/* <BsBell className="h-6 w-6 text-white cursor-pointer" /> */}
          {/* <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
            3 
          </span> */}
        </div>
      
        {/* User Profile */}
        <div className="relative">
          <img
            alt="user profile"
            src={image || ProfileIcon}
            className="h-10 w-10 cursor-pointer rounded-full object-cover"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          />
          {isProfileMenuOpen && (
            <ul
              role="menu"
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white text-gray-800"
            >
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="/profile">My Profile</Link>
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>
      
        ) : (
          <Link
            to="/login"
            className="bg-white hover:bg-slate-200 text-blue-800 px-4 py-2 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
