require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./src/config/db')
const mangaRoutes = require('./src/routes/mangaRoutes')

const app = express()
connectDB()

app.use(
  cors({
    origin: process.env.FE_URL,
    credentials: true,
  })
)
app.use(express.json())
app.use('/api/mangas', mangaRoutes)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
