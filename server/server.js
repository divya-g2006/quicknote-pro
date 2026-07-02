const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const notesRouter = require('./routes/notes')

dotenv.config({ path: './.env' })

const app = express()
const port = Number(process.env.PORT) || 5000
const path = require('path')

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'backend running' })
})

app.use('/api/notes', notesRouter)

// Serve client static files in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist')
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

const startServer = (currentPort) => {
  const server = app.listen(currentPort, () => {
    console.log(`Server listening on http://localhost:${currentPort}`)
  })

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = currentPort + 1
      console.warn(`Port ${currentPort} is busy, trying ${nextPort}...`)
      if (server.listening) {
        server.close(() => startServer(nextPort))
      } else {
        startServer(nextPort)
      }
    } else {
      console.error(error)
      process.exit(1)
    }
  })
}

const start = async () => {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('MongoDB connected')
    } catch (error) {
      console.warn('MongoDB unavailable, continuing with in-memory storage:', error.message)
    }
  } else {
    console.warn('MONGODB_URI is not set, continuing with in-memory storage')
  }

  startServer(port)
}

start()
