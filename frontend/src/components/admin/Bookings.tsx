import { useEffect, useState } from "react";
import adminAxiosInstance from "../../../axios/adminAxiosInstance";
import { IBookingDetails } from "../../types/common";
import { formatPriceToINR, formatTime } from "../../utils/timeAndPriceUtils";

function Bookings() {
  const [bookings, setBookings] = useState<IBookingDetails[]>([]);
  const [filterSessionType, setFilterSessionType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>();
  const [filterStartDate, setFilterStartDate] = useState<string>("");
console.log('bookings', bookings);

  useEffect(() => {
    const fetchAllBookings = async () => {
      const response = await adminAxiosInstance.get(`api/admin/allBookings`);
      setBookings(response.data);
    };
    fetchAllBookings();
  }, []);

  const statusType = (type: string) => {
    setFilterStatus(type);
  };

  const sessionType = (type: string) => {
    setFilterSessionType(type);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "cancelled" && booking.status !== "Cancelled")
      return false;
    if (filterStatus === "confirmed" && booking.status !== "Confirmed")
      return false;
    if (
      filterSessionType === "single" &&
      booking.sessionType !== "Single Session"
    )
      return false;
    if (
      filterSessionType === "package" &&
      booking.sessionType !== "package Session"
    )
      return false;
    if (
      filterStartDate &&
      new Date(booking.bookingDate).toISOString().split("T")[0] !==
        filterStartDate
    ) {
      return false;
    }
    return true;
  });



  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-semibold text-gray-800">Bookings</h2>

        <div className="flex items-center gap-4">
          <input
            type="date"
            onChange={(e) => setFilterStartDate(e.target.value)}
            value={filterStartDate}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          />

          <select
            onChange={(e) => statusType(e.target.value)}
            value={filterStatus}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            <option value="all">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            onChange={(e) => sessionType(e.target.value)}
            value={filterSessionType}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            <option value="all">All</option>
            <option value="single">Single Sessions</option>
            <option value="package">Package Sessions</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md p-4">
        <div className="grid grid-cols-9 gap-2 text-sm font-semibold text-gray-600 mb-3 border-b border-gray-200 pb-2">
          <div>ID</div>
          <div>User</div>
          <div>Trainer</div>
          <div>Date(s)</div>
          <div>Time</div>
          <div>Type</div>
          <div>Specialization</div>
          <div>Amount</div>
          <div>Status</div>
        </div>

        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="grid grid-cols-9 gap-2 items-center text-sm p-2 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-none"
            >
              <div className="text-gray-700">
                {booking._id.substring(0, 8).toUpperCase()}
              </div>
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
              <div className="text-gray-700">
                {formatPriceToINR(booking.amount)}
              </div>
              <div
                className={`text-gray-700 font-medium ${
                  booking.status === "Confirmed"
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
