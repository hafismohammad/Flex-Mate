import express from 'express'
import MessageController from '../controllers/messageController'
import MessageSevice from '../services/messageService'

const router = express.Router()


const messageController = new MessageController() 

router.post('/send',  messageController.sendMessage)

export default router