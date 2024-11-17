import user from "../../assets/user.png";
import rupee from "../../assets/rupee-sign.png";
import booking from "../../assets/booking (1).png";
import { useEffect, useState } from "react";
import axiosInstance from "../../../axios/trainerAxiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { IBookingDetails } from "../../types/common";
import { formatDate } from "react-datepicker/dist/date_utils";
import { formatTime } from "../../utils/timeAndPriceUtils";

interface Specialization {
  name: string
  _id: string
}
interface BookingDetail {
  userName: string
  _id: string
  sessionDates: {
    startDate: string; 
    endDate?: string;  
  };
  sessionStartTime: string;
  sessionEndTime: string;
  specialization: Specialization
  sessionType: string
  userId: string
  paymentStatus: string
}

function TrainerDashboard() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);

  useEffect(() => {
    const fetchBookings = async () => {
      const response = await axiosInstance(
        `/api/trainer/bookingDetails/${trainerInfo.id}`
      );
      setBookingDetails(response.data);
    };
    fetchBookings();
  }, []);
  const totalSessions = bookingDetails.length;

  const totalUsers = new Set(bookingDetails.map((booking) => booking.userId))
    .size;
  console.log(bookingDetails);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-4xl font-bold text-gray-800">Trainer Dashboard</h2>
      </div> */}
      <div className="flex justify-center gap-32">
        <div className="bg-blue-100 h-[100px] w-[260px] shadow-md flex items-center px-4">
          <img className="h-16 w-16 mr-4" src={booking} alt="" />
          <div>
            <h1 className="font-medium">Total Bookings</h1>
            <div className="text-lg font-bold">{totalSessions}</div>
          </div>
        </div>

        <div className="bg-blue-100 h-[100px] w-[260px] shadow-md flex items-center px-4">
          <img className="h-16 w-16 mr-4" src={user} alt="" />
          <div>
            <h1 className="font-medium">Total Clients</h1>
            <div className="text-lg font-bold">{totalUsers}</div>
          </div>
        </div>

        <div className="bg-blue-100 h-[100px] w-[260px] shadow-md flex items-center px-4">
          <img className="h-16 w-16 mr-4" src={rupee} alt="" />
          <div>
            <h1 className="font-medium">Payment Due</h1>
            <div className="text-lg font-bold">₹3,0500</div>
          </div>
        </div>
      </div>

      <div className="mt-10">
  <h1 className="text-2xl font-bold text-gray-800">Upcoming Sessions</h1>
</div>
<div className="mt-10 bg-white shadow-md p-3">
  <div className=" grid grid-cols-6 gap-4 text-center text-lg font-bold border-b border-gray-200 pb-2">
    <div>User Name</div>
    <div>Date</div>
    <div>Time</div>
    <div>Session Type</div>
    <div>Specialization</div>
    <div>Status</div>
  </div>

  {bookingDetails.length > 0 ? (
    bookingDetails.map((booking) => (
      <div
        key={booking._id}
        className="grid grid-cols-6 gap-4 items-center p-2 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-none"
      >
        <div className="text-center text-gray-800 font-medium">
          {booking.userName}
        </div>
        <div className="text-center text-gray-800 font-medium">
          {new Date(booking.sessionDates.startDate, ).toLocaleDateString()} {/* Format Date */}
        </div>
        <div className="text-center text-gray-800 font-medium">
          {formatTime(booking.sessionStartTime)} - {formatTime(booking.sessionEndTime)} {/* Session Time */}
        </div>
        <div className="text-center text-gray-800 font-medium">
          {booking.sessionType || "N/A"} 
        </div>
        <div className="text-center text-gray-800 font-medium">
          {booking.specialization.name || "N/A"} 
        </div>
        <div className={`text-center text-gray-800 font-medium ${booking.paymentStatus == 'Confirmed' ? 'text-green-500' : 'text-red-500'}`}>
          {booking.paymentStatus} 
        </div>
      </div>
    ))
  ) : (
    <div className="text-center text-gray-500 mt-4">No upcoming sessions</div>
  )}
</div>

    </div>
  );
}

export default TrainerDashboard;
