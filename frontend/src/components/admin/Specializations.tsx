import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { addSpecialization } from '../../actions/adminAction';

interface Errors {
  name?: string;
  description?: string;
}

const Specializations = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const dispatch = useDispatch<AppDispatch>();

  // Mock data for Specializations
  const specializations = [
    { id: 1, name: "Yoga", status: "Active" },
    { id: 2, name: "Pilates", status: "Inactive" },
    { id: 3, name: "Strength Training", status: "Active" },
    { id: 4, name: "Cardio", status: "Active" },
  ];

  const filteredSpecializations = specializations.filter((spec) =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({}); 
    setName(""); 
    setDescription(""); 
  };

  const validate = (): boolean => {
    let isValid = true;
    const newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name = "Please fill the name field";
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = "Please fill the description field";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({}); 
      }, 3000);
    }

    return isValid;
  };

  const handleAddSpecialization = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return; 
    }

    const specializationData = {
      name,
      description,
    };
    dispatch(addSpecialization(specializationData));
    closeModal(); 
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-4xl font-bold text-gray-800">Specializations</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search Specializations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={openModal}
            className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaPlus />
            <span>Add Specialization</span>
          </button>
        </div>
      </div>

      {/* Specializations List Container */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Table Headers */}
        <div className="grid grid-cols-3 text-lg font-semibold text-gray-600 mb-4 border-b border-gray-200 pb-2">
          <div>Specialization</div>
          <div>Status</div>
          <div className="text-center">Action</div>
        </div>

        {/* Specializations List Items */}
        {filteredSpecializations.length > 0 ? (
          filteredSpecializations.map((spec) => (
            <div
              key={spec.id}
              className="grid grid-cols-3 items-center p-4 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-none"
            >
              <div className="text-gray-800 font-medium">{spec.name}</div>
              <div
                className={`font-semibold ${
                  spec.status === "Active" ? "text-green-600" : "text-red-500"
                }`}
              >
                {spec.status}
              </div>
              <div className="flex justify-center space-x-4">
                <button className="flex items-center space-x-1 text-white bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <FaEdit />
                  <span>Edit</span>
                </button>
                <button className="flex items-center space-x-1 text-white bg-red-600 hover:bg-red-700 py-1 px-3 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-red-500">
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-6">
            No specializations found.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Add New Specialization</h3>
            <form onSubmit={handleAddSpecialization}>
              <input
                type="text"
                value={name} // Ensure input reflects state
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter specialization name"
                className={`w-full p-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.name && <div className="text-red-500 mb-2">{errors.name}</div>}

              <textarea
                value={description} // Ensure textarea reflects state
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter specialization description"
                className={`w-full h-32 p-2 border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              ></textarea>
              {errors.description && <div className="text-red-500 mb-2">{errors.description}</div>}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Specializations;
