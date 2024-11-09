import React, { useEffect, useState } from "react";
import Message from "./Message";
import MessageInputBar from "./MessageInputBar";
import { useParams } from "react-router-dom";
import useGetMessage from "../../hooks/useGetMessage";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

function UserChat() {
  const { trainerId } = useParams();
  const { token } = useSelector((state: RootState) => state.user);

  const { messages, loading } = useGetMessage(token!, trainerId!);
  const [localMessages, setLocalMessages] = useState(messages);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const handleNewMessage = (newMessage: any) => {
    setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="w-full lg:max-w-full md:max-w-[450px] flex flex-col h-screen">
      <div className="bg-slate-500 px-4 py-2 mb-2 h-7">
        {/* <span className="label-text">To:</span> <span className="text-gray-900 font-bold">John Doe</span> */}
      </div>

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
