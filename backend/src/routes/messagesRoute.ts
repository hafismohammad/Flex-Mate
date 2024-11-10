import express from 'express'
import MessageController from '../controllers/messageController'

const router = express.Router()


const messageController = new MessageController() 

router.get('/:token/:id', messageController.getMessage)
router.post('/send',  messageController.sendMessage)

export default router