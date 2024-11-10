import { useParams } from 'react-router-dom';
import Message from './Message';
import MessageInputBar from './MessageInputBar';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import useGetMessage from '../../hooks/useGetMessage';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:3000"; // Replace with your server URL

function TrainerChat() {
  const { userId } = useParams();
  const { trainerToken, trainerInfo } = useSelector((state: RootState) => state.trainer);
  const { messages, loading } = useGetMessage(trainerToken!, userId!);
  const [localMessages, setLocalMessages] = useState(messages);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize the socket when the component mounts
    const socketInstance = io(SOCKET_SERVER_URL, {
      query: { trainerId: trainerInfo._id, userId: userId }
    });

    setSocket(socketInstance);

    socketInstance.emit("join", trainerInfo.id);

    socketInstance.on("newMessage", (newMessage: any) => {
      setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId, trainerInfo._id, messages]);

  useEffect(() => {
    // Update local messages when messages change
    setLocalMessages(messages);
  }, [messages]);

  const handleNewMessage = (newMessage: any) => {
    setLocalMessages((prevMessages) => [...prevMessages, newMessage]);

    if (socket) {
      socket.emit("sendMessage", { userId, message: newMessage });
    }
  };

  return (
    <div className="w-full lg:max-w-full md:max-w-[450px] flex flex-col h-screen">
      <div className="bg-blue-800 px-4 py-2 mb-2 h-7">
        {/* Optional Header Information */}
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
        <MessageInputBar userId={userId} onNewMessage={handleNewMessage} />
      </div>
    </div>
  );
}

export default TrainerChat;