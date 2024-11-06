import React, { useEffect, useState } from "react";
import bgImage from "../../assets/trainers-tablet.jpg";
import axiosInstance from "../../../axios/trainerAxiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaCamera } from "react-icons/fa";

interface FormData {
  profileImage: string | File; 
  name: string;
  email: string;
  phoneNumber: string;
  yearsOfExperience: number;
  gender: string;
  language: string;
  dailySessionLimit: number;
}

const EditTrainerProfile: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    profileImage: "",
    name: "",
    email: "",
    phoneNumber: "",
    yearsOfExperience: 0,
    gender: "",
    language: "",
    dailySessionLimit: 0,
  });

  const navigate = useNavigate();
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const trainerId = trainerInfo.id;

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/trainer/getTrainer/${trainerId}`
        );
        console.log("Trainer Data Response:", response.data);
        const trainerData = response.data.trainerData;
  
        setFormData({
          profileImage: trainerData[0].profileImage || "",
          name: trainerData[0].name || "",
          email: trainerData[0].email || "",
          phoneNumber: trainerData[0].phone || "",
          yearsOfExperience: trainerData[0].yearsOfExperience || 0,
          gender: trainerData[0].gender || "",
          language: trainerData[0].language || "",
          dailySessionLimit: trainerData[0].dailySessionLimit || 0,
        });
      } catch (err) {
        setError("Failed to load trainer data");
        console.error("Error fetching trainer data:", err);
      }
    };
    fetchTrainer();
  }, [trainerId]);
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prevData) => ({
        ...prevData,
        profileImage: file,
      }));
    } else {
      console.log('File not received');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedData = new FormData();
    updatedData.append("name", formData.name);
    updatedData.append("email", formData.email);
    updatedData.append("phoneNumber", formData.phoneNumber);
    updatedData.append("yearsOfExperience", formData.yearsOfExperience.toString());
    updatedData.append("gender", formData.gender);
    updatedData.append("language", formData.language);
    updatedData.append("dailySessionLimit", formData.dailySessionLimit.toString());

    // Append profile image only if it's a file
    if (formData.profileImage instanceof File) {
      updatedData.append("profileImage", formData.profileImage);
    }

    try {
      const response = await axiosInstance.patch(
        `/api/trainer/updateTrainerData/${trainerId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message === "Trainer updated successfully") {
        toast.success("Profile updated successfully");

        setTimeout(() => {
          navigate("/trainer/profile");
        }, 1500);
      } else {
        toast.error("Profile update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <Toaster />
      <div className="w-full max-w-4xl mb-8 flex flex-col items-start md:flex-row md:justify-between gap-4 px-4">
        <h2 className="text-4xl font-bold text-gray-800">Trainer Profile</h2>
      </div>

      <form onSubmit={handleProfileUpdate}>
        <div className="bg-white flex flex-col items-center rounded-md relative w-full max-w-4xl overflow-hidden">
          <img
            src={bgImage}
            alt="Background"
            className="w-full h-64 object-cover rounded-t-md"
          />
          
          <div className="absolute top-36 md:top-44 left-8 md:left-12 flex items-center justify-center">
            <img
              src={
                typeof formData.profileImage === "string"
                  ? formData.profileImage
                  : URL.createObjectURL(formData.profileImage)
              }
              alt="Profile"
              className="w-40 h-40 rounded-full bg-slate-500 object-cover border-4 border-white shadow-lg"
            />
          </div>

          <div className="absolute top-36 md:top-80 left-8 md:left-48 flex items-center justify-center">
            <label htmlFor="profileImageInput">
              <FaCamera className="text-gray-600" size={18} />
            </label>
            <input
              type="file"
              id="profileImageInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="mt-32 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="p-3 border border-gray-300 bg-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="p-3 border border-gray-300 bg-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="p-3 border border-gray-300 bg-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              placeholder="Years of Experience"
              className="p-3 border border-gray-300 bg-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-3 border border-gray-300 bg-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="p-3 border border-gray-300 bg-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Language</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="mandarin">Mandarin</option>
            </select>
            <input
              name="dailySessionLimit"
              type="number"
              value={formData.dailySessionLimit}
              onChange={handleChange}
              placeholder="Daily Session Limit"
              className="p-3 border border-gray-300 bg-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTrainerProfile;
