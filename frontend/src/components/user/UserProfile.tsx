import React from "react";

function UserProfile() {
  return (
    <div className="flex justify-center mt-7">
      <div className="h-[70vh] bg-white w-[75%] shadow-md rounded-md overflow-y-auto">
        <h1 className="p-5 font-bold text-2xl">Personal Information</h1>

        <div className="mt-5 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div>
            <label htmlFor="" className="block mb-1 font-medium text-gray-700">
              Name
            </label>
            <div className="border border-gray-500 p-2 rounded-md">
              <h1 className="text-gray-800">Hafis</h1>
            </div>
          </div>

          <div>
            <label htmlFor="" className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <div className="border border-gray-500 p-2 rounded-md">
              <h1 className="text-gray-800">hafis@gmail.com</h1>
            </div>
          </div>

          <div>
            <label htmlFor="" className="block mb-1 font-medium text-gray-700">
              Phone
            </label>
            <div className="border border-gray-500 p-2 rounded-md">
              <h1 className="text-gray-800">0434334434</h1>
            </div>
          </div>

          <div>
            <label htmlFor="" className="block mb-1 font-medium text-gray-700">
              Birthday
            </label>
            <div className="border border-gray-500 p-2 rounded-md">
              <h1 className="text-gray-800">09/03/2002</h1>
            </div>
          </div>

          <div>
            <label htmlFor="" className="block mb-1 font-medium text-gray-700">
              Gender
            </label>
            <div className="border border-gray-500 p-2 rounded-md">
              <h1 className="text-gray-800">Male</h1>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-8">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
