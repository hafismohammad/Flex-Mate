// CurrentSchedules.tsx
import { FaPlus } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SessionModal from "../../components/trainer/SessionModal";
import API_URL from "../../../axios/API_URL";
import axiosInstance from "../../../axios/trainerAxiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {ISessionSchedule} from '../../types/trainer'
import {formatTime, calculateDuration, formatPriceToINR} from '../../utils/timeAndPriceUtils'
import Swal from 'sweetalert2';



function CurrentSchedules() {
  const [modalOpen, setModalOpen] = useState(false);

  // Add necessary state variables
  const [isSingleSession, setIsSingleSession] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [sessionSchedules, setSessionSchedules] = useState<ISessionSchedule[]>([]);

  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const trainerId = trainerInfo.id;

  
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 20);

    const clearSessionData = () => {
      setSelectedDate(null);
      setStartDate(null);
      setEndDate(null);
      setStartTime("");
      setEndTime("");
      setPrice("");
    };

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

      if (startTime >= endTime) {
        toast.error('End time must be after start time');
        return;
    }

      if (new Date(startDate) > maxDate) {
        toast.error("The package start date must be within the next 20 days.");
        return;
      }

      if (new Date(startDate) >= new Date(endDate)) {
        toast.error("Start date must be before end date.");
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
      const newSchedule = response.data.createdSessionData
      setSessionSchedules((schedule) => [
        ...schedule,
        newSchedule,
    ]);    

      if (response.status === 201) {  
        toast.success("Session created successfully");
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.message || "Time conflict with an existing session.";
        toast.error(errorMessage); 
      } else if (error.response?.status === 401) {
        console.error("Unauthorized request. Redirecting to login.");
        window.location.href = "/trainer/login";
      } else {
        console.error("Unexpected error:", error);
        const generalErrorMessage = error.response?.data.message || "An unexpected error occurred";
        toast.error(generalErrorMessage); 
      }
    }
    

    handleCloseModal();
    clearSessionData();
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      const response = await axiosInstance.get(
        `${API_URL}/api/trainer/sessiosShedules/${trainerId}`
      );
      const schedules = response.data.sheduleData;
      setSessionSchedules(schedules);
    };
    fetchSessionData();
  }, [trainerId]);

  const handleDelete = (sessionId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This session will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`api/trainer/deleteSessionSchedule/${sessionId}`);
          console.log(response.data);
          setSessionSchedules((schedule) => 
          schedule.filter((schedule) => schedule._id != sessionId)
          ) 
          // Swal.fire(
          //   "Deleted!",
          //   "The session has been deleted.",
          //   "success"
          // );
          return toast.success('Session deleted successfully')
        } catch (error) {
          Swal.fire("Error", "Failed to delete the session.", "error");
        }
      }
    });
  };
  

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <Toaster />
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-4xl font-bold text-gray-800">Current Schedules</h2>
        <button
          onClick={handleOpenModal}
          className="flex items-center bg-blue-500 px-3 py-2 text-white rounded-md hover:bg-blue-700"
        >
          <FaPlus className="mr-1" />
          <span>Add Schedule</span>
        </button>
      </div>

      <SessionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        isSingleSession={isSingleSession}
        setIsSingleSession={setIsSingleSession}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        price={price}
        setPrice={setPrice}
        handleAdd={handleAdd}
      />

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-8 gap-1 text-lg font-semibold text-gray-600 mb-4 border-b border-gray-200 pb-2">
          <div>Session Type</div>
          <div>Date</div>
          <div>Start Time</div>
          <div>End Time</div>
          <div>Price</div>
          <div>Duration</div>
          <div>Status</div>
          <div>Action</div>
        </div>
      {sessionSchedules.length > 0 ? (
        sessionSchedules.map((schedule) => (
          <div key={schedule._id} className="grid grid-cols-8 gap-1 items-center p-4 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-none mb-2">
            <div className="text-gray-800 font-medium">{schedule.isSingleSession ? 'Single Session' : 'Package'}</div>
            <div className="text-gray-800 font-medium mt-3">{schedule.isSingleSession ? new Date(schedule.startDate).toLocaleDateString() :  `${new Date(schedule.startDate).toLocaleDateString()} / ${new Date(schedule.endDate).toLocaleDateString()}`}</div>
            <div className="text-gray-800 font-medium">{formatTime(schedule.startTime)}</div>
            <div className="text-gray-800 font-medium">{formatTime(schedule.endTime)}</div>
            <div className="text-gray-800 font-medium">{formatPriceToINR(schedule.price)}</div>
            <div className="text-gray-800 font-medium">{calculateDuration(schedule.startTime, schedule.endTime)}</div>
            <div className={`font-medium ${{'Pending':'text-yellow-500', 'Confirmed': 'text-green-500', 'Completed': 'text-blue-500','Cancelled': 'text-red-500', 'InProgress': 'text-purple-500'}[schedule.status] || 'text-gray-800'}`}>{schedule.status}</div>
            <button onClick={() => handleDelete(schedule._id)} className="bg-red-500 px-2 py-2 rounded-lg text-white hover:bg-red-600 shadow-md">Delete</button>
          </div>
        ))
       ) : (
        <div className="flex justify-center">
          <h1 className="font-medium ">No Session Schedules</h1>
        </div>
       )}

      </div>
    </div>
  );
}

export default CurrentSchedules;
