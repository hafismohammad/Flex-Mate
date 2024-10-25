import axios from "axios";
import { useEffect, useState } from "react";
import API_URL from "../../../axios/API_URL";
import { useNavigate, useParams } from "react-router-dom";
import {Trainer} from '../../types/trainer'



function TrainersList() {
  const [trainersData, setTrainersData] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { specId } = useParams();
  console.log("Specialization name:", specId);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTrainers = async () => {
      try {
        const response = await axios.get<Trainer[]>(
          `${API_URL}/api/user/allTrainers`
        );
        const trainers = response.data;

        // console.log('trainers',trainers.specialization.name);
        if (specId) {
          console.log('spec inside');
          
          const filteredTrainers = trainers.filter(
            (trainer) => trainer.specialization._id === specId
          );
          const otherTrainers = trainers.filter(
            (trainer) => trainer.specialization._id !== specId
          );

          setTrainersData([...filteredTrainers, ...otherTrainers]);
        } else {
          console.log('spec outside');
          
          setTrainersData(trainers);
        }
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    fetchAllTrainers();
  }, []); 
  // console.log("Trainers data:", trainersData);

  const filteredTrainers = trainersData.filter(
    (trainer) =>
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialization.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
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
           <div className="flex-grow">
             <h3 className="text-xl font-semibold text-gray-800">
               {trainer.name}
             </h3>
             <p className="text-gray-600">{trainer.specialization.name}</p>
             <p className="text-gray-600">
               {trainer.specialization.description}
             </p>
           </div>
           <button
             onClick={() => handleTrainerProfileView(trainer._id)}
             className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded self-start"
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
