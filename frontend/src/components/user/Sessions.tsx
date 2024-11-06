import { useEffect, useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import userAxiosInstance from "../../../axios/userAxionInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { IBookedSession } from "../../types/user";
import { formatTime } from "../../utils/timeAndPriceUtils";

function Sessions() {
  const [sessions, setSessions] = useState<IBookedSession[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 3;

  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const response = await userAxiosInstance.get(
        `/api/user/bookings/${userInfo?.id}`
      );
      setSessions(response.data);
    };
    fetchBookingDetails();
  }, [userInfo?.id]);

  // Calculate the index of the first and last session for the current page
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession);

  // Navigate to the next page
  const nextPage = () => {
    if (currentPage < Math.ceil(sessions.length / sessionsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Navigate to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
        <div className="flex justify-center mt-5">
        <div className="h-[80vh] bg-white w-[75%] shadow-md rounded-md overflow-y-auto p-3">
        <h1 className="p-2 font-bold text-2xl">Booked Sessions</h1>

        {currentSessions.length > 0 ? (
          currentSessions.map((session) => (
            <div
              key={session.bookingId}
              className="h-[20vh] bg-blue-50 rounded-xl flex items-center justify-between px-6 mb-4"
            >
              <div className="flex items-center">
                <div className="w-20 h-20 mr-4">
                  <img
                    src={session.trainerImage}
                    alt="trainer-img"
                    className="rounded-full w-full h-full object-cover bg-black"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    {session.trainerName}
                  </h2>
                  <p className="text-gray-600">{session.specialization}</p>

                  <div className="mt-3">
                    {session.sessionType === "Single Session" ? (
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Date: </span>
                        {new Date(session.sessionDates.startDate).toDateString()}
                      </p>
                    ) : (
                        <>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Start Date: </span>
                          {new Date(session.sessionDates.startDate).toDateString()}
                        </p>
                        {session.sessionDates.endDate && (
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">End Date: </span>
                            {new Date(session.sessionDates.endDate).toDateString()}
                          </p>
                        )}
                      </>
                    )}
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Time: </span>
                      {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Session Type: </span>
                      {session.sessionType}
                    </p>
                  </div>
                </div>
              </div>

              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
                <IoChatbubbleEllipsesSharp className="mr-2" /> Chat
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No bookings available</p>
        )}
      </div>
        </div>
      

      {/* Pagination Controls outside the main div */}
      <div className="flex justify-center ml-32 mt-4 w-[75%]">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-l hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">
          Page {currentPage} of {Math.ceil(sessions.length / sessionsPerPage)}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(sessions.length / sessionsPerPage)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-r hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Sessions;