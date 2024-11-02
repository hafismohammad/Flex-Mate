import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../actions/userAction';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';

function UserProfileSideBar() {

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  
  // Logout handler
  const handleLogout = () => {
    dispatch(logoutUser()); 
    navigate("/login");
  };


  return (
    <div className="w-[17%] bg-blue-500 h-[75vh] mt-10 ml-10 flex flex-col items-center ">
      <nav className="flex flex-col space-y-4 w-full ">
        <div className="flex justify-center w-full">
          <img
            src=""
            alt="profile"
            className="bg-black mt-9 px-16 py-20 rounded-full"
          />
        </div>
        <div className="flex justify-center mt-4">
          <h1>John Doe</h1>
        </div>
        <div className="w-full flex flex-col space-y-2 mt-6">
          <Link
            to="#"
            className="flex items-center pl-8 p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
          >
            <span>Profile</span>
          </Link>
          <Link
            to="#"
            className="flex items-center pl-8 p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
          >
            <span>Edit Profile</span>
          </Link>
          <Link
            to="#"
            className="flex items-center pl-8 p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
          >
            <span>Sessions</span>
          </Link>
          <Link
            to="#"
            className="flex items-center pl-8 p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
          >
            <span>Bookings</span>
          </Link>
          <Link
            to="#"
            className="flex items-center pl-8 p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
          >
            <span onClick={handleLogout}>Logout</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default UserProfileSideBar;
