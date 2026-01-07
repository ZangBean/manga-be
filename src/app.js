import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import mangaRoutes from './routes/mangaRoutes.js'
import chapterRoutes from './routes/chapterRoutes.js'
import genreRoutes from './routes/genreRoutes.js'
import authRoutes from './routes/authRoutes.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()

app.use(cors({ origin: process.env.FE_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Chapter routes phải mount trước manga routes để tránh conflict với /:id
app.use('/api/mangas/:mangaId/chapters', chapterRoutes)
app.use('/api/mangas', mangaRoutes)
app.use('/api/genres', genreRoutes)
app.use('/api/auth', authRoutes)

app.use(errorHandler)

export default app
