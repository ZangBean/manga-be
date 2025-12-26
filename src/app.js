require('module-alias/register')
const express = require('express')
const cors = require('cors')
const mangaRoutes = require('@/routes/mangaRoutes')
const chapterRoutes = require('@/routes/chapterRoutes')
const authRoutes = require('@/routes/authRoutes')
const errorHandler = require('@/middleware/errorHandler')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cors({ origin: process.env.FE_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/mangas', mangaRoutes)
app.use('/api/chapters', chapterRoutes)
app.use('/api/auth', authRoutes)

app.use(errorHandler)

module.exports = app
