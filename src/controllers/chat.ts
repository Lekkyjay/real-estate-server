import { NextFunction, Request, Response } from 'express'
import { pool } from '../dbConn'
import CustomError from '../utils/customError'

const getChats = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId

  try {
    const myChats = await pool.query('SELECT * FROM chats WHERE $1 IN (creatorid, receiverid)', [userId])   

    const chatList = myChats.rows.map(async(chat) => {
      const partnerid = chat.creatorid !== userId ? chat.creatorid : chat.receiverid
      const user = await pool.query(`SELECT username, avatar FROM users WHERE id =${partnerid}`)
      return { ...chat, ...user.rows[0], partnerid }
    })
    
    const chats = await Promise.all(chatList)   //chatList is an array of promises
    // console.log('getCharts response....:', chats, 'signedIn user...:', userId)

    res.status(200).send({
      message: 'Chats and userdetails gotten successfully.',
      data: chats,
      success: true
    })
  } 
  catch (error) {
    console.error('getChats Error...:', error)
    next(error)
  }  
}

const getChat = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId
  const chatId = req.params.id  

  try {
    // const chat = await pool.query('SELECT * FROM chats WHERE creatorid = $1 OR receiverid = $1 AND id = $2', [userId, chatId])
    const chat = await pool.query('SELECT * FROM chats WHERE $1 in (creatorid, receiverid) AND id = $2', [userId, chatId])

    await pool.query(`
      UPDATE chats 
      SET seenby = ARRAY_APPEND(seenby, $1) 
      WHERE id = $2
      AND $1 <> ALL(seenby)`, [userId, chatId]
    )

    const messages = await pool.query('SELECT * FROM messages WHERE chatid = $1 ORDER BY created_at ASC', [chatId])

    res.status(200).send({
      message: 'Got chat and its messages successfully.',
      data: { ...chat.rows[0], messages: messages.rows },
      success: true
    })
  } 
  catch (error) {
    console.error('createChat Error...:', error)
    next(error)
  }  
}

const createChat = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId
  const { receiverId } = req.body

  try {
    const createdChat = await pool.query(
      `INSERT INTO chats (creatorid, receiverId) 
      VALUES ($1, $2) RETURNING *`, [userId, receiverId]
    )

    res.status(200).send({
      message: 'Chat added successfully.',
      data: createdChat.rows[0],
      success: true
    })
  } 
  catch (error) {
    console.error('creteChat Error...:', error)
    next(error)
  }  
}

const readChat = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId
  const chatId = req.params.id

  try {
    const seenBy = await pool.query(`
      UPDATE chats 
      SET seenby = ARRAY_APPEND(seenby, $1) 
      WHERE id = $2
      AND creatorid = $1 OR receiverid = $1
      AND $1 <> ALL (seenby)
      RETURNING *`, [userId, chatId]
    )

    // console.log('seenBy....:', seenBy.rows)
  
    res.status(200).send({
      message: 'Chat read/updated successfully.',
      data: null,
      success: true
    })
  } 
  catch (error) {
    console.log('readChat Error....:', error)
    next(error)
  }
}

const createChatMsg = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId
  const chatId = req.params.chatId
  const { message } = req.body

  try {
    const chat = await pool.query(`
      SELECT * FROM chats 
      WHERE creatorid = $2 OR receiverid = $2
      AND id = $1
      `, [chatId, userId]
    )
    
    if (chat.rows.length == 0) return next(new CustomError(404, 'Chat not fund!'))

    const createdMessage = await pool.query(
      `INSERT INTO messages (message, chatid, senderid) 
      VALUES ($1, $2, $3) RETURNING *`, [message, chatId, userId]
    )

    await pool.query(`
      UPDATE chats 
      SET seenby = ARRAY[$1]::INTEGER[], lastmessage = $2 
      WHERE id = $3`, [ userId, message, chatId]
    )

    res.status(200).send({
      message: 'Message created successfully.',
      data: createdMessage.rows[0],
      success: true
    })
  } 
  catch (error) {
    console.error('creteChat Error...:', error)
    next(error)
  }  
}


export { getChats, getChat, createChat, readChat, createChatMsg }
