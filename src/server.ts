import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import errorHandler from './middlewares/errorHandler'
import notFound from './middlewares/notFound'
import logger from './middlewares/logger'
import authRoutes from './routes/auth'

const app = express()

app.use(logger)
app.use(express.json())
app.use(cookieParser())
app.use(cors({ 
  origin: process.env.CLIENT_URL,
  credentials: true 
}))

app.use('/api/auth', authRoutes)

//catch all not found errors and forward them to errorHandler
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
