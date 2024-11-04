import React from 'react';
import { Outlet } from 'react-router-dom';
import UserProfileSideBar from './UserProfileSideBar';
import Header from './Header';

function UserLayout() {
  return (
    <div className='flex h-screen bg-blue-50 mt-16'>
      <UserProfileSideBar />
      <div className="flex-1">
        <Header />
        <div className="p-4 overflow-y-auto h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserLayout;
