import axios from "axios";
import React, { useEffect, useState } from "react";
import API_URL from "../../../axios/API_URL";

interface Trainer {
  _id: string; 
  name: string; 
  email: string; 
  phone: number; 
  isBlocked: boolean; 
}

function TrainerListing() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/allTrainer`);
        setTrainers(response.data.trainer);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchData();
  }, []);

  const filteredTrainers = trainers.filter((trainer) =>
    trainer._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlockUnblock = async (trainerId: string, currentStatus: boolean) => {
    try {
        
      const response = await axios.patch(
        `${API_URL}/api/admin/trainer-block-unblock/${trainerId}`,
        { status: !currentStatus }
      );
  
      console.log('Server response:', response);
  
      if (response.status === 200 && response.data && response.data.data) {
        const updatedTrainerStatus = response.data.data.isBlocked;
  
        setTrainers((prevTrainers) =>
          prevTrainers.map((trainer) =>
            trainer._id === trainerId ? { ...trainer, isBlocked: updatedTrainerStatus } : trainer
          )
        );
      } else {
        console.error('Failed to update trainer status on the server.');
      }
    } catch (error) {
      console.error('Error occurred while updating trainer status:', error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-4xl font-bold text-gray-800">Trainer List</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search Trainers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-7 gap-1 text-lg font-semibold text-gray-600 mb-4 border-b border-gray-200 pb-2">
          <div>ID</div>
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Status</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {filteredTrainers.length > 0 ? (
          filteredTrainers.map((trainer) => (
            <div 
              key={trainer._id} 
              className="grid grid-cols-7 items-center p-4 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-none mb-2"
            >
              <div className="text-gray-800 font-medium">{trainer._id.toUpperCase().substring(0, 8)}</div>
              <div className="text-gray-800 font-medium">{trainer.name}</div>
              <div className="text-gray-800 font-medium truncate">{trainer.email}</div>
              <div className="text-gray-800 font-medium">{trainer.phone}</div>
              <div className={`${trainer.isBlocked ? 'font-medium text-red-500': 'font-medium text-green-500' }`}> 
                {trainer.isBlocked ? "Blocked" : "Active"}
              </div>
              <div className="col-span-2 flex justify-center space-x-4">
                <button
                  onClick={() => handleBlockUnblock(trainer._id, trainer.isBlocked)} 
                  className={`text-white py-2 px-5 rounded-md ${trainer.isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600' }`}  
                  style={{ minWidth: "100px" }} 
                >
                  {trainer.isBlocked ? 'Unblock' : 'Block'}
                </button>
                <button 
                  className="text-white py-2 px-5 rounded-md bg-blue-500 hover:bg-blue-600"  
                  style={{ minWidth: "100px" }}
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-6">No trainers found.</div>
        )}
      </div>
    </div>
  );
}

export default TrainerListing;
