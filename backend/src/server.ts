import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import linkRoutes from './routes/linkRoutes'
import noteRoutes from './routes/noteRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'DevPulse API is running' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Saved Links API
app.use('/api/links', linkRoutes)

// Notes API
app.use('/api/notes', noteRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
