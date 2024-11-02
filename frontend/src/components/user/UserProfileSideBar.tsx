import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../actions/userAction';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import userAxiosInstance from '../../../axios/userAxionInstance';
import toast from 'react-hot-toast';


function UserProfileSideBar() {
  const [selectImage, setSelectedImage] = useState<File | null>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();


  const handleLogout = () => {
    dispatch(logoutUser()); 
    navigate("/login");
  };

  const handleImageUpdate = async () => {
    if(!selectImage) {
      toast.error('Please select an image first')
      return
    }
    const formData = new FormData();
    formData.append('image', selectImage)

    try {
      const response = await userAxiosInstance.patch('api/user/uploadProfileImage', formData)
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Failed to upload profile image");
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
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
          {!selectImage ? (
            <>
            <label htmlFor="profileImage" className="text-gray-800 hover:text-gray-950 cursor-pointer">
            Update Photo
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
            </>
          ): 
          (

            <button onClick={handleImageUpdate} className="text-gray-800 cursor-pointer hover:text-gray-950">Upload</button>
          )
          }
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
