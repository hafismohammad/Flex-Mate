import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trainer } from "../../types/trainer";
import userAxiosInstance from "../../../axios/userAxionInstance";
import axios from "axios";
import API_URL from "../../../axios/API_URL";

function TrainersList() {
  const [trainersData, setTrainersData] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { specId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTrainers = async () => {
      try {
        const response = await axios.get<Trainer[]>(`${API_URL}/api/user/allTrainers`);
        const trainers = response.data;

        if (specId) {
          
          const filteredTrainers = trainers.filter((trainer) =>
            !trainer.specializations.some((spec) => spec._id === specId)
          );

          const otherTrainers = trainers.filter((trainer) =>
            trainer.specializations.some((spec) => spec._id === specId)
          );

          setTrainersData([...otherTrainers, ...filteredTrainers ]);
        } else {
          setTrainersData(trainers);
        }
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    fetchAllTrainers();
  }, [specId]);

  const filteredTrainers = trainersData.filter((trainer) =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specializations.some((spec) =>
      spec.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleTrainerProfileView = (trainerId: string) => {
    navigate(`/trainerProfileView/${trainerId}`);
  };

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
            className="bg-white shadow-lg rounded-lg overflow-hidden mb-5 hover:shadow-[0px_10px_20px_-5px_rgba(0,0,0,0.4)] duration-300 flex flex-col justify-between"
          >
            <img
              src={trainer.profileImage}
              alt="Profile"
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-grow flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800">
                {trainer.name}
              </h3>
              <div className="text-gray-600 flex justify-start mt-3 space-x-2">
                {trainer.specializations.map((spec) => (
                  <p className="bg-blue-100 rounded-xl  text-sm  " key={spec._id}>{spec.name}</p>
                ))}
              </div>
              <button
                onClick={() => handleTrainerProfileView(trainer._id)}
                className=" bg-blue-500 mt-5 hover:bg-blue-600 text-white py-2 px-4 rounded self-start"
              >
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
