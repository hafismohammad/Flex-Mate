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
  kycStatus: string; // Changed to match the API response
  kycComments: string; // Changed to match the API response
  kycDocuments: string[]; // Changed to match the API response
  specialization: string;
}

function TrainerView() {
  const [trainer, setTrainer] = useState<Trainer | null>(null); 
  const { trainerId } = useParams(); 
console.log(trainer);

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/trainerKycDetails/${trainerId}`);
        const trainerData = response.data.kycData;

        if (trainerData) {
          // Extracting the relevant data from the response
          const { trainerId: trainerInfo, kycSubmissionDate, kycStatus, kycComments, kycDocuments } = trainerData;

          setTrainer({
            id: trainerData._id,
            name: trainerInfo.name,
            email: trainerInfo.email,
            kycSubmissionDate,
            kycStatus,
            kycComments,
            kycDocuments,
            specialization: trainerInfo.specialization?.name || '',
          });
        } else {
          console.warn('No trainer data found');
        }
      } catch (error) {
        console.error('Error fetching trainer data:', error);
      } 
    };

    fetchTrainerDetails();
  }, [trainerId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await axios.patch(`${API_URL}/api/admin/updateKycStatus/${trainerId}`, { status: newStatus });
      console.log(`Trainer status updated to ${newStatus}`);
      setTrainer((prevTrainer) => prevTrainer ? { ...prevTrainer, kycStatus: newStatus } : null); 
    } catch (error) {
      console.error('Error updating trainer status:', error);
    }
  };


console.log('dfd',trainer);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">Trainer Details</h2>
      
      {trainer ? (
        <>
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FaUser className="text-2xl text-gray-700 mr-2" />
              <h3 className="text-xl font-semibold">{trainer.name}</h3>
            </div>
            <p className="text-gray-600">{trainer.email}</p>
          </div>

          <div className="mb-6 border-t border-gray-300 pt-4">
            <h4 className="font-medium text-lg mb-2">KYC Information</h4>
            <p className="text-sm text-gray-500">KYC Submission Date: {trainer.kycSubmissionDate}</p>
            <p className="text-sm text-gray-500">Status: {trainer.kycStatus}</p>
            <p className="text-sm text-gray-500">Comments: {trainer.kycComments}</p>
            <p className="text-sm text-gray-500">Specialization: {trainer.specialization}</p>
          </div>

          <div className="mb-6 border-t border-gray-300 pt-4">
            <h4 className="font-medium text-lg mb-2">Documents</h4>
            <div className="flex flex-col space-y-2">
              {trainer.kycDocuments.length > 0 ? (
                trainer.kycDocuments.map((doc, index) => (
                  <a
                  key={index}
                  href={`${API_URL}/uploads/${doc}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                  >
                    <FaFileAlt className="mr-1" /> Document {index + 1}
                  </a>
                ))
              ) : (
                <p className="text-gray-500">No documents submitted.</p>
              )}
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
              onClick={() => handleStatusChange('rejected')} 
              className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              <FaTimes className="mr-1" /> Reject
            </button>
          </div>
        </>
      ) : (
        <p>No trainer details available.</p>
      )}
    </div>
  );
}

export default TrainerView;
