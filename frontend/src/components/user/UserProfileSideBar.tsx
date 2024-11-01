import React from 'react';
import { Link } from 'react-router-dom';

function UserProfileSideBar() {
  return (
    <div className="w-[20%]">
      <nav className="flex flex-col space-y-4">
        <div className="flex justify-center">
          <img
            src=""
            alt="profile"
            className="bg-black mt-9 px-16 py-20 rounded-full"
          />
        </div>
        <div className='flex justify-center'>
        <h1>John Doe</h1>
        </div>
        <Link
          to="sessions"
          className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
        >
          <span>Sessions</span>
        </Link>
        <Link
          to="dashboard"
          className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
        >
          <span>Dashboard</span>
        </Link>
        <Link
          to=""
          className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition"
        >
          <span>User Details</span>
        </Link>
      </nav>
    </div>
  );
}

export default UserProfileSideBar;
