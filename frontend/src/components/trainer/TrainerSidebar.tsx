import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import LOGO from "../../assets/LOGO-2.png";
import { useDispatch } from "react-redux";
import { adminLogout } from '../../actions/adminAction';
import {
  FaBars,
  FaListAlt,
  FaTimes,
  FaChartPie,
  FaUser,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";
import { AppDispatch } from "../../app/store";

function TrainerSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); 
    dispatch(adminLogout());
    navigate('/trainer/login'); 
  };

  return (
    <div className={`h-screen bg-blue-800 text-white flex flex-col p-4 shadow-md transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} sticky top-0`}>
      <button
        onClick={toggleSidebar}
        className="text-white focus:outline-none mb-4 flex justify-end"
      >
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {isSidebarOpen && (
        <div className="flex items-center justify-center mb-6">
          <img className="w-[70%] h-[100%]" src={LOGO} alt="Logo" />
        </div>
      )}

      <nav className="flex flex-col space-y-4">
        <Link
          to="/trainer"
          className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
        >
          <FaChartPie size={20} />
          <span className={`ml-2 ${!isSidebarOpen && "hidden"}`}>
            Dashboard
          </span>
        </Link>
        <Link
          to="/trainer/bookings"
          className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
        >
          <FaListAlt size={20} />
          <span className={`ml-2 ${!isSidebarOpen && "hidden"}`}>
            Bookings 
          </span>
        </Link>
        
        <Link
          to="/trainer/profile"
          className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
        >
          <FaUser size={20} />
          <span className={`ml-2 ${!isSidebarOpen && "hidden"}`}>Profile</span>
        </Link>
        
        <Link
          to="#"
          className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
        >
          <FaCog size={20} />
          <span className={`ml-2 ${!isSidebarOpen && "hidden"}`}>
            Settings
          </span>
        </Link>
        
        <a
          href="#" // Using <a> to trigger the logout action
          onClick={handleLogout}
          className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition cursor-pointer"
        >
          <FaSignOutAlt size={20} />
          <span className={`ml-2 ${!isSidebarOpen && "hidden"}`}>
            Logout
          </span>
        </a>
      </nav>
    </div>
  );
}

export default TrainerSidebar;
