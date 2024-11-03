// src/services/messageService.ts
import MessageModel, { IMessage } from '../models/MessageModel';
import UserModel from '../models/userModel';
import TrainerModel from '../models/trainerModel';
import ConversationModel from '../models/ConversationModel';
import mongoose from 'mongoose';

class MessageService {
    async sendMessage(
        senderId: string,
        receiverId: string,
        message: string
    ): Promise<IMessage> {
        let senderModel: 'User' | 'Trainer' | null = null;
        let receiverModel: 'User' | 'Trainer' | null = null;

        // Validate sender model
        if (await UserModel.exists({ _id: senderId })) {
            senderModel = 'User';
        } else if (await TrainerModel.exists({ _id: senderId })) {
            senderModel = 'Trainer';
        }

        // Validate receiver model
        if (await UserModel.exists({ _id: receiverId })) {
            receiverModel = 'User';
        } else if (await TrainerModel.exists({ _id: receiverId })) {
            receiverModel = 'Trainer';
        }

        // If either sender or receiver ID is invalid, throw an error
        if (!senderModel || !receiverModel) {
            throw new Error('Invalid sender or receiver ID');
        }

        let existingConversation = await ConversationModel.findOne({
            participants: {
                $all: [
                    { participantId: new mongoose.Types.ObjectId(senderId), participantModel: senderModel },
                    { participantId: new mongoose.Types.ObjectId(receiverId), participantModel: receiverModel }
                ]
            }
        });

        if (!existingConversation) {
            existingConversation = new ConversationModel({
                participants: [
                    { participantId: new mongoose.Types.ObjectId(senderId), participantModel: senderModel },
                    { participantId: new mongoose.Types.ObjectId(receiverId), participantModel: receiverModel }
                ],
                messages: [] 
            });
            await existingConversation.save();
        }

        const newMessage = new MessageModel({
            senderId: new mongoose.Types.ObjectId(senderId),
            receiverId: new mongoose.Types.ObjectId(receiverId),
            message,
            senderModel,
            receiverModel,
            conversationId: existingConversation._id, 
        });

        const savedMessage: IMessage = await newMessage.save();

        existingConversation.messages.push(savedMessage._id as mongoose.Types.ObjectId);
        await existingConversation.save();

        return savedMessage; 
    }
}

export default new MessageService();