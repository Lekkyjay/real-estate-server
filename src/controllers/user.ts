import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../dbConn'
import CustomError from '../utils/customError'

const getUsers = async (req: Request, res: Response, next: NextFunction) => {  
  try {    
    const users = await pool.query('SELECT * FROM users')     

    return res.status(200).send({
      message: 'getUsers successful.',
      data: users.rows,
      success: true
    })

  } 
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}


const getUser = async (req: Request, res: Response, next: NextFunction) => {  
  const { id } = req.params
  try {    
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    
    return res.status(200).send({
      message: 'getUser successful.',
      data: user.rows[0],
      success: true
    })
  } 
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}


const updateUser = async (req: Request, res: Response, next: NextFunction) => {  
  const { id } = req.params
  const userId = req.userId  
  if (id != userId) return next(new CustomError(403, 'Not Authorized!'))
  
  const { username, email, password, avatar } = req.body
    
  try {    
    let updatedPassword
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10)
    }

    const selectedUser = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]) 
    if (!selectedUser) throw new CustomError(400, 'User not found')
    
    const _username = username ? username : selectedUser.rows[0].username
    const _email = email ? email : selectedUser.rows[0].email
    const _avatar = avatar ? avatar : selectedUser.rows[0].avatar
    const _pw = password ? updatedPassword : selectedUser.rows[0].password
    
    const updatedUser = await pool.query(
      `UPDATE users SET username = $1, email = $2, avatar = $3, password = $4
       WHERE id = $5 RETURNING *`,
       [_username, _email, _avatar, _pw, id]
    )

    const { password: userPassword, ...rest } = updatedUser.rows[0]
    
    return res.status(200).send({
      message: 'User updated successfully.',
      data: rest,
      success: true
    })
  } 
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}


const deleteUser = async (req: Request, res: Response, next: NextFunction) => {  
  const { id } = req.params
  const userId = req.userId  
  if (id != userId) return next(new CustomError(403, 'Not Authorized!'))

  try {    
    await pool.query('DELETE FROM users WHERE id = $1', [id])

    res.status(200).send({
      message: 'User deleted successfully.',
      data: null,
      success: true
    })

  } 
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}

const toggleSaveProperty = async (req: Request, res: Response, next: NextFunction) => {  
  const propertyId = req.body.propertyId
  const userId = req.userId    

  try {    
    const propertyExist = await pool.query(`
      SELECT * FROM savedproperties WHERE userId = $1 AND propertyId = $2`, [userId, propertyId])
    
    if (propertyExist.rows.length > 0) {
      await pool.query(`DELETE FROM savedproperties WHERE userId = $1 AND propertyId = $2`, [userId, propertyId]) 

      res.status(200).send({
        message: 'Saved property deleted successfully.',
        data: null,
        success: true
      })
    }
    else {
      await pool.query(`INSERT INTO savedproperties (userId, propertyId) VALUES ($1, $2)`, [userId, propertyId]) 

      res.status(200).send({
        message: 'Property saved successfully.',
        data: null,
        success: true
      })
    }
  } 
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}

export { getUsers, getUser, updateUser, deleteUser, toggleSaveProperty }