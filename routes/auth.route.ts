import express from 'express'
import { createUser, loginUser } from '../controllers/auth.controller'
import { validate } from '../middleware/validate.middleware'
import { signupSchema, loginSchema } from '../schemas/auth.schema'

const router = express.Router()

router.post('/signup', validate(signupSchema), createUser)
router.post('/login', validate(loginSchema), loginUser)

export default router