import { useParams } from "react-router-dom";
import profileBG from "../../assets/trainer-profile-view-img.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../axios/API_URL";
import {TrainerProfile} from '../../types/trainer'



function TrainerProfileView() {
  const [trainer, setTrainer] = useState<TrainerProfile | null>(null);

  const {trainerId} = useParams()

  
  useEffect(() => {
  
    const fetchTrainer = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/getTrainer/${trainerId}`);
        setTrainer(response.data[0])
      } catch (error) {
        console.error("Error fetching trainer:", error);  
      }
    };
  
    fetchTrainer();
  }, [trainerId]);
  
 
  
  return (
    <>
      <div>
        <img
          className="w-full h-[37vh]"
          src={profileBG}
          alt="Profile Background"
        />
      </div>
      <div className="absolute top-36 md:top-40 left-8 md:left-32 flex items-center justify-center">
        <img
             src={trainer?.profileImage}
          alt="Profile"
          className="w-52 h-52 rounded-full bg-slate-500 object-cover border-4 border-white shadow-lg"
        />
        <div className="flex flex-col ml-10 ">
          <h1 className="text-4xl font-bold  mt-40  rounded-lg">{trainer?.name}</h1>
          <h2 className="text-xl font-medium text-gray-700 mt-2">{trainer?.specialization.name}</h2>
        </div>
      </div>
      <div className="mt-36 mx-8 md:mx-auto border-b-2 border-gray-300"></div>
      <div className="flex justify-normal ">
      <div className="mx-8 md:mx-auto mt-8 md:ml-36 ">
        {/* <h1 className="text-2xl font-medium text-gray-500">
          {trainer?.yearsOfExperience || ''}
        </h1> */}
        <div>
          <h1 className="text-6xl font-semibold">5.0</h1>
        </div>
        <div className="flex justify-start  mt-2">
          <div className="text-blue-500 text-3xl">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
          <h2 className="ml-2 text-blue-500 text-2xl">2 reviews</h2>
        </div>
        <button className="bg-gradient-to-b from-blue-500 to-blue-500 text-white font-bold py-2 px-4 w-64 mt-7  rounded-2xl shadow-md ">
         Book Session
        </button>
      </div>
    <div className="bg-blue-50 rounded-md p-10 mt-10 ml-10 mr-36">
        <h1 className="text-3xl font-semibold mb-7">About {trainer?.name}</h1>
        <p className="font-normal">
        Trainer1 is a passionate yoga and Pilates trainer, dedicated to fostering connections and friendships through movement. Hailing from Jeffreys Bay, known as the surf capital of the world, he embraces the beauty of nature and the joy of surfing, spending his days riding waves and enjoying the camaraderie of fellow surfers. With a background as a former mixed martial artist, Eddie brings a unique perspective to his training, blending strength and flexibility. He is an open-minded individual who values kindness and compassion, aiming to create a welcoming environment for all. As an animal and nature lover, Eddie believes in sharing positivity and nurturing a sense of community within his classes. Whether guiding a yoga session or a Pilates workout, Eddie’s enthusiasm shines through, inspiring others to explore their potential while cultivating a sense of well-being. Join him on this journey of movement, mindfulness, and connection
        </p>
        <p className="mt-5 font-medium">Languages: {trainer?.language}</p>
    </div>
      </div>
    </>
  );
}

export default TrainerProfileView;
