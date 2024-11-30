import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Socket, io } from "socket.io-client";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch } from "react-redux";
import { endCallUser, setShowIncomingVideoCall, setRoomIdUser, setShowVideoCallUser, setVideoCallUser } from "../features/user/userSlice";
import { endCallTrainer,setVideoCall, setShowVideoCall, setRoomId , setPrescription} from "../features/trainer/trainerSlice";
import toast from "react-hot-toast";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);
  const loggedUser = userInfo?.id || trainerInfo?.id || null;
  const dispatch = useDispatch<AppDispatch>();

  const newSocket = io("http://localhost:3000", {
    query: { userId: loggedUser },
    transports: ['websocket'],
  });
  
  useEffect(() => {
    if (!loggedUser) {
      console.warn("No loggedUser; skipping socket initialization.");
      setSocket(null); // Ensure socket is cleared when user logs out
      return;
    }

    console.log("Initializing socket for loggedUser:", loggedUser);

    // Initialize socket
    

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setSocket(newSocket); // Update the state after successful connection
    });

    // Cleanup on component unmount or loggedUser change
    return () => {
      console.log("Cleaning up socket...");
      newSocket.disconnect();
      setSocket(null); // Clear the socket state
    };
  }, [loggedUser]);

  useEffect(() => {
    if (!socket) {
      console.warn("Socket instance is null; skipping event listener setup.");
      return;
    }

    console.log("Setting up event listeners for socket:", socket.id);

    

    newSocket.on("incoming-video-call", (data: any) => {
      console.log("Incoming video call:", data);
      dispatch(
        setShowIncomingVideoCall({
          _id: data._id,
          trainerId: data.from,
          callType: data.callType,
          trainerName: data.trainerName,
          trainerImage: data.trainerImage,
          roomId: data.roomId,
        })
      );
    });

    newSocket.on("accepted-call", (data: any) => {
      // alert('hit accep call client')
      console.log("Call accepted: -->", data);
      dispatch(setRoomId(data.roomId));
      dispatch(setShowVideoCall(true));

      newSocket.emit("trainer-call-accept", {
        roomId: data.roomId,
        trainerId: data.from, 
        to: data._id,      
    });
    });

    newSocket.on('trianer-accept', (data: any) => {
      dispatch(setRoomId(data.roomId))
      dispatch(setShowVideoCall(true))
    })

    newSocket.on("call-rejected", () => { 
      toast.error("Call ended or rejected --------<<<>>>");
      dispatch(setVideoCall(null))
      dispatch(endCallTrainer());
      dispatch(endCallUser());
    });

    newSocket?.on("user-left", (data) => {
      console.log("User left the room:", data);
    
      // If the user who left is the logged-in user
      if (data === userInfo?.id) {
        dispatch(setPrescription(true))
        dispatch(setShowVideoCallUser(false));
        dispatch(setRoomIdUser(null));
        dispatch(setVideoCallUser(null));
        dispatch(setShowIncomingVideoCall(null));
      } 
      
      // If the user who left is not the logged-in user (likely the other party in the call)
      else if (data === trainerInfo?.id) {
        
        dispatch(setPrescription(true))
        dispatch(setShowVideoCall(false));
        dispatch(setRoomId(null));
        dispatch(setVideoCall(null));
      }
    });
    

    // Cleanup event listeners on socket change or component unmount
    return () => {
      console.log("Cleaning up socket event listeners...");
      socket.off("incoming-video-call");
      socket.off("accepted-call");
      newSocket.off("call-rejected");
    };
  }, [newSocket, dispatch]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;

}

