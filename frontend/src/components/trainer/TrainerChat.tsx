import { useParams } from 'react-router-dom';
import Message from './Message';
import MessageInputBar from './MessageInputBar';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import useGetMessage from '../../hooks/useGetMessage';
import { useEffect, useRef, useState } from 'react';
import { setVideoCall } from '../../features/trainer/trainerSlice';
import { useDispatch } from 'react-redux';
import { useSocketContext } from '../../context/Socket';
import axiosInstance from '../../../axios/trainerAxiosInstance';
import { User } from '../../types/user';
import { Trainer } from '../../types/trainer';
import { FaVideo, FaHistory } from "react-icons/fa";
import MessageSkeleton from '../skeleton/MessageSkeleton';

interface TrainerChatProps {
  userId: string;
  bookingId: string | null; 
}

function TrainerChat({ userId, bookingId }: TrainerChatProps) {
  const [userData, setUserData] = useState<User | null>(null);
  const [trainerData, setTrainerData] = useState<Trainer | null>(null);
  const { trainerToken, trainerInfo } = useSelector((state: RootState) => state.trainer);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { messages, loading } = useGetMessage(trainerToken!, userId!);
  const [localMessages, setLocalMessages] = useState(messages);
  const [booking_id, setBooking_id] = useState<string | null>(null);

  let { socket } = useSocketContext();
  const dispatch = useDispatch<AppDispatch>();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setBooking_id(bookingId)
  },[userId])


  

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await axiosInstance.get(`/api/trainer/users/${userId}`);
      setUserData(response.data);
    };
    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    const fetchTrainer = async () => {
      const response = await axiosInstance.get(`/api/trainer/${trainerInfo.id}`);
      setTrainerData(response.data.trainerData[0]);
    };
    fetchTrainer();
  }, [trainerInfo.id, userId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", trainerInfo?.id || userInfo?.id);

    const handleNewMessage = (newMessage: any) => {
      setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("messageUpdate", handleNewMessage);

    return () => {
      socket.off("messageUpdate", handleNewMessage);
    };
  }, [socket, trainerInfo?.id, userInfo?.id]);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages, socket]);

  const handleNewMessage = (newMessage: any) => {
    setLocalMessages((prevMessages) => {
      const isDuplicate = prevMessages.some(
        (msg) => msg._id === newMessage._id || (msg.createdAt === newMessage.createdAt && msg.message === newMessage.message)
      );
      return isDuplicate ? prevMessages : [...prevMessages, newMessage];
    });
  };

  // const handleNewMessage = (newMessage: any) => {
  //   setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
  // };

  

  const navigateVideoChat = () => {
    
    dispatch(
      setVideoCall({
        userID: userId || "",
        type: "out-going",
        callType: "video",
        roomId: `${Date.now()}`,
        userName: `${userData?.name}`,
        userImage: `${userData?.image}`,
        trainerName: `${trainerData?.name}`,
        trainerImage: `${trainerData?.profileImage}`, 
        bookingId: `${bookingId}`
      })
    );
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  return (
    <div className="w-full lg:max-w-full md:max-w-[450px] flex flex-col h-[82vh] ">
      <div className=" bg-gray-500 px-4 py-2 mb-2 h-14 flex justify-between sticky top-0 z-10">
        <div className="flex items-start gap-5">
          <img className="h-10 w-10 rounded-full" src={userData?.image} alt="" />
          <h1 className="text-lg text-white font-medium">{userData?.name}</h1>
        </div>
    
       <button className="flex justify-center gap-3 bg-blue-500 px-4 py-2 rounded-lg" onClick={navigateVideoChat}>
          <h1 className="text-1xl text-white">Start Session</h1>
          <FaVideo className="h-6 w-6" />
        </button>
       
   
      </div>

      <div className="px-4 flex-1 overflow-y-auto mt-2 overflow-x-hidden ">
        {loading ? (
            <div><MessageSkeleton /></div>
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
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-2 border-t border-gray-700 bg-gray-800 ">
        <MessageInputBar userId={userId} onNewMessage={handleNewMessage} />
      </div>

 
    </div>
  );
}

export default TrainerChat;
