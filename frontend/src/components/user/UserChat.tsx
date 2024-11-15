import React, { useEffect, useState } from "react";
import Message from "./Message";
import MessageInputBar from "./MessageInputBar";
import { useParams } from "react-router-dom";
import useGetMessage from "../../hooks/useGetMessage";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000"; // Replace with your server URL

let socket: Socket;

function UserChat() {
  const { trainerId } = useParams();
  const { token, userInfo } = useSelector((state: RootState) => state.user);
  const { messages, loading } = useGetMessage(token!, trainerId!);
  const [localMessages, setLocalMessages] = useState(messages);
  const [socket, setSocket] = useState<Socket | null>(null);

// console.log('messages',messages);

useEffect(() => {
  // Initialize the socket when the component mounts
  const socketInstance = io(SOCKET_SERVER_URL, {
    query: { userId: userInfo?.id, trainerId: trainerId }
  });  

  setSocket(socketInstance);

  socketInstance.emit("join", userInfo?.id);

  socketInstance.on("newMessage", (newMessage: any) => {
    setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
  });

  // Clean up on unmount
  return () => {
    socketInstance.disconnect();
  };
}, [trainerId, userInfo?.id, messages]);

useEffect(() => {
  setLocalMessages(messages);
}, [messages]);

const handleNewMessage = (newMessage: any) => {
  // console.log("Sending new message:", newMessage);
  setLocalMessages((prevMessages) => [...prevMessages, newMessage]);

  // Emit the message event to the server
  if (socket) {
    socket.emit("sendMessage", { trainerId: trainerId, message: newMessage });
  }
};

  return (
    <div className="w-full lg:max-w-full md:max-w-[450px] flex flex-col h-screen">
      <div className="bg-slate-500 px-4 py-2 mb-2 h-7"></div>

      <div className="px-4 flex-1 overflow-auto">
        {loading ? (
          <div>Loading...</div>
        ) : (
          localMessages.map((msg, index) => (
            <Message
              key={index}
              sender={msg.senderModel.charAt(0).toUpperCase() + msg.senderModel.slice(1) as 'User' | 'Trainer'}
              message={msg.message}
              time={new Date(msg.createdAt).toLocaleTimeString()}
              avatarUrl="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
            />
          ))
        )}
      </div>

      <div className="px-4 py-2 border-t border-gray-700 bg-gray-800">
        <MessageInputBar trainerId={trainerId} onNewMessage={handleNewMessage} />
      </div>
    </div>
  );
}

export default UserChat;