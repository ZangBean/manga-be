const express = require('express')
const router = express.Router()
const authController = require('@/controllers/authController')
const { optionalAuth } = require('@/middleware/auth')

router.get('/me', optionalAuth, authController.me)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

module.exports = router
