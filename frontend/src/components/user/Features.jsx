import { useEffect } from "react";
import cardImg_1 from "../../assets/card-1.jpg";
import cardImg_2 from "../../assets/card-2.jpg";
import cardImg_3 from "../../assets/card-3.jpg";
import cardImg_4 from "../../assets/card-4.jpg";
import cardImg_5 from "../../assets/card-5.jpg";
import cardImg_6 from "../../assets/card-6.jpg";

import AOS from 'aos';
import 'aos/dist/aos.css';

const featuresData = [
  {
    id: 1,
    image: cardImg_2,
    title: "Strength Training",
    description: "Personalized training tailored to your goals.",
  },
  {
    id: 2,
    image: cardImg_1,
    title: "Weight Loss",
    description: "Personalized training tailored to your goals.",
  },
  {
    id: 3,
    image: cardImg_6,
    title: "Boxing",
    description: "Personalized training tailored to your goals.",
  },
  {
    id: 4,
    image: cardImg_5,
    title: "Yoga",
    description: "Personalized training tailored to your goals.",
  },
  {
    id: 5,
    image: cardImg_3,
    title: "Injury Recovery",
    description: "Personalized training tailored to your goals.",
  },
  {
    id: 6,
    image: cardImg_4,
    title: "Nutrition",
    description: "Personalized training tailored to your goals.",
  },
];

function Features() {
  useEffect(() => {
    AOS.init({
      duration: 1500, 
      delay: 100, 
      easing: 'ease-out-quart', 
      once: true, 
    });
  }, []);
  

  return (
    <div className="bg-slate-100 rounded-md p-4 flex flex-col place-items-center">
      <h1 className="text-4xl font-bold mb-14 mt-20 text-center">Services</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
        {featuresData.map((feature) => (
          <div
            key={feature.id}
            className="mb-5 bg-white w-80 rounded-md shadow-md transform transition duration-300 hover:-translate-y-7"
            data-aos="fade-up" // Adding fade-up animation to each feature card
          >
            <div className="overflow-hidden rounded-t-md">
              <img className="w-full" src={feature.image} alt={feature.title} />
            </div>
            <div className="p-3">
              <h2 className="text-xl font-semibold mb-1">{feature.title}</h2>
              <p className="text-gray-700 text-sm">{feature.description}</p>
            </div>
            <div className="p-3">
              <button className="mt-2 mb-1 py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
