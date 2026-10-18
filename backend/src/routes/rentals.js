import { Router } from 'express'
import { ApiError, validationFailed } from '../lib/errors.js'
import { validateCreateRental, validateListQuery, validateUpdateRental } from '../lib/validation.js'
import * as store from '../store/rentals.js'

export const rentalsRouter = Router()

function parseId(raw) {
  const id = Number(raw)
  if (!Number.isInteger(id) || id < 1) {
    throw new ApiError(400, 'INVALID_ID', `ID rental '${raw}' tidak valid — gunakan angka bulat positif`)
  }
  return id
}

function ensureExists(id) {
  const rental = store.getById(id)
  if (!rental) {
    throw new ApiError(404, 'RENTAL_NOT_FOUND', `Rental dengan id ${id} tidak ditemukan`)
  }
  return rental
}

rentalsRouter.get('/', (req, res) => {
  const query = validateListQuery(req.query)
  res.json(store.list(query))
})

rentalsRouter.post('/', (req, res) => {
  const payload = validateCreateRental(req.body)
  if (payload.status === 'Disewa' && !payload.tenant) {
    throw validationFailed([{ field: 'tenant', message: "tenant wajib diisi saat status 'Disewa'" }])
  }
  const rental = store.create(payload)
  res.status(201).location(`/api/rentals/${rental.id}`).json({ data: rental })
})

rentalsRouter.get('/:id', (req, res) => {
  res.json({ data: ensureExists(parseId(req.params.id)) })
})

rentalsRouter.patch('/:id', (req, res) => {
  const id = parseId(req.params.id)
  const existing = ensureExists(id)
  const patch = validateUpdateRental(req.body)

  const merged = { ...existing, ...patch }
  if (merged.status === 'Disewa' && !merged.tenant) {
    throw validationFailed([{ field: 'tenant', message: "tenant wajib diisi saat status 'Disewa'" }])
  }

  res.json({ data: store.update(id, patch) })
})

rentalsRouter.delete('/:id', (req, res) => {
  const id = parseId(req.params.id)
  ensureExists(id)
  store.remove(id)
  res.status(204).end()
})
