import axios from "axios";
import { useEffect, useState } from "react";
import API_URL from "../../../axios/API_URL";
import {Specialization} from '../../types/trainer'



function TrainersSidebar() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  useEffect(() => {
    const allSpecializations = async () => {
      const response = await axios.get(
        `${API_URL}/api/user/allspecializations`
      );
      setSpecializations(response.data);
    };
    allSpecializations();
  }, []);

  return (
    <div className="h-screen w-80 bg-gray-100 text-black flex flex-col">
      <h2 className="text-2xl font-bold p-4 border-b border-gray-700 ">
        Filters
      </h2>

      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold mb-2">Specialization</h3>
        <ul className="space-y-2">
          {specializations.map((spec) => (
            <li key={spec._id} className="flex items-center">
              <input
                type="radio"
                id={spec._id}
                name="specialization"
                className="mr-2 w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-blue-500"
              />
              <label
                htmlFor={spec._id} 
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
              >
                {spec.name}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold mb-2">Gender</h3>
        <ul className="space-y-2">
          {["Male", "Female"].map((gender) => (
            <li key={gender} className="flex items-center">
              <input
                type="radio"
                id={gender}
                name="gender"
                className="mr-2 w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-blue-500"
              />
              <label
                htmlFor={gender}
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
              >
                {gender}
              </label>
            </li>
          ))}
        </ul>

        
      </div>
      

      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold mb-2">Language</h3>
        <ul className="space-y-2">
          {["English", "Spanish", "French", "German"].map((language) => (
            <li key={language} className="flex items-center">
              <input
                type="radio"
                id={language}
                name="language"
                className="mr-2 w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-blue-500"
              />
              <label
                htmlFor={language}
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
              >
                {language}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Years of Experience</h3>
            <ul className="space-y-2">
              {['1-3 years', '3-5 years', '5-10 years', '10+ years'].map((experience) => (
                <li key={experience} className="flex items-center">
                  <input
                    type="radio"
                    id={experience}
                    name="experience"
                    className="mr-2 w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-blue-500"
                  />
                  <label htmlFor={experience} className="cursor-pointer hover:bg-gray-200 p-2 rounded">
                    {experience}
                  </label>
                </li>
              ))}
            </ul>
          </div> */}
    </div>
  );
}

export default TrainersSidebar;
