import TrainerSidebar from "./TrainerSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {logoutTrainer} from '../../actions/trainerAction'

function TrainerLayout() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const dispath = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    dispath(logoutTrainer())
    navigate('/trainer/login')
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <TrainerSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="bg-blue-800  text-white shadow-md py-4 px-6 flex items-center justify-between">
          {/* Profile Dropdown */}
          <div className="relative ml-auto">
            <button
              className="flex items-center focus:outline-none"
              onClick={toggleProfileDropdown}
            >
              <FaUserCircle className="text-2xl" />
              <span className="ml-2">Profile</span>
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 text-black">
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  Edit Profile
                </a>
                <div
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </header>

    
        <div className="flex-1 p-4 bg-blue-50 overflow-y-auto">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
}

export default TrainerLayout;
