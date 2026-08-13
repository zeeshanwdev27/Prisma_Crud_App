import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { SignupInput, LoginInput } from '../schemas/auth.schema'

const JWT_SECRET = process.env.JWT_SECRET as string

export const createUser = async (req: Request<{}, {}, SignupInput>, res: Response) => {
  const { name, email, password } = req.body

  try {
    const existsUser = await prisma.user.findUnique({ where: { email } })
    if (existsUser) return res.status(400).json({ message: 'User Already Exists' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(201).json({
      message: 'User created',
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error: any) {
    console.log(error.message, 'Something went wrong')
    return res.status(500).json({ message: 'Server error' })
  }
}

export const loginUser = async (req: Request<{}, {}, LoginInput>, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
      message: 'Logged in',
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error: any) {
    console.log(error.message, 'Something went wrong')
    return res.status(500).json({ message: 'Server error' })
  }
}