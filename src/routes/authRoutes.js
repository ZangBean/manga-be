import express from 'express'
import { login, logout, me } from '../controllers/authController.js'
import { optionalAuth } from '../middlewares/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/logout', logout)
router.get('/me', optionalAuth, me)

export default router
