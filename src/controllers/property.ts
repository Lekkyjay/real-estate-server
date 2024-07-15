import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../dbConn'
import CustomError from '../utils/customError'

const getProperties = async (req: Request, res: Response, next: NextFunction) => {  
  try {    
    const properties = await pool.query('SELECT * FROM properties')     

    return res.status(200).send({
      message: 'getProperties successful.',
      data: properties.rows,
      success: true
    })

  } 
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}


const getProperty = async (req: Request, res: Response, next: NextFunction) => {  
  const { id } = req.params
  
  try {    
    const property = await pool.query('SELECT * FROM properties WHERE id = $1', [id])
    const user = await pool.query('SELECT username, avatar FROM users WHERE id = $1', [property.rows[0].userid])
    
    return res.status(200).send({
      message: 'getProperty successful.',
      data: { property: property.rows[0], user: user.rows[0] },
      success: true
    })
  } 
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}

const createProperty = async (req: Request, res: Response, next: NextFunction) => {  
  const userId = req.userId
  const {title, price, images, address, city, bedroom, bathroom, latitude, longitude, listing_type, category, desc, utilities, size, income, pet, school, bus, restaurant} = req.body
  
  const query = `
    INSERT INTO properties (userid, title, price, images, address, city, bedroom, bathroom, latitude, longitude, 
      listing_type, category, description, utilities, size, income, pet, school, bus, restaurant)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) 
    RETURNING *`
  
  const params = [userId, title, price, images, address, city, bedroom, bathroom, latitude, longitude, listing_type, category, desc, utilities, size, income, pet, school, bus, restaurant]
       
  try {    
    const property = await pool.query(query, params)
    
    return res.status(200).send({
      message: 'Property created successfully.',
      data: property.rows[0],
      success: true
    })
  } 
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}


const updateProperty = async (req: Request, res: Response, next: NextFunction) => {  
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


const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {  
  const { id } = req.params
  const userId = req.userId  
  if (id != userId) return next(new CustomError(403, 'Not Authorized!'))

  try {    
    await pool.query('DELETE FROM properties WHERE id = $1', [id])

    return res.status(200).send({
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

export { getProperties, getProperty, createProperty, updateProperty, deleteProperty }