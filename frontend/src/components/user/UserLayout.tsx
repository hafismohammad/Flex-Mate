import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import UserProfileSideBar from './UserProfileSideBar';
import Header from './Header';

function UserLayout() {
  const servicesRef = useRef<HTMLDivElement>(null);
  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="flex h-screen bg-blue-50">
      <UserProfileSideBar />
      <div className="flex-1">
        <Header scrollToServices={scrollToServices} />
        <div className="pt-16 p-4 overflow-y-auto h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserLayout;
