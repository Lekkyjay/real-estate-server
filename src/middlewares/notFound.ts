import { NextFunction, Request, Response } from 'express'

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error(`page ${req.originalUrl} not found!`)
  error.status = 404
  next(error)
}

export default notFound