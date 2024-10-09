// src/components/AdminLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';

function AdminLayout() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      {/* <header className="bg-blue-800 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
          <span className="mr-4">Welcome, Admin!</span>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded"
            onClick={() => console.log('Logout action')}
          >
            Logout
          </button>
        </div>
      </header> */}

      {/* Main Content */}
      <div className="flex flex-1">
        <AdminSideBar />
        <div className="flex-1 p-6 bg-slate-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
