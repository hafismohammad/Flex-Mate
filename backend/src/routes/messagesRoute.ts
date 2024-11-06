import express from 'express'
import MessageController from '../controllers/messageController'

const router = express.Router()


const messageController = new MessageController() 

router.post('/send',  messageController.sendMessage)
router.get('/', messageController.getMessage)

export default router