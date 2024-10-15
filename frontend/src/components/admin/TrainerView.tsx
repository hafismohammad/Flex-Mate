import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaUser, FaFileAlt, FaCheck, FaTimes } from 'react-icons/fa';
import API_URL from '../../../axios/API_URL';
import { useParams } from 'react-router-dom';

interface Trainer {
  id: string; 
  name: string;
  email: string;
  kycSubmissionDate: string; 
  status: string;
  comments: string;
  documents: string[];
}

function TrainerView() {
  const [trainer, setTrainer] = useState<Trainer | null>(null); 
  
  const { trainerId } = useParams(); 

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/trainerKycDetails/${trainerId}`);
        const trainerData = response.data.data;

        // Map the API data to your trainer structure
        const trainerDetails: Trainer = {
          id: trainerData._id,
          name: trainerData.name,
          email: trainerData.email,
          kycSubmissionDate: trainerData.kycData?.kycSubmissionDate || "N/A",
          status: trainerData.kycData?.status || "Pending",
          comments: trainerData.kycData?.comments || "No comments available",
          documents: trainerData.documents || [],
        };

        setTrainer(trainerDetails);

        console.log(trainer);
        
      } catch (error) {
        console.error('Error fetching trainer data:', error);
      }
    };

    fetchTrainerDetails();
  }, []);

  const handleStatusChange =async (newStatus: string) => {
    try {
      await axios.patch(`${API_URL}/api/admin/updateKycStatus/${trainerId}`,{ status: newStatus })
    } catch (error) {
      console.error('Error updating trainer status:', error);
    }
  }
    
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">Trainer Details</h2>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <FaUser className="text-2xl text-gray-700 mr-2" />
          <h3 className="text-xl font-semibold">John Doe</h3>
        </div>
        <p className="text-gray-600">john.doe@gmail.com</p>
      </div>

      <div className="mb-6 border-t border-gray-300 pt-4">
        <h4 className="font-medium text-lg mb-2">KYC Information</h4>
        <p className="text-sm text-gray-500">KYC Submission Date: 10/13/2024</p>
        <p className="text-sm text-gray-500">Status: Pending</p>
        <p className="text-sm text-gray-500">Comments: New trainer from Ernakulam</p>
      </div>

      <div className="mb-6 border-t border-gray-300 pt-4">
        <h4 className="font-medium text-lg mb-2">Documents</h4>
        <div className="flex flex-col space-y-2">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center"
          >
            <FaFileAlt className="mr-1" /> Document 1
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center"
          >
            <FaFileAlt className="mr-1" /> Document 2
          </a>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => handleStatusChange('approved')}
          className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FaCheck className="mr-1" /> Approve
        </button>
        <button
        onClick={() => handleStatusChange('reject')}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FaTimes className="mr-1" /> Reject
        </button>
      </div>
    </div>
  );
}

export default TrainerView;