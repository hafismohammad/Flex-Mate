import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import LOGO from "../../assets/LOGO-2.png";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import ProfileIcon from '../../assets/profile-icon.png'
import {logoutUser} from '../../actions/userAction'
import userAxiosInstance from "../../../axios/userAxionInstance";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null)

  
  const { userInfo, token } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();




  // Logout handler
  const handleLogout = () => {
    dispatch(logoutUser()); 
    navigate("/login");
  };

  useEffect(() => {
    if (!userInfo?.id) return;

    const fetchUserDetails = async () => {
      try {
        const response = await userAxiosInstance.get(`/api/user/getUser/${userInfo?.id}`);
        
        setImage(response.data.image);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };
    fetchUserDetails();
  }, [userInfo?.id]);

  return (
<header className="fixed top-0 left-0 w-full flex justify-between items-center bg-blue-800 text-white p-4 z-50 shadow-xl">
  <div>
    <Link to="/">
      <img src={LOGO} alt="Logo" className="w-max h-7" />
    </Link>
  </div>

  <div className="md:hidden">
    <button onClick={() => setIsOpen(!isOpen)} className="text-white">
      {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
    </button>
  </div>

  <nav className={`hidden md:flex space-x-8 ${isOpen ? 'block' : ''}`}>
    <ul className="flex space-x-8">
      <li>
        <Link to="/" className="hover:text-gray-300">Home</Link>
      </li>
      <li>
        <Link to="#" className="hover:text-gray-300">About</Link>
      </li>
      <li>
        <Link to="/trainers" className="hover:text-gray-300">Trainers</Link>
      </li>
      <li>
        <Link to="#" className="hover:text-gray-300">Contact</Link>
      </li>
    </ul>
  </nav>

  <div className="hidden md:block relative">
    {token ? (
      <div>
        <img
          alt="user profile"
          src={ image||ProfileIcon}
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
            {/* <li className="px-4 py-2 hover:bg-gray-100">
              <Link to="/edit-profile">Edit Profile</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100">
              <Link to="/inbox">Sessions</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100">
              <Link to="/help">Help</Link>
            </li> */}
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
              Logout
            </li>
          </ul>
        )}
      </div>
    ) : (
      <Link
        to="/login"
        className="bg-white hover:bg-slate-200 text-blue-800 px-4 py-2 rounded"
      >
        Get Started
      </Link>
    )}
  </div>
</header>

  );
}

export default Header;
