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
import { endCallUser, setRoomId, setShowIncomingVideoCall } from "../features/user/userSlice";
import { endCallTrainer, setShowVideoCall } from "../features/trainer/trainerSlice";
import toast from "react-hot-toast";

interface SocketContextType {
  socket: Socket | null;
  onlineUser: any;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUser: null,
});

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUser, setOnlineUser] = useState<any>(null);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);

  const dispatch = useDispatch<AppDispatch>()

  const SOCKET_SERVER_URL = "http://localhost:3000";

  useEffect(() => {
    const query = {
        userId: userInfo?.id || null,
        trainerId: trainerInfo?.id || null,
    };

    // Ensure query has at least one valid ID
    if (query.userId || query.trainerId) {
        console.log('Initializing socket with query:', query);

        const newSocket = io(SOCKET_SERVER_URL, {
            query,
            transports: ['websocket'], // Ensure WebSocket is used
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        return () => {
            newSocket.close();
        };
    }
}, [userInfo, trainerInfo]);


  useEffect(() => {
    socket?.on('incoming-video-call', (data) => {
      console.log('hit incomming-video-call in socket context');
      
      console.log('client connected', data);
      dispatch(setShowIncomingVideoCall({ ...data.from, calType: data.callType, roomId: data.roomId}))
    })

    socket?.on('accept-call', (data) => {
      dispatch(setRoomId(data.roomId))
      dispatch(setShowVideoCall(true))
    })

    socket?.on('call-rejected', () => {
      if(userInfo === null) {
        toast.error('Your call has been rejected')
      } else {
        toast.error('Call ended')
      }

      dispatch(endCallTrainer())
      dispatch(endCallUser())
    })
    return ()=>{
      socket?.off('incoming-video-call')
    }
  },[socket])

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
