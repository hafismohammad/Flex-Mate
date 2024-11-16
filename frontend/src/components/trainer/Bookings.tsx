import React, { useEffect, useState } from 'react';
import trainerAxiosInstance from '../../../axios/trainerAxiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { formatTime, formatPriceToINR } from '../../utils/timeAndPriceUtils';

interface BookingDetail {
  _id: string;
  userName: string;
  trainerName: string;
  bookingDate: string;
  sessionType: string,
  sessionDates: {
    startDate: string;
    endDate?: string;
  };
  sessionStartTime: string;
  sessionEndTime: string;
  amount: number;
  paymentStatus: string;
}

function Bookings() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterStartDate, setFilterStartDate] = useState<string>("");

  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const trainerId = trainerInfo.id;

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await trainerAxiosInstance.get(`api/trainer/bookingDetails/${trainerId}`);
        setBookingDetails(response.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };
    fetchBookingDetails();
  }, [trainerId]);

  const filterSession = (type: string) => {
    setFilterType(type);
  };

  const filterStatusType = (type: string) => {
    setFilterStatus(type);
  };

  const filteredBookings = bookingDetails.filter((booking) => {
    if (filterType === 'single' && booking.sessionType === 'Single Session') {
      return true;
    }
    if (filterType === 'package' && booking.sessionType === 'Package Session') {
      return true;
    }
  
    if (filterStatus === "cancelled" && booking.paymentStatus !== "Cancelled") {
      return false;
    }
    if (filterStatus === "confirmed" && booking.paymentStatus !== "Confirmed") {
      return false;
    }
  
    // if (
    //   filterStartDate &&
    //   new Date(booking.bookingDate).toISOString().split("T")[0] !== filterStartDate
    // ) {
    //   return false;
    // }
    if (filterStartDate && new Date(booking.bookingDate).toISOString().split("T")[0] !== filterStartDate) {
      return false;
    }
    
    return true;
  });
  

console.log(bookingDetails);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-4xl font-bold text-gray-800">Bookings</h2>

        <div className='flex items-center gap-4'>
          <input 
          type="date" 
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
          />

          <select 
          className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
          onChange={(e) => filterStatusType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="cancelled">Cancelled</option>
            <option value="confirmed">Confirmed</option>
          </select>

          <select
          onChange={(e) => filterSession(e.target.value)}
          className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'>
            <option value="all">All</option>
            <option value="single">Single Session</option>
            <option value="package">Package Session</option>
          </select>
        </div>
      </div>

      <div className='bg-white shadow-lg p-6 '>
        <div className='grid grid-cols-9 gap-1 text-lg font-bold text-gray-600  mb-4 border-b border-gray-200 pb-2'>
          <div>Booking ID</div>
          <div>User Name</div>
          <div>Booking Date</div>
          <div>Session Type</div>
          <div>Session Date</div>
          <div>Start Time</div>
          <div>End Time</div>
          <div>Amount</div>
          <div>Status</div>
        </div>

        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className='grid grid-cols-9 gap-1 items-center   p-4 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-none mb-2'
            >
              <div className='text-gray-800 font-medium'>{booking._id.substring(0, 8).toUpperCase()}</div>
              <div className='text-gray-800 font-medium '>{booking.userName}</div>
              <div className='text-gray-800 font-medium ml-5'>{new Date(booking.bookingDate).toLocaleDateString()}</div>
              <div className='text-gray-800 font-medium'>{booking.sessionType}</div>
              <div className='text-gray-800 font-medium ml-5'>
                {new Date(booking.sessionDates.startDate).toLocaleDateString()}
                {booking.sessionDates.endDate && 
                  ` - ${new Date(booking.sessionDates.endDate).toLocaleDateString()}`
                }
              </div>
              <div className='text-gray-800 font-medium'>{formatTime(booking.sessionStartTime)}</div>
              <div className='text-gray-800 font-medium'>{formatTime(booking.sessionEndTime)}</div>
              <div className='text-gray-800 font-medium'>{formatPriceToINR(booking.amount)}</div>
              <div className={`text-gray-800 font-semibold ${booking.paymentStatus === 'Confirmed' ? 'text-green-500' : 'text-red-500'}`}>{booking.paymentStatus}</div>
            </div>
          ))
        ) : (
          <div className='text-gray-600 text-center mt-4'>No bookings found.</div>
        )}
      </div>
    </div>
  );
}

export default Bookings;
