import React, { useEffect, useState } from "react";
import bgImage from "../../assets/trainers-tablet.jpg";
import axiosInstance from "../../axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface FormData {
    name: string;
    email: string;
    phoneNumber: string;
    yearsOfExperience: number;
    gender: string;
    language: string;
}

interface Specialization {
    name: string;
}

interface TrainerProfileData {
    name: string;
    email: string;
    phone: string;
    specialization: Specialization;
    gender: string; // Add this if it's part of the response
    experience: string; // Add this if it's part of the response
    language: string; // Add this if it's part of the response
}

const EditTrainerProfile: React.FC = () => {
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phoneNumber: "",
        yearsOfExperience: 0,
        gender: "",
        language: "",
    });

    const {trainerInfo} = useSelector((state: RootState) => state.trainer)
    const trainerId = trainerInfo.id

    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                const response = await axiosInstance.get(`/api/trainer/getTrainer/${trainerId}`);
                const trainerData = response.data.trainerData;
             
    
                // Set form data to the fetched trainer data
                setFormData({
                    name: trainerData.name || '',
                    email: trainerData.email || '',
                    phoneNumber: trainerData.phone || '',
                    yearsOfExperience: trainerData.yearsOfExperience || 0,
                    gender: trainerData.gender || '',
                    language: trainerData.language || ''
                });
            } catch (err) {
                setError('Failed to load trainer data');
            } 
        };
        fetchTrainer();
    }, [trainerId]);
    
    
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            console.log(formData);
            
            
            const response = await axiosInstance.patch(`/api/trainer/updateTrainerData/${trainerId}`, formData);
            console.log("Profile updated successfully:", response.data);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center">
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
                            src=""
                            alt="Profile"
                            className="w-40 h-40 rounded-full bg-slate-500 object-cover border-4 border-white shadow-lg"
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
                            <option value="non-binary">Non-binary</option>
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
                    </div>

                    <button
                        type="submit"
                        className="mt-4 mb-8 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                    >
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTrainerProfile;
