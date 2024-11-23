import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

// Store socket IDs mapped to user or trainer IDs
const userSocketMap: Record<string, string> = {}; // { userId: socketId, trainerId: socketId }

export const getReceiverSocketId = (receiverId: string) => {
  console.log('server getReceiverSocketId');
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;
  // const trainerId = socket.handshake.query.trainerId as string;

  // Map the socket to either the userId or trainerId if available
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected with ID: ${userId}`);
  }

  // if (trainerId) {
  //   userSocketMap[trainerId] = socket.id;
  //   console.log(`Trainer connected with ID: ${trainerId}`);
  // }

  // Emit online users (those with a socket connection)
  // io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);

    // Remove user or trainer from the map based on their ID
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      console.log(`User with ID: ${userId} disconnected`);
    } 

    // Emit updated online users list after a disconnection
    // io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // io.on('connection', (socket) => {
  //   console.log(`Socket connected:${socket.id}`);
  
  //   socket.on('sendMessage', (data) => {
  
  //     // Use receiverId as userId or any other logic to determine the right ID
  //     if (userId) {
  //       io.emit('messageUpdate',data) // Emit receiverId as userId
  //       console.log(`Emitted messageUpdate for receiverId: ${data}`);
  //     } else {
  //       console.error("receiverId is missing in sendMessage data");
  //     }
  //   });
  // });
  


  // Handle outgoing video call
  socket.on("outgoing-video-call", (data) => {

    const userSocketId = getReceiverSocketId(data.to);
    if (userSocketId) {
      io.to(userSocketId).emit('incoming-video-call', {
        _id: data.to,
        callType: data.callType,
        trainerName: data.trainerName,
        trainerImage: data.trainerImage,
        roomId: data.roomId,
      });
    } else {
      console.log(`Receiver not found for user ID: ${data.to}`);
    }
  });

  socket.on('accept-incoming-call', (data) => {
    const friendSocketId = getReceiverSocketId(data.to);
    console.log('Data received in accept-incoming-call:', data);
    console.log('Resolved friendSocketId:', friendSocketId);
  
    if (!friendSocketId) {
      console.error('No socket ID found for the receiver');
    } else {
      console.log('Emitting accepted-call to socket:', friendSocketId);
      socket.to(friendSocketId).emit('accepted-call', data);
    }
  });
  

  socket.on('reject-call', async (data) => {
    console.log('call rejected');
    const friendSocketId = getReceiverSocketId(data.to) 
    if (!friendSocketId) {
      console.error('No socket ID found for the receiver');
    }else {
      socket.to(friendSocketId).emit('call-rejected')
    }
  })

  socket.on('leave-room', (data) => {
    // console.log("Received leave-room event for Room ID:", data.roomId, "To:", data.to);
    const friendSocketId = getReceiverSocketId(data.to)
    if (friendSocketId) {
      // console.log('coming here')
      socket.to(friendSocketId).emit('user-left');
    }
  });
});

export { app, io, server };
























  