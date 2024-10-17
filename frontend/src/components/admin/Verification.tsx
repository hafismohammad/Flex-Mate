import React, { useEffect, useState } from "react";
import { FaFileAlt , FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { addSpecialization } from '../../actions/adminAction';
import axios from "axios";
import API_URL from "../../../axios/API_URL";
import { Link, useNavigate } from "react-router-dom";

interface Trainer {
  id: string; 
  name: string;
  email: string;
  kycSubmissionDate: string; 
  status: string;
}

interface Errors {
  name?: string;
  description?: string;
}

function Verification() {
  const [trainersKycData, setTrainersKycData] = useState<Trainer[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const getAllTrainersKycData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/allTrainerKyc`);
        const trainersData: Trainer[] = response.data.data.map((trainer: any) => ({
          id: trainer._id, 
          name: trainer.name,
          email: trainer.email,
          kycSubmissionDate: trainer.kycData?.kycSubmissionDate , 
          status: trainer.kycData?.status || "Pending", 
        }));
        setTrainersKycData(trainersData);
      } catch (error) {
        console.error('Error fetching KYC data:', error);
      }
    };
    getAllTrainersKycData(); 
  }, []); 

  const filteredTrainers = trainersKycData.filter((trainer) =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (trainerId: string) => {
    
    navigate(`/admin/trainerView/${trainerId}`);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-4xl font-bold text-gray-800">Trainer Verification</h2>
        <input
          type="text"
          placeholder="Search Trainers"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1 text-white bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <FaPlus />
          <span>Add Specialization</span>
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-6 text-lg font-semibold text-gray-600 mb-4 border-b border-gray-200 pb-2">
          <div>Trainer ID</div>
          <div>Name</div>
          <div>Email</div>
          <div>Date</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {filteredTrainers.length > 0 ? (
          filteredTrainers.map((trainer) => (
            <div
              key={trainer.id}
              className="grid grid-cols-6 items-center p-4 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-none"
            >
              <div className="text-gray-800 font-medium">34567</div>
              <div className="text-gray-800">{trainer.name}</div>
              <div className="text-gray-800">{trainer.email}</div>
              <div className="text-gray-800">{new Date(trainer.kycSubmissionDate).toDateString()}</div>
              <div className="text-orange-500 font-medium">{trainer.status}</div>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => handleView(trainer.id)}
                  className="flex items-center space-x-1 text-white bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <FaFileAlt />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-6">
            No trainers found.
          </div>
        )}
      </div>

      {/* Modal code can remain the same */}
    </div>
  );
}

export default Verification;
