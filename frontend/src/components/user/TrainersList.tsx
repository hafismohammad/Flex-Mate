import axios from "axios";
import { useEffect, useState } from "react";
import API_URL from "../../../axios/API_URL";

interface Specialization {
  name: string;
  description: string;
}

interface Trainer {
  _id: string;
  name: string;
  email: string;
  phone: number;
  specialization: Specialization;
  imageUrl?: string;
  isBlocked: boolean;
  kycStatus: string;
}

function TrainersList() {
  const [trainersData, setTrainersData] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchAllTrainers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/allTrainers`);
        setTrainersData(response.data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchAllTrainers();
  }, []);

  // Filter trainers based on the search term
  const filteredTrainers = trainersData.filter((trainer) =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialization.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mt-7 mb-16 flex justify-center">
        <input
          type="text"
          placeholder="Search Trainers"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border w-[60%] border-gray-300 rounded-lg shadow-sm focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredTrainers.map((trainer: Trainer) => (
          <div
            key={trainer._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden mb-5  transform transition duration-300 hover:-translate-y-7"
          >
            <img alt={trainer.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {trainer.name}
              </h3>
              <p className="text-gray-600">{trainer.specialization.name}</p>
              <p className="text-gray-600">{trainer.specialization.description}</p>
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainersList;
