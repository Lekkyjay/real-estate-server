import express from 'express'
import { getChats, getChat, createChat, readChat, createChatMsg } from '../controllers/chat'
import { verifyToken } from '../middlewares/verifyJwt'

const router = express.Router()

router.get('/', verifyToken, getChats)
router.get('/:id', verifyToken, getChat)
router.post('/', verifyToken, createChat)
router.post('/:chatId/msg', verifyToken, createChatMsg)
router.put('/read/:id', verifyToken, readChat)

export default router