import { NextFunction, Request, Response } from 'express'
import { pool } from '../dbConn'
import CustomError from '../utils/customError'

const getUsers = async (req: Request, res: Response, next: NextFunction) => {  
  try {    

    return res.status(200).send({
      message: 'getUsers successful.',
      data: null,
      success: true
    })

  } 
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}


const getUser = async (req: Request, res: Response, next: NextFunction) => {  
  try {    

    return res.status(200).send({
      message: 'getUser successful.',
      data: null,
      success: true
    })

  } 
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}


const updateUser = async (req: Request, res: Response, next: NextFunction) => {  
  try {    

    return res.status(200).send({
      message: 'User updated successfully.',
      data: null,
      success: true
    })

  } 
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}


const deleteUser = async (req: Request, res: Response, next: NextFunction) => {  
  try {    

    return res.status(200).send({
      message: 'Deleted user successfully.',
      data: null,
      success: true
    })

  } 
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}

export { getUsers, getUser, updateUser, deleteUser }