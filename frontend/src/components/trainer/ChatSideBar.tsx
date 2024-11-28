import axiosInstance from "../../../axios/trainerAxiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../../context/Socket";
import TrainerChat from "./TrainerChat";
import axios from "axios";
import API_URL from "../../../axios/API_URL";
import { IVideoCall } from "../../types/common";

interface User {
  userId: string;
  userName: string;
  email: string;
  userImage: string;
  hasNewMessage: boolean;
  bookingId: string;
}

function ChatSideBar() {
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const trainerId = trainerInfo.id;
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [callHistory, setCallHistory] = useState<IVideoCall[]>([]);
  const [isHistory, setIsHistory] = useState(false);

  const { socket } = useSocketContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCallHistory = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/messages/call-history/${trainerId}`
        );
        console.log('history',response);
        
        setCallHistory(response.data || []);
      } catch (error) {
        console.error("Error fetching call history:", error);
      }
    };
    fetchCallHistory();
  }, [trainerId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/trainer/booking-details/${trainerId}`
        );

        const confirmedBookings = response.data.filter(
          (booking: any) => booking.paymentStatus === "Confirmed"
        );

        const seenUserId = new Set();
        const uniqueUsers = confirmedBookings.filter((booking: any) => {
          if (seenUserId.has(booking.userId)) {
            return false;
          }
          seenUserId.add(booking.userId);
          return true;
        });

        setUsers(
          uniqueUsers.map((booking: any) => ({
            userId: booking.userId,
            userName: booking.userName,
            email: booking.email,
            userImage: booking.userImage,
            bookingId: booking.bookingId,
            hasNewMessage: false,
          }))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [trainerId, axiosInstance]);

  useEffect(() => {
    const handleNewMessage = (data: { userId: string }) => {
      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers];
        const index = updatedUsers.findIndex(
          (user) => user.userId === data.userId
        );

        if (index > -1) {
          updatedUsers[index] = {
            ...updatedUsers[index],
            hasNewMessage: true,
          };

          const [user] = updatedUsers.splice(index, 1);
          updatedUsers.unshift(user);
        }
        return updatedUsers;
      });
    };

    socket?.on("messageUpdate", handleNewMessage);

    return () => {
      socket?.off("messageUpdate", handleNewMessage);
    };
  }, [socket]);

  const handleUserSelect = (userId: string, booking: string) => {
    setSelectedUserId(userId);
    setBookingId(booking);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === userId ? { ...user, hasNewMessage: false } : user
      )
    );
  };

  const handleClick = (type: string) => {
    setIsHistory(type === "history");
  };

  return (
    <div className="flex">
      <div className="p-6 bg-gray-100 min-h-screen w-1/4">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleClick("chats")}
            className={`${
              !isHistory ? "bg-blue-600" : "bg-gray-400"
            } text-white p-2 rounded`}
          >
            Chats
          </button>
          <button
            onClick={() => handleClick("history")}
            className={`${
              isHistory ? "bg-blue-600" : "bg-gray-400"
            } text-white p-2 rounded`}
          >
            Call History
          </button>
        </div>
        {!isHistory ? (
          <div className="bg-white shadow-lg rounded-lg p-2 mt-4">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.userId}
                  onClick={() => handleUserSelect(user.userId, user.bookingId)}
                  className={`flex items-center justify-between mb-2 cursor-pointer p-2 rounded-md ${
                    selectedUserId === user.userId
                      ? "bg-blue-400 text-white"
                      : "bg-blue-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.userImage || "/default-avatar.png"}
                      alt={`${user.userName}'s Avatar`}
                    />
                    <div className="ml-4">
                      <h3 className="font-semibold">{user.userName}</h3>
                      {user.hasNewMessage && (
                        <span className="text-sm text-red-500">
                          New Message
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 py-8">
                <p>No users found to chat with.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            {callHistory.length > 0 ? (
              callHistory.map((call) => (
                <div key={call.roomId} className="flex mb-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={call.userId?.image || "/default-avatar.png"}
                    alt={call.userId?.name || "User"}
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">
                      {call.userId?.name || "Unknown User"}
                    </h3>
                    <p className="text-sm text-gray-500">Out going</p>
                  </div>
                  <h1>{new Date(call.startedAt).toLocaleTimeString()}</h1>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600">
                <p>No call history available.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex-1 ml-4 h-[600px] overflow-auto shadow-lg">
        {selectedUserId ? (
          <TrainerChat userId={selectedUserId} bookingId={bookingId} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-xl">
              Select a user to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatSideBar;


