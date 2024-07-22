import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../dbConn'
import CustomError from '../utils/customError'

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body
  const avatar = req.body.avatar ? req.body.avatar : 'https://res.cloudinary.com/dtkdchtfm/image/upload/v1658502077/products/yq4zj8vwtyofvh39mmlp.png'
  
  if (!email || !password || !username) return next(new CustomError(400, 'Missing credentials'))

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (user.rows.length > 0) return next(new CustomError(401, 'User already exist!'))

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    let newUser = await pool.query(
      `INSERT INTO users (username, email, password, avatar) 
      VALUES ($1, $2, $3, $4) RETURNING *`, [username, email, hashedPassword, avatar]
    )

    const registeredUser = { email: newUser.rows[0].email }

    return res.status(200).send({
      message: 'User registered successfully.',
      data: registeredUser,
      success: true
    })

  } 
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body  
  if (!username || !password) throw new CustomError(400, 'Incorrect Credentials')

  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username])
    if (user.rows.length === 0) return next(new CustomError(404, 'Invalid Credentials!'))     

    const passwordMatch = await bcrypt.compare(req.body.password, user.rows[0].password)
    if (!passwordMatch) return next(new CustomError(404, 'Invalid Credentials!'))

    const payload = { id: user.rows[0].id }      
    const secret = process.env.JWT_SECRET as string

    const token = jwt.sign(payload, secret, { expiresIn: '7d' })

    const { password, ...others } = user.rows[0]

    res
      .cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000    //1 week in ms
      })
      .status(200)
      .send({
        message: 'User logged in successfully.',
        data: others,
        success: true
      })
  } 
  catch (err) {
    console.log(err)
    next(err)
  }
}

const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).clearCookie('auth_token', { httpOnly: true }).send({
      message: 'User logged out successfully.',
      data: null,
      success: true
    })
  } 
  catch (error) {
    console.log(error)
    next(error)
  }  
}

export { register, login, logout }