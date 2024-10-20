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

 

  return (
    <div className="flex h-screen">
      <TrainerSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-blue-800  text-white shadow-md py-4 px-6 flex items-center justify-between">
          <div className="relative ml-auto">
            <button
              className="flex items-center focus:outline-none"
              onClick={toggleProfileDropdown}
            >
              <FaUserCircle className="text-2xl" />
            </button>
           
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
