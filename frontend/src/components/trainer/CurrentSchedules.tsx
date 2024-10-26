import { FaPlus } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API_URL from "../../../axios/API_URL";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import axiosInstance from "../../../axios/axiosInstance";
import { toast, Toaster } from "react-hot-toast";

type Status =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "InProgress"
  | "";

function CurrentSchedules() {
  const [status, setStatus] = useState<Status>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isSingleSession, setIsSingleSession] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const trainerId = trainerInfo.id;
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as Status);
    console.log("Selected status:", e.target.value);
  };

  const openModal = () => setModalOpen(true);

  const singleSession = () => {
    setIsSingleSession(true);
    clearSessionData();
  };

  const packageSession = () => {
    setIsSingleSession(false);
    clearSessionData();
  };

  const clearSessionData = () => {
    setSelectedDate(null);
    setStartDate(null);
    setEndDate(null);
    setStartTime("");
    setEndTime("");
    setPrice("");
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 20);

    // Validation for Single Session
    if (isSingleSession) {
      if (!selectedDate || !startTime || !price) {
        toast.error("Please fill in all fields for the single session.");
        return;
      }

      if (new Date(selectedDate) > maxDate) {
        toast.error("The session date must be within the next 20 days.");
        return;
      }
    } else {
      if (!startDate || !endDate || !startTime || !endTime || !price) {
        toast.error("Please fill in all fields for the package session.");
        return;
      }

      if (new Date(startDate) > maxDate) {
        toast.error("The package start date must be within the next 20 days.");
        return;
      }

      if (new Date(startDate) >= new Date(endDate)) {
        alert("Start date must be before end date.");
        return;
      }
    }

    try {
      const sessionData = isSingleSession
        ? {
            isSingleSession,
            selectedDate: selectedDate?.toISOString(),
            startTime,
            endTime,
            price,
          }
        : {
            isSingleSession,
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
            startTime,
            endTime,
            price,
          };

      const response = await axiosInstance.post(
        `${API_URL}/api/trainer/session/${trainerId}`,
        sessionData
      );
      console.log(response.data);
      
      if(response.status === 201) {
        toast.success('Session created successfully')
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.message || "Bad request";
        return toast.error(errorMessage);
      } else if (error.response) {
        return toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error("No response received from server");
      }

      if (error.response?.status === 401) {
        console.error("Unauthorized request. You may need to log in again.");
        window.location.href = "/trainer/login";
      }
    }

    handleClose();
  };

  const handleClose = () => {
    setModalOpen(false);
    clearSessionData();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <Toaster />
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-4xl font-bold text-gray-800">Current Schedules</h2>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={openModal}
          className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaPlus /> Add
        </button>

        <select
          value={status}
          onChange={handleFilterChange}
          className="bg-gray-200 py-2 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          <option value="">Filter by Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="InProgress">In Progress</option>
        </select>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 h-[95vh] w-full max-w-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Choose Session Type</h3>
            <div className="mt-8 space-x-4">
              <button
                onClick={singleSession}
                className={`p-2 ${
                  isSingleSession
                    ? "bg-blue-500 text-white"
                    : "bg-slate-400 text-white"
                } rounded-md`}
              >
                Single Session
              </button>
              <button
                onClick={packageSession}
                className={`p-2 ${
                  !isSingleSession
                    ? "bg-blue-500 text-white"
                    : "bg-slate-400 text-white"
                } rounded-md`}
              >
                Package Session
              </button>
            </div>

            {isSingleSession ? (
              <form onSubmit={handleAdd}>
                <div className="bg-slate-200 p-10 mt-7 rounded-lg">
                  <label className="block text-gray-700 mb-2">
                    Select Date
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    placeholderText="Select date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    required
                  />
                  <label className="block text-gray-700 mb-2 mt-4">
                    Select Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                  <label className="block text-gray-700 mb-2 mt-4">
                    Select End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                  <label className="block text-gray-700 mt-4">
                    Session Price
                  </label>
                  <input
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    className="px-3 py-3 mt-3 rounded-lg w-full"
                    type="text"
                    placeholder="Enter Session Price"
                    required
                  />
                  <div className="mt-7 flex justify-center">
                    <button
                      type="submit"
                      className="text-white px-9 rounded-lg py-3 bg-blue-500 hover:bg-blue-700 mr-6"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-white px-7 rounded-lg py-3 bg-red-500 hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAdd}>
                <div className="bg-slate-200 p-10 mt-7 rounded-lg">
                  <label className="block text-gray-700 mb-2">Start Date</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Select start date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                  <label className="block text-gray-700 mb-2 mt-4">
                    End Date
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText="Select end date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                  <div className="flex justify-around">
                    <label className="block text-gray-700 mb-2 mt-4">
                      Select Start Time
                    </label>
                    <label className="block text-gray-700 mb-2 mt-4">
                      Select End Time
                    </label>
                  </div>
                  <div className="flex justify-around gap-7">
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    />
                  </div>
                  <label className="block text-gray-700 mt-4">
                    Package Price
                  </label>
                  <input
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    className="px-3 py-3 mt-3 rounded-lg w-full"
                    type="text"
                    placeholder="Enter Package Price"
                    required
                  />
                  <div className="mt-7 flex justify-center">
                    <button
                      type="submit"
                      className="text-white px-9 rounded-lg py-3 bg-blue-500 hover:bg-blue-700 mr-6"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-white px-7 rounded-lg py-3 bg-red-500 hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentSchedules;
