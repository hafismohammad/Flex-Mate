import React from "react";
import Message from "./Message";
import MessageInputBar from "./MessageInputBar";
import { useParams } from "react-router-dom";

function UserChat() {
  const { trainerId } = useParams();
  
  return (
    <div className="w-full lg:max-w-full md:max-w-[450px] flex flex-col h-screen">
      <div className="bg-slate-500 px-4 py-2 mb-2">
        <span className="label-text">To:</span> <span className="text-gray-900 font-bold">John Doe</span>
      </div>
      
      <div className="px-4 flex-1 overflow-auto">
        <Message />
        <Message />
        <Message />
        <Message />
      </div>
      
      <div className="px-4 py-2 border-t border-gray-700 bg-gray-800">
        <MessageInputBar trainerId={trainerId} />
      </div>
    </div>
  );
}

export default UserChat;
