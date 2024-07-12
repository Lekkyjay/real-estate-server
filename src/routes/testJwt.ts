import express from 'express'
import { shouldBeLoggedIn } from '../controllers/testJwt'
import { verifyToken } from '../middlewares/verifyJwt'

const router = express.Router()

router.get('/', verifyToken, shouldBeLoggedIn)

export default router