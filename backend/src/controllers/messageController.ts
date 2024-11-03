import {Request, Response} from 'express'
import jwt from 'jsonwebtoken';

import messageService from '../services/messageService'
import { verifyAccessToken } from '../utils/jwtHelper';

class MessageController {
    async sendMessage(req: Request, res: Response) {
        try {
            const {token, recieverId, message} = req.body

            console.log('message',message);
            console.log('token',token);
            console.log('recieverId',recieverId);

            if (!token) {
                 res.status(400).json({ error: 'Token is required' });
                 return
            }

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { id: string };
            const senderId = decoded.id
console.log('senderId',senderId);


            const sendMessage = await messageService.sendMessage(senderId, recieverId, message)

            
        } catch (error) {
            console.log('Error in sendMessage controller', error);
            res.status(500).json({error: 'Internal server error'    })
        }
    }
}

export default MessageController