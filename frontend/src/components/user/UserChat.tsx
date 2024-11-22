import React, { useEffect, useState } from "react";
import Message from "./Message";
import MessageInputBar from "./MessageInputBar";
import { useParams } from "react-router-dom";
import useGetMessage from "../../hooks/useGetMessage";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { io, Socket } from "socket.io-client";
import {useSocketContext} from '../../context/Socket'
import axios from "axios";
import API_URL from "../../../axios/API_URL";
import userAxiosInstance from "../../../axios/userAxionInstance";
import { User } from "../../types/user";

// const SOCKET_SERVER_URL = "http://localhost:3000"; // Replace with your server URL


interface TrainerChatProps {
  trainerId: string;
}

function UserChat({ trainerId }: TrainerChatProps) {
  const [trainerData, setTrainerData] = useState<{name: string, profileImage: string} | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  // const { trainerId } = useParams();
  const { token, userInfo } = useSelector((state: RootState) => state.user);
  const { messages, loading } = useGetMessage(token!, trainerId!);
  const [localMessages, setLocalMessages] = useState(messages);
  // const [socket, setSocket] = useState<Socket | null>(null);
  
  const {  trainerInfo } = useSelector((state: RootState) => state.trainer);
  let {socket}  = useSocketContext()

useEffect(() => {
  const trainerData = async () => { 
   const response =  await axios(`${API_URL}/api/user/trainers/${trainerId}`)
    setTrainerData(response.data[0])
  }
  trainerData()
},[socket,trainerData])

useEffect(() => {
  const trainerData = async () => { 
   const response =  await userAxiosInstance(`/api/user/users/${userInfo?.id}`)
    setUserData(response.data)
  }
  trainerData()
},[socket,userData])



useEffect(() => {
  if (!socket) return;

  socket.emit("join", trainerInfo?.id || userInfo?.id);

  const handleNewMessage = (newMessage: any) => {
    setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("newMessage", handleNewMessage); 
  };
}, [socket, trainerInfo?.id, userInfo?.id]);



useEffect(() => {
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


  return (
    <div className="w-full lg:max-w-full md:max-w-[450px] flex flex-col h-screen">
      <div className="bg-gray-500 px-4 py-2 mb-2 h-14 flex justify-between sticky top-0 z-10 ">
       <div className="flex items-start gap-5">
       <img className="h-10 w-10 rounded-full " src={trainerData?.profileImage} alt="profile" />
       <h1 className="text-lg font-medium text-white">{trainerData?.name}</h1>
       </div>
      </div>
      <div className="px-4 flex-1 overflow-y-auto mt-2 overflow-x-hidden ">
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
              trainerImage={trainerData?.profileImage}
            />
          ))
        )}
      </div>

      <div className="px-4 py-2 border-t border-gray-700 bg-gray-800 sticky bottom-0 z-10">
        <MessageInputBar trainerId={trainerId} onNewMessage={handleNewMessage} />
      </div>
    </div>
  );
}

export default UserChat;