import cardImg_1 from "../../assets/card-1.jpg";
import cardImg_2 from "../../assets/card-2.jpg";
import cardImg_5 from "../../assets/card-5.jpg";
import cardImg_6 from "../../assets/card-6.jpg";
import cardImg_3 from "../../assets/card-3.jpg";
import cardImg_4 from "../../assets/card-4.jpg";

function Features() {
  return (
    <div className="bg-slate-100 rounded-md p-4 flex flex-col place-items-center">
      <div>
        <h1 className="text-4xl font-bold mb-14 mt-20 text-center">Services</h1>
      </div>

      <div className="grid grid-col-3 lg:grid-cols-3 gap-14">
        <div className="mb-5 bg-white w-80 rounded-md shadow-md transform transition duration-300 hover:-translate-y-7">
          <div className="overflow-hidden rounded-t-md">
            <img className="w-full " src={cardImg_2} alt="card-image" />
          </div>
          <div className="p-3">
            <h2 className="text-xl font-semibold mb-1">Strength Training</h2>
            <p className="text-gray-700 text-sm">
              Personalized training tailored to your goals.
            </p>
          </div>
          <div className="p-3">
            <button className="mt-2 mb-1 py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
              Read More
            </button>
          </div>
        </div>

        <div className="mb-5 bg-white w-80 rounded-md shadow-md transform transition duration-300 hover:-translate-y-7">
          <div className="overflow-hidden rounded-t-md">
            <img className="w-full " src={cardImg_1} alt="card-image" />
          </div>
          <div className="p-3">
            <h2 className="text-xl font-semibold mb-1">Weight Loss</h2>
            <p className="text-gray-700 text-sm">
              Personalized training tailored to your goals.
            </p>
          </div>
          <div className="p-3">
            <button className="mt-2 mb-1 py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
              Read More
            </button>
          </div>
        </div>

        <div className="mb-5 bg-white w-80 rounded-md shadow-md transform transition duration-300 hover:-translate-y-7">
          <div className="overflow-hidden rounded-t-md">
            <img className="w-full " src={cardImg_6} alt="card-image" />
          </div>
          <div className="p-3">
            <h2 className="text-xl font-semibold mb-1">Boxing</h2>
            <p className="text-gray-700 text-sm">
              Personalized training tailored to your goals.
            </p>
          </div>
          <div className="p-3">
            <button className="mt-2 mb-1 py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
              Read More
            </button>
          </div>
        </div>

        <div className="mb-5 bg-white w-80 rounded-md shadow-md transform transition duration-300 hover:-translate-y-7">
          <div className="overflow-hidden rounded-t-md">
            <img className="w-full " src={cardImg_5} alt="card-image" />
          </div>
          <div className="p-3">
            <h2 className="text-xl font-semibold mb-1">Yoga</h2>
            <p className="text-gray-700 text-sm">
              Personalized training tailored to your goals.
            </p>
          </div>
          <div className="p-3">
            <button className="mt-2 mb-1 py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
              Read More
            </button>
          </div>
        </div>

        <div className="mb-5 bg-white w-80 rounded-md shadow-md transform transition duration-300 hover:-translate-y-7">
          <div className="overflow-hidden rounded-t-md">
            <img className="w-full " src={cardImg_3} alt="card-image" />
          </div>
          <div className="p-3">
            <h2 className="text-xl font-semibold mb-1">Injury Recovery</h2>
            <p className="text-gray-700 text-sm">
              Personalized training tailored to your goals.
            </p>
          </div>
          <div className="p-3">
            <button className="mt-2 mb-1 py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
              Read More
            </button>
          </div>
        </div>

        <div className="mb-5 bg-white w-80 rounded-md shadow-md transform transition duration-300 hover:-translate-y-7">
          <div className="overflow-hidden rounded-t-md">
            <img className="w-full " src={cardImg_4} alt="card-image" />
          </div>
          <div className="p-3">
            <h2 className="text-xl font-semibold mb-1">Nutrition </h2>
            <p className="text-gray-700 text-sm">
              Personalized training tailored to your goals.
            </p>
          </div>
          <div className="p-3">
            <button className="mt-2 mb-1 py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
