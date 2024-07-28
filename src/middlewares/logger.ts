import { NextFunction, Request, Response } from 'express'

const logger = (req: Request, res: Response, next: NextFunction) => {
  const dateObj = new Date()

  const date = ('0' + dateObj.getDate()).slice(-2)
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2)
  const year = dateObj.getFullYear()

  const hours = dateObj.getHours()
  const minutes = ('0' + dateObj.getMinutes()).slice(-2)
  const seconds = ('0' + dateObj.getSeconds()).slice(-2)
  
  const fullDate = year + '-' + month + '-' + date + '::' + hours + ':' + minutes + ':' + seconds

  // 2024-07-12::18:10:26  POST http://localhost:5000/api/auth/register
  console.log(`${fullDate} ${res.statusCode}  ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)  
  next()
}

export default logger
