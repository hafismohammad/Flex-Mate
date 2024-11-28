import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import LOGO from "../../assets/LOGO-2.png";
import { useDispatch } from "react-redux";
import {logoutTrainer} from '../../actions/trainerAction'
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaAddressBook } from "react-icons/fa6";

import {
  FaBars,
  FaListAlt,
  FaTimes,
  FaChartPie,
  FaUser,
  FaSignOutAlt,
  FaWallet
} from "react-icons/fa";
import { AppDispatch } from "../../app/store";
import { useSocketContext } from "../../context/Socket";

function TrainerSidebar() {
  const {socket} = useSocketContext()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [hasMessage, setHasMessage] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); 
    dispatch(logoutTrainer());
    navigate('/trainer/login'); 
  };

  useEffect(() => {
    
    socket?.on('messageUpdate', (data) => {
      console.log('messageUpdate ---',data);
      if(data) {
        setHasMessage(true)
      }
    })
  },[socket])

  const handleClick = () => {
    setHasMessage(false)
  }

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
          to="/trainer/currentSchedules"
          className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
        >
          <FaListAlt size={20} />
          <span className={`ml-2 ${!isSidebarOpen && "hidden"}`}>
          Current Schedules 
          </span>
        </Link>

        <Link
          to="/trainer/bookings"
          className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
        >
          <FaAddressBook size={20} />
          <span className={`ml-2 ${!isSidebarOpen && "hidden"}`}>
            Bookings 
          </span>
        </Link>

        <Link
          to="/trainer/chat-sidebar"
          className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
        >
          <IoChatbubbleEllipsesSharp size={20} />
          <span onClick={handleClick} className={`ml-2 mr-2 ${!isSidebarOpen && "hidden"}`}>
           Message 
          </span>
         {/* {hasMessage === true ?
          <div className="px-2 py-2 rounded-full bg-red-500" />
          : ''
         } */}
        </Link>
        
        <Link
          to="/trainer/profile"
          className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
        >
          <FaUser size={20} />
          <span className={`ml-2 ${!isSidebarOpen && "hidden"}`}>Profile</span>
        </Link>

        <Link
          to="/trainer/wallet"
          className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
        >
          <FaWallet size={20} />
          <span className={`ml-2 ${!isSidebarOpen && "hidden"}`}>wallet</span>
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
