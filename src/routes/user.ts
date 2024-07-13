import express from 'express'
import { deleteUser, getUser, getUsers, updateUser } from '../controllers/user'
import { verifyToken } from '../middlewares/verifyJwt'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', verifyToken, updateUser)
router.delete('/:id', verifyToken, deleteUser)

export default router