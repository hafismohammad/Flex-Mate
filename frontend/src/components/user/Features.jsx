import { useEffect, useState } from "react";


import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import userAxiosInstance from "../../../axios/userAxionInstance";



function Features() {
  const [specializations, setSpecializations] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    AOS.init({
      duration: 1500, 
      delay: 100, 
      easing: "ease-out-quart", 
      once: true, 
    });
  }, []);

  useEffect(() => {
    const getAllSpecializations = async () => {
      try {
        const response = await userAxiosInstance.get(
          `/api/user/allspecializations`
        );
        const listedSpecializations = response.data.filter(spec => spec.isListed);
        setSpecializations(listedSpecializations);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };
    getAllSpecializations();
  }, []);

  const handleClick = (specId) => {
    navigate(`/trainers/${specId}`)
    
  }

  console.log(specializations);
  

  return (
    <div className="bg-slate-100 rounded-md p-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-14 mt-20 text-center">Services</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
        {specializations.length > 0 &&
          specializations.map((feature) => (
            <div
              key={feature._id}
              className="flex flex-col justify-between h-full bg-white w-full max-w-sm mx-auto rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
              data-aos="fade-up"
            >
              <div className="overflow-hidden rounded-t-md">
                <img
                  className="w-full h-48 object-cover"
                  src={feature.image}
                  alt={feature.title}
                />
              </div>
              <div className="p-4 flex-grow">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.name}
                </h2>
                <p className="text-gray-700 text-sm">{feature.description}</p>
              </div>
              <div className="p-4">
                <button onClick={() => handleClick(feature._id)} className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                  View {feature.name} Trainers
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Features;