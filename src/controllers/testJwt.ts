import { Request, Response } from 'express'

export const shouldBeLoggedIn = async (req: Request, res: Response) => {
  res.status(200).json({ 
    message: "You are Authenticated",
    data: req.userId,
    success: true
  });
};