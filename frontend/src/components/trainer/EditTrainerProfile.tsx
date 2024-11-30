import React, { useEffect, useState } from "react";
import bgImage from "../../assets/trainers-tablet.jpg";
import axiosInstance from "../../../axios/trainerAxiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import API_URL from "../../../axios/API_URL";

interface FormData {
  profileImage: string | File;
  name: string;
  email: string;
  phoneNumber: string;
  yearsOfExperience: number;
  gender: string;
  language: string;
  specializations: string[];
  about: string;
}

const EditTrainerProfile: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [allSpecializations, setAllSpecializations] = useState<
    { name: string; _id: string }[]
  >([]);
  const [formData, setFormData] = useState<FormData>({
    profileImage: "",
    name: "",
    email: "",
    phoneNumber: "",
    yearsOfExperience: 0,
    gender: "",
    language: "",
    specializations: [],
    about: "",
  });

  const navigate = useNavigate();
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const trainerId = trainerInfo.id;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/trainer/${trainerId}`
        );
        const trainerData = response.data.trainerData[0];

        setFormData({
          profileImage: trainerData.profileImage || "",
          name: trainerData.name || "",
          email: trainerData.email || "",
          phoneNumber: trainerData.phone || "",
          yearsOfExperience: trainerData.yearsOfExperience || 0,
          gender: trainerData.gender || "",
          language: trainerData.language || "",
          specializations: trainerData.specializations || [],
          about: trainerData.about || "",
        });
      } catch (err) {
        setError("Failed to load trainer data");
        console.error("Error fetching trainer data:", err);
      }
    };
    fetchTrainer();
  }, [trainerId]);

  useEffect(() => {
    const getAllSpecializations = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/trainer/specializations`
        );
        setAllSpecializations(response.data.data);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };
    getAllSpecializations();
  }, []);

  const handleSpecializationToggle = (specializationId: string) => {
    setFormData((prevData) => ({
      ...prevData,
      specializations: prevData.specializations.includes(specializationId)
        ? prevData.specializations.filter((id) => id !== specializationId)
        : [...prevData.specializations, specializationId],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
      console.log("File not received");
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
    updatedData.append("about", formData.about);  

    // Append profile image only if it's a file
    if (formData.profileImage instanceof File) {
      updatedData.append("profileImage", formData.profileImage);
    }

    formData.specializations.forEach((specializationId) => {
      updatedData.append("specializations[]", specializationId);
    })

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

      <form onSubmit={handleProfileUpdate} className="w-full max-w-4xl">
        <div className="bg-white flex flex-col items-center rounded-md relative w-full overflow-hidden">
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
            <label htmlFor="profileImageInput" className="cursor-pointer">
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

          <div className="mt-32 w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
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
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              placeholder="Years of Experience"
              className="p-3 border border-gray-300 bg-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="p-3 border border-gray-300 bg-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Language
              </option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="mandarin">Mandarin</option>
            </select>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-3 border border-gray-300 bg-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer Not to Say</option>
            </select>
            <div className="col-span-2 flex flex-col">
              <label htmlFor="about" className="font-medium mb-2">
                About
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Write something about yourself..."
                className="p-3 border border-gray-300 bg-slate-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                rows={4}
              />
            </div>
            <div className="col-span-2 flex flex-col">
              <label htmlFor="specializations" className="mb-2 font-medium">
                Specializations
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allSpecializations.map((specialization) => (
                  <div
                    key={specialization._id}
                    className={`flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-md cursor-pointer ${
                      formData.specializations.includes(specialization._id)
                        ? "bg-blue-100 border-blue-400"
                        : ""
                    }`}
                    onClick={() =>
                      handleSpecializationToggle(specialization._id)
                    }
                  >
                    <input
                      type="checkbox"
                      checked={formData.specializations.includes(
                        specialization._id
                      )}
                      readOnly
                      className="hidden"
                    />
                    <span className="text-gray-700 text-sm">
                      {specialization.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="my-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTrainerProfile;
