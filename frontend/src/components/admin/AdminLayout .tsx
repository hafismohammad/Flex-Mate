// src/components/AdminLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';

function AdminLayout() {
  return (
    <div className="flex">
      <AdminSideBar />
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
