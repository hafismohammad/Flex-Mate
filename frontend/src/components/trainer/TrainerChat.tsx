import { useParams } from 'react-router-dom';
import Message from './Message';
import MessageInputBar from './MessageInputBar';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import useGetMessage from '../../hooks/useGetMessage';
import { useEffect, useState } from 'react';
import {setVideoCall} from '../../features/trainer/trainerSlice'
import { useDispatch } from 'react-redux';
import {useSocketContext} from '../../context/Socket'
import axiosInstance from '../../../axios/trainerAxiosInstance';
import { User } from '../../types/user';
import { Trainer } from '../../types/trainer';
import { FaVideo } from "react-icons/fa";
const SOCKET_SERVER_URL = "http://localhost:3000"; 

function TrainerChat() {
  const [userData, setUserData] = useState<User | null>(null)
  const [traierData, setTrainerData] = useState<Trainer | null>(null)
  const { userId } = useParams();
  const { trainerToken, trainerInfo } = useSelector((state: RootState) => state.trainer);
  const {  userInfo } = useSelector((state: RootState) => state.user);
  const { messages, loading } = useGetMessage(trainerToken!, userId!);
  const [localMessages, setLocalMessages] = useState(messages);
  // const [socket, setSocket] = useState<Socket | null>(null);
  let {socket}  = useSocketContext()
  const dispatch = useDispatch<AppDispatch>()
console.log('traierData', traierData);


  useEffect(() => {
    const fetchUserDetais = async () => {
      const response = await axiosInstance.get(`/api/trainer/users/${userId}`)
      setUserData(response.data)
    }
    fetchUserDetais()
  },[])

  useEffect(() => {
    const fetchTrainer = async() => {
      const response = await axiosInstance.get(`/api/trainer/${trainerInfo.id}`)
      setTrainerData(response.data.trainerData[0])
    }
    fetchTrainer()
  })

  useEffect(() => {
    if (!socket) return;
  
    // Ensure the socket joins the correct room
    socket.emit("join", trainerInfo?.id || userInfo?.id);
  
    const handleNewMessage = (newMessage: any) => {
      setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
    };
  
    // Add the event listener
    socket.on("newMessage", handleNewMessage);
  
    // Clean up the listener on unmount or when dependencies change
    return () => {
      socket.off("newMessage", handleNewMessage); // Removes only this specific listener
    };
  }, [socket, trainerInfo?.id, userInfo?.id]);
  

  useEffect(() => {
    // Update local messages when messages change
    setLocalMessages(messages);
  }, [messages]);

  const handleNewMessage = (newMessage: any) => {
    setLocalMessages((prevMessages) => {
      const isDuplicate = prevMessages.some(
        (msg) => msg._id === newMessage._id || (msg.createdAt === newMessage.createdAt && msg.message === newMessage.message)
      );
      return isDuplicate ? prevMessages : [...prevMessages, newMessage];
    });
  };
  

  const navigateVideoChat = () => {
    
    dispatch(
      setVideoCall({
        userID: userId || "", // Provide a fallback if userId is undefined
        type: "out-going",
        callType: "video",
        roomId: `${Date.now()}`,
        userImage: "https://path-to-user-image.com", // Replace with actual data
        trainerImage: "https://path-to-trainer-image.com", // Replace with actual data
        name: trainerInfo?.name || "Trainer", // Ensure a fallback for name
        // appointmentId: null,
      })
    );
  };

  

  return (
    <div className="w-full lg:max-w-full md:max-w-[450px] flex flex-col h-screen">
      <div className="bg-blue-800 px-4 py-2 mb-2 h-12 flex justify-between">
      <div className="flex items-start  gap-5">
       <img className="h-10 w-10 rounded-full" src={userData?.image} alt="" />
       <h1 className="text-lg text-white font-medium">{userData?.name}</h1>
       </div>
      <button onClick={navigateVideoChat}>
      <div className='flex justify-center gap-3'>
        <h1 className='text-lg text-white'>Start Session</h1>
      <FaVideo className="h-8 w-8 " />
      </div>
      </button>
      </div>

      <div className="px-4 flex-1 overflow-auto mt-2">
        {loading ? (
          <div>Loading...</div>
        ) : (
          localMessages.map((msg, index) => (
            <Message
              key={index}
              sender={msg.senderModel.charAt(0).toUpperCase() + msg.senderModel.slice(1) as 'User' | 'Trainer'}
              message={msg.message}
              time={new Date(msg.createdAt).toLocaleTimeString()}
              userImage={userData?.image}
              trainerImage={traierData?.profileImage}
            />
          ))
        )}
      </div>

      <div className="px-4 py-2 border-t border-gray-700 bg-gray-800">
        <MessageInputBar userId={userId} onNewMessage={handleNewMessage} />
      </div>
    </div>
  );
}

export default TrainerChat;