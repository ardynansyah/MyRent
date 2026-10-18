import { seedRentals } from '../data/seed.js'
import { CATEGORIES, STATUSES } from '../lib/constants.js'

// In-memory store. Swap implementasi ini dengan database (SQLite/Postgres/Mongo)
// tanpa mengubah route — semua akses data lewat fungsi di file ini.
let rentals = structuredClone(seedRentals)
let nextId = rentals.reduce((max, rental) => Math.max(max, rental.id), 0) + 1

const normalize = (value) => String(value ?? '').toLowerCase()

export function list({ category, status, search, sort = 'createdAt', order = 'desc', page = 1, limit = 20 } = {}) {
  let result = [...rentals]

  if (category) result = result.filter((rental) => rental.category === category)
  if (status) result = result.filter((rental) => rental.status === status)

  if (search) {
    const query = normalize(search)
    result = result.filter((rental) =>
      [rental.title, rental.category, rental.tenant?.name, ...(rental.tags ?? [])].some((field) =>
        normalize(field).includes(query)
      )
    )
  }

  const direction = order === 'asc' ? 1 : -1
  result.sort((a, b) => {
    const aValue = a[sort] ?? ''
    const bValue = b[sort] ?? ''
    if (aValue === bValue) return 0
    return (aValue > bValue ? 1 : -1) * direction
  })

  const total = result.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit

  return {
    data: result.slice(start, start + limit),
    meta: { total, page, limit, totalPages }
  }
}

export function getById(id) {
  return rentals.find((rental) => rental.id === id) ?? null
}

export function create(payload) {
  const now = new Date().toISOString()
  const rental = {
    id: nextId++,
    rating: null,
    image: null,
    tags: [],
    tenant: null,
    ...payload,
    createdAt: now,
    updatedAt: now
  }
  rentals.push(rental)
  return rental
}

export function update(id, patch) {
  const rental = getById(id)
  if (!rental) return null
  Object.assign(rental, patch, { updatedAt: new Date().toISOString() })
  return rental
}

export function remove(id) {
  const index = rentals.findIndex((rental) => rental.id === id)
  if (index === -1) return false
  rentals.splice(index, 1)
  return true
}

export function getCategories() {
  return CATEGORIES.map((name) => ({
    name,
    count: rentals.filter((rental) => rental.category === name).length
  }))
}

// Asumsi normalisasi pendapatan: unit harian/malaman dihitung 30 hari per bulan.
const MONTHLY_MULTIPLIER = { bulan: 1, hari: 30, malam: 30 }

export function getStats() {
  const byStatus = Object.fromEntries(
    STATUSES.map((status) => [status, rentals.filter((rental) => rental.status === status).length])
  )
  const byCategory = Object.fromEntries(
    CATEGORIES.map((category) => [category, rentals.filter((rental) => rental.category === category).length])
  )

  const active = rentals.filter((rental) => rental.status === 'Disewa')
  const tenants = rentals.map((rental) => rental.tenant).filter(Boolean)
  const verifiedTenants = tenants.filter((tenant) => tenant.verified).length

  const now = new Date()
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()

  const monthlyRevenueEstimate = active.reduce(
    (sum, rental) => sum + rental.price * (MONTHLY_MULTIPLIER[rental.period] ?? 1),
    0
  )

  return {
    totalAssets: rentals.length,
    activeRentals: active.length,
    availableAssets: byStatus.Tersedia ?? 0,
    occupancyRate: rentals.length > 0 ? Number(((active.length / rentals.length) * 100).toFixed(1)) : 0,
    monthlyRevenueEstimate,
    activeTenants: new Set(active.map((rental) => rental.tenant?.name).filter(Boolean)).size,
    totalTenants: tenants.length,
    verifiedTenantsPct: tenants.length > 0 ? Number(((verifiedTenants / tenants.length) * 100).toFixed(1)) : 100,
    newThisMonth: rentals.filter((rental) => rental.createdAt >= monthStart).length,
    byStatus,
    byCategory
  }
}

export function reset() {
  rentals = structuredClone(seedRentals)
  nextId = rentals.reduce((max, rental) => Math.max(max, rental.id), 0) + 1
}
