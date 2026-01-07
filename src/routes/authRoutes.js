import express from 'express'
import { login, logout, me } from '../controllers/authController.js'
import { optionalAuth } from '../middlewares/auth.js'
import { authLimiter } from '../middlewares/rateLimit.js'
import validateRequest from '../middlewares/validateRequest.js'
import { loginValidator } from '../validators/authValidator.js'

const router = express.Router()

router.post('/login', authLimiter, validateRequest(loginValidator), login)
router.post('/logout', logout)
router.get('/me', optionalAuth, me)

export default router
