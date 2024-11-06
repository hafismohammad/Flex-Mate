import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import messageService from "../services/messageService";
import ConversationModel from "../models/ConversationModel";

class MessageController {
  async sendMessage(req: Request, res: Response) {
    try {
      const { token, recieverId, message } = req.body;

      if (!token) {
        res.status(400).json({ error: "Token is required" });
        return;
      }

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as { id: string };
      const senderId = decoded.id;

      const sendMessage = await messageService.sendMessage(
        senderId,
        recieverId,
        message
      );
      if (!sendMessage) {
        res.status(200).json([]);
        return;
      }
      res.status(200).json(sendMessage);
    } catch (error) {
      console.log("Error in sendMessage controller", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getMessage(req: Request, res: Response) {
    try {
      const { token, userToChatId } = req.body;

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as { id: string };
      const senderId = decoded.id;

      console.log("get message", senderId, userToChatId);

      const getMessages = await messageService.getMessage(
        senderId,
        userToChatId
      );

      res.status(200).json(getMessages);
    } catch (error) {
      console.log("Error in sendMessage controller", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default MessageController;
