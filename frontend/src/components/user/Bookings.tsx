import React, { useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import API_URL from "../../../axios/API_URL";
import axiosInstance from "../../../axios/trainerAxiosInstance";
import userAxiosInstance from "../../../axios/userAxionInstance";

interface Booking {
  _id: string;
  trainerName: string;
  trainerImage: string;
  sessionType: string;
  specialization: string;
  sessionDates: { startDate: string };
  startTime: string;
  endTime: string;
}

function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await userAxiosInstance.get(`/api/user/bookings/${userInfo?.id}`);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [userInfo]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await axios.delete(`${API_URL}/api/user/bookings/${bookingId}`, {});
      setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  return (
    <div className="flex justify-center mt-5">
      <div className="h-[80vh] bg-white w-full shadow-md rounded-md overflow-y-auto p-3">
        <h1 className="p-2 font-bold text-2xl mb-5">Bookings</h1>
        <div className="grid grid-cols-7 gap-2 text-lg font-bold text-gray-600 mb-4 border-b border-gray-200 pb-2">
          <div>Trainer</div>
          <div>Session Type</div>
          <div>Specialization</div>
          <div>Session Date</div>
          <div>Start Time</div>
          <div>End Time</div>
          <div>Action</div>
        </div>

        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="grid grid-cols-7 gap-2 items-center p-4 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-none"
          >
            <div className="flex items-center space-x-2">
              <img
                src={booking.trainerImage}
                alt={`${booking.trainerName}'s profile`}
                className="w-12 h-12 rounded-full"
              />
              <span className="font-medium text-gray-800">{booking.trainerName}</span>
            </div>
            <div className="text-gray-800 font-medium">{booking.sessionType}</div>
            <div className="text-gray-800 font-medium">{booking.specialization}</div>
            <div className="text-gray-800 font-medium">
              {new Date(booking.sessionDates.startDate).toLocaleDateString()}
            </div>
            <div className="text-gray-800 font-medium">{booking.startTime}</div>
            <div className="text-gray-800 font-medium">{booking.endTime}</div>
            <div>
              <button
                onClick={() => handleCancelBooking(booking._id)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookings;
