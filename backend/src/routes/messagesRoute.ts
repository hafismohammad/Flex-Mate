import express from 'express'
import MessageController from '../controllers/messageController'
import MessageSevice from '../services/messageService'

const router = express.Router()


const messageController = new MessageController() 

router.post('/send',  messageController.sendMessage)
router.get('/', messageController.getMessage)

export default router