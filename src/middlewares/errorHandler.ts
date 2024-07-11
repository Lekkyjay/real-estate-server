import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import CustomError from '../utils/customError'

function errorHandler(error: any | CustomError, req: Request, res: Response, next: NextFunction) {
  const status = error.status || 500
  const message = error.message || 'Something went wrong'  
  
  //for errors thrown by express itself or 3rd party dependencies (e.g mongoDb, postgres). unexpected errors.
  if (!(error instanceof CustomError)) {
    console.log('Error detected!', error)
    return res.status(status).send({ 
      message: 'We are currently solving a server problem. Please check back later',
      success: false,
      data: null,
      stack: error.stack
    })
  }

  //for custom errors. expected errors. errors with customized messages thrown by developer anywhere in the application
  console.log('Custom Error detected!', error)
  res.status(status).send({ 
    message,
    success: false,
    data: null,
    stack: error.stack
  })
}

export default errorHandler
