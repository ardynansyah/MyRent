import { Router } from 'express'
import { getStats } from '../store/rentals.js'

export const statsRouter = Router()

statsRouter.get('/', (req, res) => {
  res.json({ data: getStats() })
})
