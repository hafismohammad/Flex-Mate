import { useEffect, useState } from "react";
import adminAxiosInstance from "../../../axios/adminAxiosInstance";
import { IBookingDetails } from "../../types/common";
import { formatPriceToINR, formatTime } from "../../utils/timeAndPriceUtils";

function Bookings() {
  const [bookings, setBookings] = useState<IBookingDetails[]>([]);

  useEffect(() => {
    const fetchAllBookings = async () => {
      const response = await adminAxiosInstance.get(`api/admin/allBookings`);
      setBookings(response.data);
    };
    fetchAllBookings();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-semibold text-gray-800">Bookings</h2>
      </div>

      <div className="bg-white shadow-md p-4">
        <div className="grid grid-cols-9 gap-2 text-sm font-semibold text-gray-600 mb-3 border-b border-gray-200 pb-2">
          <div>ID</div>
          <div>User</div>
          <div>Trainer</div>
          <div>Date(s)</div>
          <div>Time</div>
          <div>Type</div>
          <div>Specialty</div>
          <div>Amount</div>
          <div>Status</div>
        </div>

        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="grid grid-cols-9 gap-2 items-center text-sm p-2 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-none"
            >
              <div className="text-gray-700">{booking._id.slice(-4)}</div>
              <div className="text-gray-700">{booking.userName}</div>
              <div className="text-gray-700">{booking.trainerName}</div>
              <div className="text-gray-700">
                {booking.sessionType === "Package Session" ? (
                  <>
                    {new Date(
                      booking.sessionDates.startDate
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {booking.sessionDates.endDate
                      ? new Date(
                        booking.sessionDates.endDate
                      ).toLocaleDateString()
                      : "N/A"}
                  </>
                ) : (
                  new Date(booking.bookingDate).toLocaleDateString()
                )}
              </div>
              <div className="text-gray-700">
                {formatTime(booking.sessionStartTime)} -{" "}
                {formatTime(booking.sessionEndTime)}
              </div>
              <div className="text-gray-700">{booking.sessionType}</div>
              <div className="text-gray-700">{booking.specialization}</div>
              <div className="text-gray-700">{formatPriceToINR(booking.amount)}</div>
              <div
                className={`text-gray-700 font-medium ${booking.status === "Confirmed"
                    ? "text-green-600"
                    : booking.status === "Cancelled"
                      ? "text-red-600"
                      : booking.status === "OnGoing"
                        ? "text-blue-600"
                        : ""
                  }`}
              >
                {booking.status}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-4">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;
