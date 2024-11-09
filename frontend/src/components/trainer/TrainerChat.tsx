import { useParams } from 'react-router-dom'
import Message from './Message'
import MessageInputBar from './MessageInputBar'
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import useGetMessage from '../../hooks/useGetMessage';
import { useEffect, useState } from 'react';


function TrainerChat() {

  const { userId } = useParams();
  const { trainerToken } = useSelector((state: RootState) => state.trainer);
  const { messages, loading } = useGetMessage(trainerToken!, userId!);
  const [localMessages, setLocalMessages] = useState(messages);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const handleNewMessage = (newMessage: any) => {
    setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
  };
console.log('messages', messages);

  return (
<div className="w-full lg:max-w-full md:max-w-[450px] flex flex-col h-screen">
      <div className="bg-blue-800 px-4 py-2 mb-2 h-7">
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
      <MessageInputBar userId={userId} onNewMessage={handleNewMessage}/>
      </div>
    </div>
  )
}

export default TrainerChat