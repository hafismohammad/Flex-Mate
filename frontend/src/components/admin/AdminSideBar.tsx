import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import LOGO from '../../assets/LOGO-2.png';
import { FaBars, FaTimes, FaChartPie, FaUser, FaCog, FaUserCircle, FaSignOutAlt, FaCheckCircle } from 'react-icons/fa';

function AdminSideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`h-screen bg-blue-800 text-white flex flex-col p-4 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-16' 
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none mb-4 flex justify-end"
        >
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {isSidebarOpen && (
          <div className="flex items-center justify-center mb-6">
            <img className='w-[70%] h-[100%]' src={LOGO} alt="Logo" />
          </div>
        )}

        <nav className="flex flex-col space-y-4">
          <Link
            to="/admin/" 
            className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
          >
            <FaChartPie size={20} />
            <span className={`ml-2 ${!isSidebarOpen && 'hidden'}`}>Dashboard</span>
          </Link>
          <Link
            to="/admin/verification" 
            className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
          >
            <FaCheckCircle size={20} />
            <span className={`ml-2 ${!isSidebarOpen && 'hidden'}`}>Verification</span>
          </Link>
          <Link
            to="#" 
            className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
          >
            <FaUser size={20} />
            <span className={`ml-2 ${!isSidebarOpen && 'hidden'}`}>Users</span>
          </Link>
          <Link
            to="#" 
            className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
          >
            <FaUserCircle size={20} />
            <span className={`ml-2 ${!isSidebarOpen && 'hidden'}`}>Trainers</span>
          </Link>
          <Link
            to="#" 
            className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
          >
            <FaCog size={20} />
            <span className={`ml-2 ${!isSidebarOpen && 'hidden'}`}>Settings</span>
          </Link>
          <Link
            to="/logout" 
            className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
          >
            <FaSignOutAlt size={20} />
            <span className={`ml-2 ${!isSidebarOpen && 'hidden'}`}>Logout</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default AdminSideBar;
