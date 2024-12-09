import React, { useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import API_URL from "../../../axios/API_URL";
import axiosInstance from "../../../axios/trainerAxiosInstance";
import userAxiosInstance from "../../../axios/userAxionInstance";
import Swal from "sweetalert2";
import { formatTime } from "../../utils/timeAndPriceUtils";

interface Booking {
  _id: string;
  trainerName: string;
  trainerImage: string;
  sessionType: string;
  specialization: string;
  sessionDates: { startDate: string };
  startTime: string;
  endTime: string;
  bookingStatus: string;
  bookingDate: string;
  prescription?: string;
  trainerEmail: string
}

function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [prescriptionData, setPrescriptionData] = useState<Booking | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await userAxiosInstance.get(
          `/api/user/bookings-details/${userInfo?.id}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [userInfo]);

  const handleCancelBooking = async (bookingId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This session will be cancelled!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`${API_URL}/api/user/cancel-booking/${bookingId}`);

          // Update booking status locally to 'Cancelled' instead of removing it
          setBookings((prev) =>
            prev.map((booking) =>
              booking._id === bookingId
                ? { ...booking, bookingStatus: "Cancelled" }
                : booking
            )
          );

          Swal.fire("Canceled!", "Your booking has been canceled.", "success");
        } catch (error) {
          console.error("Error canceling booking:", error);
          Swal.fire("Error", "Could not cancel the booking.", "error");
        }
      }
    });
  };


  const handleView = (booking: Booking) => {
    setPrescriptionData(booking)
    console.log('booking', booking);
    
    setIsModalOpen(true)
  }

  return (
    <div className="flex justify-center mt-5">
      <div className="h-[80vh] bg-white w-full shadow-md rounded-md overflow-y-auto p-3">
        <h1 className="p-2 font-bold text-2xl mb-5">Bookings</h1>
        <div className="grid grid-cols-9 gap-2 text-lg font-bold text-gray-600 mb-4 border-b border-gray-200 pb-2">
          <div>Trainer</div>
          <div>Booking Date</div>
          <div>Session Type</div>
          <div>Specialization</div>
          <div>Session Date</div>
          <div>Start Time</div>
          <div>End Time</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="grid grid-cols-9 gap-2 items-center p-4 px-6 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-none"
          >
            <div className="flex items-center space-x-2">
              <img
                src={booking.trainerImage}
                alt={`${booking.trainerName}'s profile`}
                className="w-12 h-12 rounded-full"
              />
              <span className="font-medium text-gray-800">
                {booking.trainerName}
              </span>
            </div>
            <div className="text-gray-800 font-medium">
              {new Date(booking.bookingDate).toLocaleDateString()}
            </div>
            <div className="text-gray-800 font-medium">
              {booking.sessionType}
            </div>
            <div className="text-gray-800 font-medium">
              {booking.specialization}
            </div>
            <div className="text-gray-800 font-medium">
              {new Date(booking.sessionDates.startDate).toLocaleDateString()}
            </div>
            <div className="text-gray-800 font-medium">
              {formatTime(booking.startTime)}
            </div>
            <div className="text-gray-800 font-medium">
              {formatTime(booking.endTime)}
            </div>
            <div
              className={
                booking.bookingStatus === "Confirmed"
                  ? "text-green-500 rounded-md font-medium"
                  : booking.bookingStatus === "Cancelled"
                  ? "text-red-500 rounded-md font-medium"
                  : booking.bookingStatus === "Completed"
                  ? "text-blue-500 rounded-md font-medium"
                  : ""
              }
            >
              {booking.bookingStatus}
            </div>

            <div>
              {booking.bookingStatus === "Confirmed" && (
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="bg-red-500 hover:bg-red-700 font-bold text-white px-5 py-1 rounded-lg"
                >
                  Cancel
                </button>
              )}
              {booking.bookingStatus === "Completed" && (
                <button onClick={() => handleView(booking)} className="bg-blue-500 hover:bg-blue-700 font-bold text-white px-7 py-1 rounded-lg">
                  View
                </button>
              )}
            </div>

            {/* <div>
              {booking.bookingStatus !== "Cancelled"  && booking.bookingStatus !== 'Completed'? (
               <div className="flex justify-center gap-2">
                 <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="bg-red-500 hover:bg-red-700 font-bold text-white px-4 py-1 rounded-lg"
                >
                  Cancel
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 font-bold text-white px-4 py-1 rounded-lg">View</button>
               </div>
              ) : (
                ""
              )}
            </div> */}
          </div>
        ))}
      </div>
     
      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 w-[800px] shadow-lg">
      <h1 className="font-bold text-xl text-center mb-6">Prescription</h1>
      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={prescriptionData?.trainerImage || "/default-profile.png"}
              alt="Trainer Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-gray-800">
            <p>
              <strong>Name:</strong> {prescriptionData?.trainerName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {prescriptionData?.trainerEmail || "N/A"}
            </p>
            <p>
              <strong>Specialization:</strong> {prescriptionData?.specialization || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-medium text-gray-700 mb-2">
            Prescription
          </label>
          <div className="w-full border rounded-md p-3 text-gray-700 bg-gray-50">
            {prescriptionData?.prescription
              ? prescriptionData.prescription.split('\n').map((line, index) => (
                  <p key={index}>{line.trim()}</p>
                ))
              : "No prescription available."}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-5 py-2 bg-red-500 hover:bg-red-700 rounded-md shadow-md text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default Bookings;
