import express from 'express'
import { verifyToken } from '../middlewares/verifyJwt'
import { createProperty, deleteProperty, getProperties, getProperty, updateProperty } from '../controllers/property'

const router = express.Router()

router.get('/', getProperties)
router.get('/:id', getProperty)
router.post('/', verifyToken, createProperty)
router.put('/:id', verifyToken, updateProperty)
router.delete('/:id', verifyToken, deleteProperty)

export default router