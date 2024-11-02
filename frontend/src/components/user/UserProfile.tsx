import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { User } from "../../features/user/userTypes";
import userAxiosInstance from "../../../axios/userAxionInstance";
import toast, { Toaster } from "react-hot-toast";

function UserProfile() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    phone: '',
    email: '',
    password: '',
    dob: '',
    gender: '',
  });
  
  const [editOpen, setEditOpen] = useState(false);
  const userId = userInfo?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const response = await userAxiosInstance.get(`/api/user/getUser/${userId}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };
    fetchUserDetails();
  }, [userId]);

  const handleEdit = () => {
    setEditOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await userAxiosInstance.patch("/api/user/updateUser", formData);
      setEditOpen(false);
      if(response.status === 200) {
        toast.success(response.data.message)
      }
      
    } catch (error: any) {
      toast.error(error)
      console.error("Failed to update user details", error);
    }
  };

  return (
    <div className="flex justify-center mt-7">
      <Toaster />
      {!editOpen ? (
        <div className="h-[75vh] bg-white w-[75%] shadow-md rounded-md overflow-y-auto">
          <h1 className="p-5 font-bold text-2xl">Personal Information</h1>
          <div className="mt-5 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Name</label>
              <div className="border border-gray-500 p-2 rounded-md">
                <h1 className="text-gray-800">{formData.name}</h1>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <div className="border border-gray-500 p-2 rounded-md">
                <h1 className="text-gray-800">{formData.email}</h1>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Phone</label>
              <div className="border border-gray-500 p-2 rounded-md">
                <h1 className="text-gray-800">{formData.phone}</h1>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Birthday</label>
              <div className="border border-gray-500 p-2 rounded-md">
                <h1 className="text-gray-800">{formData.dob || "Not specified"}</h1>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Gender</label>
              <div className="border border-gray-500 p-2 rounded-md">
                <h1 className="text-gray-800">{formData.gender || "Not specified"}</h1>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-8">
            <button onClick={handleEdit} className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600">
              Edit
            </button>
          </div>
        </div>
      ) : (
        <div className="h-[75vh] bg-white w-[75%] shadow-md rounded-md overflow-y-auto">
          <h1 className="p-5 font-bold text-2xl">Edit Personal Information</h1>
          <form onSubmit={handleProfileUpdate}>
            <div className="mt-5 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-500 p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-500 p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border border-gray-500 p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Birthday</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                  className="border border-gray-500 p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block mb-1 font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="border border-gray-500 p-2 rounded-md w-full"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end p-8">
              <button
                type="submit"
                className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default UserProfile;