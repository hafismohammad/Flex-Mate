import axiosInstance from "../../../axios/trainerAxiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface User {
  userId: string;
  userName: string; 
  email: string;
}

function ChatSideBar() {
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const trainerId = trainerInfo.id;
  const [users, setUsers] = useState<User[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`/api/trainer/bookingDetails/${trainerId}`);
        const confirmedBookings = response.data.filter((bookings: any) => bookings.paymentStatus === 'Confirmed' )

        const seenUserId = new Set()
        const uniqueUser = confirmedBookings.filter((booking: any) => {
          if(seenUserId.has(booking.userId)) {
            return false
          } 
          seenUserId.add(booking.userId)
          return true
        })
        setUsers(uniqueUser);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [trainerId]);
// console.log('users',users);

  const handleChat = (userId: string) => {
    navigate(`/trainer/trainerChat/${userId}`);
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Chats</h2>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div
              key={user.userId}
              className={`flex items-center justify-between mb-4 `}
            >
              <div className="flex items-center">
                <img
                  className="h-12 w-12 bg-slate-400 rounded-full"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                  alt={`${user.userName}'s Avatar`}
                />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">{user.userName}</h3>
                </div>
              </div>
              <button
                onClick={() => handleChat(user.userId)}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
              >
                <IoChatbubbleEllipsesSharp className="mr-2" /> Chat
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 py-8">
            <p>No users found to chat with.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatSideBar;
