import { Router } from 'express'
import { getCategories } from '../store/rentals.js'

export const categoriesRouter = Router()

categoriesRouter.get('/', (req, res) => {
  res.json({ data: getCategories() })
})
