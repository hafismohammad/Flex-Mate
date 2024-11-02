import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../actions/userAction";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import userAxiosInstance from "../../../axios/userAxionInstance";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import profileDummy from '../../assets/profile-dummy.webp'


function UserProfileSideBar() {
  const [selectImage, setSelectedImage] = useState<File | null>(null);
  const [preview , setPreview] = useState<string | null>(null)

  const {userInfo} = useSelector((state: RootState) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    if (!userInfo?.id) return;

    const fetchUserDetails = async () => {
      try {
        const response = await userAxiosInstance.get(`/api/user/getUser/${userInfo?.id}`);
        // console.log(response);
        
        setPreview(response.data.image);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };
    fetchUserDetails();
  }, [userInfo?.id]);

  const handleImageUpdate = async () => {
    if (!selectImage) {
      toast.error("Please select an image first");
      return;
    }
    const formData = new FormData();
    formData.append("profileImage", selectImage);

    try {
      const response = await userAxiosInstance.patch(
       `/api/user/uploadProfileImage/${userInfo?.id}`,
        formData
      );
      if(response.status === 200) {
        toast.success('Profile uploaded successfully')
        setSelectedImage(null)
        // setPreview(null)
      } 
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Failed to upload profile image");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file))
    }
  };

  return (
    <div className="w-[17%] bg-blue-500 h-[75vh] mt-10 ml-10 flex flex-col items-center ">
      <nav className="flex flex-col space-y-4 w-full ">
        <div className="flex justify-center ">
          <img
            src={preview || profileDummy}
            alt="profile"
            className="bg-black mt-9 h-40 w-40 object-cover rounded-full"
          />
        </div>
        <div className="flex justify-center mt-4">
          {!selectImage ? (
            <>
              <label
                htmlFor="profileImage"
                className="text-gray-800 hover:text-gray-950 cursor-pointer"
              >
                Update Photo
              </label>
              <input
                id="profileImage"
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          ) : (
            <button
              onClick={handleImageUpdate}
              className="text-gray-800 cursor-pointer hover:text-gray-950"
            >
              Upload
            </button>
          )}
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
