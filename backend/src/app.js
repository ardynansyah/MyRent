import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import express from 'express'
import { config } from './config.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { requestId, requestLogger } from './middleware/requestLogger.js'
import { categoriesRouter } from './routes/categories.js'
import { healthRouter } from './routes/health.js'
import { rentalsRouter } from './routes/rentals.js'
import { statsRouter } from './routes/stats.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const ENDPOINTS = [
  'GET /api/health',
  'GET /api/rentals',
  'POST /api/rentals',
  'GET /api/rentals/:id',
  'PATCH /api/rentals/:id',
  'DELETE /api/rentals/:id',
  'GET /api/categories',
  'GET /api/stats',
  'GET /openapi.yaml'
]

export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  app.use(requestId)
  app.use(requestLogger)
  app.use(cors({ origin: config.corsOrigins }))
  app.use(express.json({ limit: '1mb' }))

  app.get('/', (req, res) => {
    res.json({ name: 'MyRent API', version: config.version, docs: '/openapi.yaml', endpoints: ENDPOINTS })
  })

  app.get('/openapi.yaml', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'openapi.yaml'), {
      headers: { 'Content-Type': 'application/yaml; charset=utf-8' }
    })
  })

  app.use('/api/health', healthRouter)
  app.use('/api/rentals', rentalsRouter)
  app.use('/api/categories', categoriesRouter)
  app.use('/api/stats', statsRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
