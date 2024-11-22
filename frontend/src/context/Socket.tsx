

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch } from "react-redux";
import {
  endCallUser,
  setShowIncomingVideoCall,
} from "../features/user/userSlice";
import {
  endCallTrainer,
  setShowVideoCall,
  setRoomId
} from "../features/trainer/trainerSlice";
import toast from "react-hot-toast";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;}): JSX.Element => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { trainerInfo, showVideoCallTrainer } = useSelector(
    (state: RootState) => state.trainer
  );
  const loggedUser = userInfo?.id || trainerInfo?.id || null;
  const dispatch = useDispatch<AppDispatch>();

  const SOCKET_SERVER_URL = "http://localhost:3000";


  useEffect(() => {

    if (!loggedUser) {
      console.warn("No loggedUser; skipping socket initialization.");
      return;
    }

    const query = {
      userId: loggedUser || null,
      // trainerId: trainerInfo?.id || null,
    };

    // Only initialize socket if at least one ID is provided
    if (query.userId) {
      console.log('query.userId', query.userId);
      
      const newSocket = io(SOCKET_SERVER_URL, { query });

      

      newSocket.on("connect",()=>{
        console.log("Socket connected",socket);
        setSocket(newSocket);
      })

      console.log("Initializing socket with query:", query);

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
      });



      // Clean up on component unmount
      return () => {
        console.log("Cleaning up socket...");
        newSocket.disconnect();
      };
    }
  }, [loggedUser]);

  useEffect(() => {
    
    console.log("Socket instance useEffect:", socket);
    console.log("Socket connected useEffect:", socket?.connected);
    if (!socket) return;


    // Event listener setup
    socket.on("incoming-video-call", (data) => {
      console.log("Incoming video call:", data);
      dispatch(
        setShowIncomingVideoCall({
          ...data.from,
          callType: data.callType,
          roomId: data.roomId,
        })
      );
    });
// console.log('accepted-call');

socket.on("accepted-call", (data) => {
  console.log("Call accepted: -->", data.roomId);

  // Dispatch the roomId to the store
  dispatch(setRoomId(data.roomId));

  // Dispatch to show the video call UI
  dispatch(setShowVideoCall(true));
});
    

    socket.on("call-rejected", () => {
      console.log("Call rejected ");
      toast.error("Call ended or rejected");
      dispatch(endCallTrainer());
      dispatch(endCallUser());
    });

    // Clean up listeners on component unmount
    return () => {
      console.log("Cleaning up socket event listeners...");
      socket.off("incoming-video-call");
      socket.off("accepted-call");
      socket.off("call-rejected");
    };
  }, [socket, dispatch]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
























// import {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { useSelector } from "react-redux";
// import io, { Socket } from "socket.io-client";
// import { AppDispatch, RootState } from "../app/store";
// import { useDispatch } from "react-redux";
// import {
//   endCallUser,
//   setShowIncomingVideoCall,
// } from "../features/user/userSlice";
// import {
//   endCallTrainer,
//   setShowVideoCall,
//   setRoomId
// } from "../features/trainer/trainerSlice";
// import toast from "react-hot-toast";

// interface SocketContextType {
//   socket: Socket | null;
// }

// const SocketContext = createContext<any>({ socket: null });

// export const useSocketContext = () => {
//   return useContext(SocketContext);
// };

// export const SocketContextProvider = ({
//   children,
// }: {
//   children: ReactNode;}): JSX.Element => {
//   const [socket, setSocket] = useState<Socket | null>(null);

//   const { userInfo } = useSelector((state: RootState) => state.user);
//   const { trainerInfo, showVideoCallTrainer } = useSelector(
//     (state: RootState) => state.trainer
//   );
// const  loggedUser = userInfo != null ? userInfo.id : trainerInfo.id
//   const dispatch = useDispatch<AppDispatch>();

//   const SOCKET_SERVER_URL = "http://localhost:3000";

//   useEffect(() => {
//     const query = {
//       userId: loggedUser || null,
//       // trainerId: trainerInfo?.id || null,
//     };

//     // Only initialize socket if at least one ID is provided
//     if (query.userId) {
//       console.log('query.userId', query.userId);
      
//       const newSocket = io(SOCKET_SERVER_URL, { query });
//       console.log('newSocket->>',newSocket);
//       console.log('socket-->', socket);
      

//       newSocket.on("connect",()=>{
//         console.log("Socket connected",socket);
//         setSocket(newSocket);
//       })

//       console.log("Initializing socket with query:", query);

//       newSocket.on("connect", () => {
//         console.log("Socket connected:", newSocket.id);
//       });

//       newSocket.on("connect_error", (err) => {
//         console.error("Socket connection error:", err);
//       });

//       newSocket.on("disconnect", () => {
//         console.log("Socket disconnected");
//       });

//       // Clean up on component unmount
//       return () => {
//         console.log("Cleaning up socket...");
//         newSocket.disconnect();
//       };
//     }
//   }, [loggedUser]);

//   useEffect(() => {
    
//     console.log("Socket instance useEffect:", socket);
//     console.log("Socket connected useEffect:", socket?.connected);
//     if (!socket) return;


//     // Event listener setup
//     socket.on("incoming-video-call", (data) => {
//       console.log("Incoming video call:", data);
//       dispatch(
//         setShowIncomingVideoCall({
//           ...data.from,
//           callType: data.callType,
//           roomId: data.roomId,
//         })
//       );
//     });
// // console.log('accepted-call');

// socket.on("accepted-call", (data) => {
//   console.log("Call accepted:", data.roomId);

//   // Dispatch the roomId to the store
//   dispatch(setRoomId(data.roomId));

//   // Dispatch to show the video call UI
//   dispatch(setShowVideoCall(true));
// });
    

//     socket.on("call-rejected", () => {
//       console.log("Call rejected ");
//       toast.error("Call ended or rejected");
//       dispatch(endCallTrainer());
//       dispatch(endCallUser());
//     });

//     // Clean up listeners on component unmount
//     return () => {
//       console.log("Cleaning up socket event listeners...");
//       socket.off("incoming-video-call");
//       socket.off("accepted-call");
//       socket.off("call-rejected");
//     };
//   }, [socket, dispatch]);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };







