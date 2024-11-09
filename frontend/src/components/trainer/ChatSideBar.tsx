import axios from "axios";
import { useEffect, useState } from "react";
import API_URL from "../../../axios/API_URL";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
  // Add other fields you may need from the user data
}

function ChatSideBar() {
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const trainerId = trainerInfo.id;
  const [users, setUsers] = useState<User[]>([]);


  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/messages/users/${trainerId}`);
        
        // Extract unique users where the model is "User"
        const uniqueUsersMap = new Map();
        response.data.forEach((message: any) => {
          const user = message.senderModel === "User" ? message.senderId : message.receiverId;
          if (user && !uniqueUsersMap.has(user._id)) {
            uniqueUsersMap.set(user._id, user);
          }
        });

        // Convert the Map back to an array
        setUsers(Array.from(uniqueUsersMap.values()));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [trainerId]);

  const handleChat = (userId: string) => {
    navigate(`/trainer/trainerChat/${userId}`);
  };


  return (
   <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Chats</h2>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        {users.map((user, index) => (
          <div
            key={user._id}
            className={`flex items-center justify-between mb-4 ${
              index !== users.length - 1 ? "border-b border-gray-300 pb-4" : ""
            }`}
          >
            <div className="flex items-center">
              <img
                className="h-12 w-12 bg-slate-400 rounded-full"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                alt={`${user.name}'s Avatar`}
              />
              <div className="ml-4">
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
              </div>
            </div>
            <button onClick={() => handleChat(user._id)} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
              <IoChatbubbleEllipsesSharp className="mr-2" /> Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatSideBar;
