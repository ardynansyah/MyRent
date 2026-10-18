import { Router } from 'express'
import { config } from '../config.js'

export const healthRouter = Router()

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'myrent-api',
    version: config.version,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  })
})
