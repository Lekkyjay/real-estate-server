import express from 'express'
import { deleteUser, getNotificationCount, getUser, getUserProperties, getUsers, toggleSaveProperty, updateUser } from '../controllers/user'
import { verifyToken } from '../middlewares/verifyJwt'

const router = express.Router()

router.get('/', getUsers)
router.get('/properties', verifyToken, getUserProperties)
router.get('/notification', verifyToken, getNotificationCount)
router.get('/:id', getUser)
router.put('/:id', verifyToken, updateUser)
router.delete('/:id', verifyToken, deleteUser)
router.post('/togglesave', verifyToken, toggleSaveProperty)

export default router