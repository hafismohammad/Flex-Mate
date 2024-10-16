import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { addSpecialization } from "../../actions/adminAction";
import axios from "axios";
import API_URL from "../../../axios/API_URL";
import { v4 as uuidv4 } from "uuid";

interface Errors {
  name?: string;
  description?: string;
}

interface Specialization {
  _id: string;
  name: string;
  description: string;
  isListed: boolean;
}

const Specializations = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getAllSpecializations = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/admin/allSpecializations`
        );
        setSpecializations(response.data);

        console.log("Specializations fetched:", response.data);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };
    getAllSpecializations();
  }, [specializations]);

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

  const handleStatus = async (specId: string, currentStatus: boolean) => {
    try {
      const updatedStatus = !currentStatus;

      await axios.patch(`${API_URL}/api/admin/toggle-status/${specId}`, {
        isListed: updatedStatus,
      });
    } catch (error) {
      console.error("Error updating specialization status:", error);
    }
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
        <div className="grid grid-cols-4 text-lg font-semibold text-gray-600 mb-4 border-b border-gray-200 pb-2">
          <div>ID</div>
          <div>Specialization</div>
          <div>Status</div>
          <div className="text-center">Action</div>
        </div>

        {/* Specializations List Items */}
        {filteredSpecializations.length > 0 ? (
          filteredSpecializations.map((spec) => (
            <div
              key={spec._id}
              className="grid grid-cols-4 items-center p-4 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-none"
            >
              <div className="text-gray-800 font-medium">
                {spec._id.substring(0, 8)}
              </div>
              <div className="text-gray-800 font-medium">{spec.name}</div>
              <div
                className={`font-semibold ${
                  spec.isListed ? "text-green-600" : "text-red-500"
                }`}
              >
                {spec.isListed ? "Active" : "Inactive"}
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleStatus(spec._id, spec.isListed)}
                  className={`flex items-center justify-center text-white py-2 px-5 rounded-md font-semibold focus:outline-none ${
                    spec.isListed
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  style={{ minWidth: "120px" }} // Set a minimum width here
                >
                  <span>{spec.isListed ? "Unlist" : "List"}</span>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter specialization name"
                className={`w-full p-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.name && (
                <div className="text-red-500 mb-2">{errors.name}</div>
              )}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter specialization description"
                className={`w-full p-2 border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.description && (
                <div className="text-red-500 mb-2">{errors.description}</div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 mr-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Specialization
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
