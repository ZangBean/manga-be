import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import mangaRoutes from './routes/mangaRoutes.js'
import authRoutes from './routes/authRoutes.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()

app.use(cors({ origin: process.env.FE_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/mangas', mangaRoutes)
app.use('/api/auth', authRoutes)

app.use(errorHandler)

export default app
