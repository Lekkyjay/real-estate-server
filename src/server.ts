import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import errorHandler from './middlewares/errorHandler'
import notFound from './middlewares/notFound'
import logger from './middlewares/logger'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import propertyRoutes from './routes/property'
import chatRoutes from './routes/chat'
import testRoute from './routes/testJwt'

const app = express()

app.use(logger)
app.use(express.json())
app.use(cookieParser())
app.use(cors({ 
  origin: [process.env.CLIENT_URL_DEV as string, process.env.CLIENT_URL_PROD as string],
  credentials: true 
}))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/test', testRoute)

//catch all not found errors and forward them to errorHandler
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
