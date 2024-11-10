import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

// Express app initialization
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
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId as string;
  const trainerId = socket.handshake.query.trainerId as string;

  // Map the socket to either the userId or trainerId if available
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected with ID: ${userId}`);
  }

  if (trainerId) {
    userSocketMap[trainerId] = socket.id;
    console.log(`Trainer connected with ID: ${trainerId}`);
  }

  // Emit online users (those with a socket connection)
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);

    // Remove user or trainer from the map based on their ID
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      console.log(`User with ID: ${userId} disconnected`);
    } else if (trainerId && userSocketMap[trainerId]) {
      delete userSocketMap[trainerId];
      console.log(`Trainer with ID: ${trainerId} disconnected`);
    }

    // Emit updated online users list after a disconnection
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };