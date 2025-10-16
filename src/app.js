require('module-alias/register')
const express = require('express')
const cors = require('cors')
const mangaRoutes = require('@/routes/mangaRoutes')
const errorHandler = require('@/middleware/errorHandler')

const app = express()

app.use(cors({ origin: process.env.FE_URL, credentials: true }))
app.use(express.json())

app.use('/api/mangas', mangaRoutes)

app.use(errorHandler)

module.exports = app
