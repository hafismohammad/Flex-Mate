import React from 'react'
import { Outlet } from 'react-router-dom'
import UserProfileSideBar from './UserProfileSideBar'
import Header from './Header'

function UserLayout() {
  return (
    <div className='flex h-screen  mt-16'>
        <UserProfileSideBar />
       <div>
        <Header />
       </div>
         <div className="flex-1 p-4 bg-blue-50 overflow-y-auto ">
          <Outlet /> 
        </div>
    </div>
  )
}

export default UserLayout