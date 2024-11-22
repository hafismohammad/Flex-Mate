import axiosInstance from "../../../axios/trainerAxiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../../context/Socket";
import TrainerChat from "./TrainerChat";

interface User {
  userId: string;
  userName: string;
  email: string;
  userImage: string;
  hasNewMessage: boolean;
}

function ChatSideBar() {
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const trainerId = trainerInfo.id;
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { socket } = useSocketContext();
  const navigate = useNavigate();

  // Fetch users with confirmed bookings
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

        setUsers(uniqueUsers.map((booking: any) => ({
          userId: booking.userId,
          userName: booking.userName,
          email: booking.email,
          userImage: booking.userImage,
          hasNewMessage: false,
        })));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [trainerId]);

  // Handle new message updates via socket
  useEffect(() => {
    const handleNewMessage = (data: { userId: string }) => {
      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers];
        const index = updatedUsers.findIndex((user) => user.userId === data.userId);

        if (index > -1) {
          updatedUsers[index] = {
            ...updatedUsers[index],
            hasNewMessage: true,
          };

          // Move user to the top of the list
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

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === userId ? { ...user, hasNewMessage: false } : user
      )
    );
  };

  return (
    <div className="flex">
      <div className="p-6 bg-gray-100 min-h-screen w-1/4">
  
        <div className="bg-white shadow-lg rounded-lg p-2">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.userId}
                onClick={() => handleUserSelect(user.userId)}
                className={`flex items-center justify-between mb-2 border-b border-gray-200 pb-2 cursor-pointer rounded-md ${
                  selectedUserId === user.userId
                    ? "bg-blue-400 text-white"
                    : "bg-blue-100 text-gray-800"
                }  transition-all`}
              >
                <div className="flex items-center">
                  <img
                    className="h-10 w-10  rounded-full"
                    src={user.userImage || "/default-avatar.png"}
                    alt={`${user.userName}'s Avatar`}
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">{user.userName}</h3>
                    {user.hasNewMessage && (
                      <span className="text-sm text-red-500">New Message</span>
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
      </div>


      <div className="w-[900px] ml-4 h-[600px]  overflow-auto shadow-lg">
        {selectedUserId ? (
          <TrainerChat userId={selectedUserId} />
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
