import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';
import { RootState } from '../app/store';

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

export const SocketContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUser, setOnlineUser] = useState<any>(null);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { trainerInfo } = useSelector((state: RootState) => state.trainer);

  const SOCKET_SERVER_URL = 'http://localhost:3000';

  useEffect(() => {
    // If both userInfo and trainerInfo are available, send both IDs in the query
    const query = {
      userId: userInfo?.id || null,
      trainerId: trainerInfo?.id || null,
    };

    // Check if either userInfo or trainerInfo exists
    if (query.userId || query.trainerId) {
      const newSocket = io(SOCKET_SERVER_URL, { query });

      setSocket(newSocket);

      newSocket.on('getOnlineUsers', (users) => {
        setOnlineUser(users);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [userInfo, trainerInfo]);

  return <SocketContext.Provider value={{ socket, onlineUser }}>{children}</SocketContext.Provider>;
};
