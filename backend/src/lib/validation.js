import { CATEGORIES, PERIODS, SORT_FIELDS, STATUSES } from './constants.js'
import { validationFailed } from './errors.js'

const RENTAL_FIELDS = ['title', 'category', 'price', 'period', 'status', 'image', 'tags', 'rating', 'tenant']
const TENANT_FIELDS = ['name', 'until', 'verified']
const QUERY_FIELDS = ['category', 'status', 'search', 'sort', 'order', 'page', 'limit']
const URL_PATTERN = /^https?:\/\/\S+$/i
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(T[\d:.]+Z?)?$/

const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)

const checkUnknownFields = (body, allowed, errors) => {
  for (const key of Object.keys(body)) {
    if (!allowed.includes(key)) {
      errors.push({
        field: key,
        message: `Field '${key}' tidak dikenali. Field yang valid: ${allowed.join(', ')}`
      })
    }
  }
}

const validateTenant = (tenant, errors) => {
  if (tenant === null) return null
  if (!isPlainObject(tenant)) {
    errors.push({ field: 'tenant', message: 'tenant harus objek { name, until, verified } atau null' })
    return undefined
  }

  const tenantErrors = []
  const value = {}
  checkUnknownFields(tenant, TENANT_FIELDS, tenantErrors)

  if (typeof tenant.name !== 'string' || tenant.name.trim().length < 3 || tenant.name.trim().length > 80) {
    tenantErrors.push({ field: 'tenant.name', message: 'tenant.name wajib diisi berupa string 3-80 karakter' })
  } else {
    value.name = tenant.name.trim()
  }

  if (typeof tenant.until !== 'string' || !DATE_PATTERN.test(tenant.until)) {
    tenantErrors.push({ field: 'tenant.until', message: 'tenant.until wajib format tanggal, contoh: 2026-10-22' })
  } else {
    value.until = tenant.until
  }

  if (tenant.verified !== undefined && typeof tenant.verified !== 'boolean') {
    tenantErrors.push({ field: 'tenant.verified', message: 'tenant.verified harus boolean' })
  } else {
    value.verified = tenant.verified ?? false
  }

  errors.push(...tenantErrors)
  return tenantErrors.length === 0 ? value : undefined
}

function validateRentalFields(body, { partial = false } = {}) {
  if (!isPlainObject(body)) {
    throw validationFailed([{ field: 'body', message: 'Body request harus berupa objek JSON' }])
  }

  const errors = []
  const value = {}
  const has = (key) => body[key] !== undefined

  checkUnknownFields(body, RENTAL_FIELDS, errors)

  if (has('title') || !partial) {
    const title = body.title
    if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 120) {
      errors.push({ field: 'title', message: 'title wajib diisi berupa string 3-120 karakter' })
    } else {
      value.title = title.trim()
    }
  }

  if (has('category') || !partial) {
    if (!CATEGORIES.includes(body.category)) {
      errors.push({ field: 'category', message: `category wajib salah satu dari: ${CATEGORIES.join(', ')}` })
    } else {
      value.category = body.category
    }
  }

  if (has('price') || !partial) {
    const price = body.price
    if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
      errors.push({ field: 'price', message: 'price wajib berupa angka > 0 (Rupiah, tanpa titik/koma)' })
    } else {
      value.price = price
    }
  }

  if (has('period') || !partial) {
    if (!PERIODS.includes(body.period)) {
      errors.push({ field: 'period', message: `period wajib salah satu dari: ${PERIODS.join(', ')}` })
    } else {
      value.period = body.period
    }
  }

  if (has('status')) {
    if (!STATUSES.includes(body.status)) {
      errors.push({ field: 'status', message: `status wajib salah satu dari: ${STATUSES.join(', ')}` })
    } else {
      value.status = body.status
    }
  }

  if (has('image')) {
    const image = body.image
    if (image !== null && (typeof image !== 'string' || !URL_PATTERN.test(image))) {
      errors.push({ field: 'image', message: 'image harus URL http(s) yang valid atau null' })
    } else {
      value.image = image
    }
  }

  if (has('tags')) {
    const tags = body.tags
    const valid =
      Array.isArray(tags) &&
      tags.length <= 8 &&
      tags.every((tag) => typeof tag === 'string' && tag.trim().length > 0 && tag.trim().length <= 40)
    if (!valid) {
      errors.push({ field: 'tags', message: 'tags harus array maksimal 8 string (masing-masing 1-40 karakter)' })
    } else {
      value.tags = tags.map((tag) => tag.trim())
    }
  }

  if (has('rating')) {
    const rating = body.rating
    if (rating !== null && (typeof rating !== 'number' || rating < 0 || rating > 5)) {
      errors.push({ field: 'rating', message: 'rating harus angka 0-5 atau null' })
    } else {
      value.rating = rating
    }
  }

  if (has('tenant')) {
    const tenant = validateTenant(body.tenant, errors)
    if (tenant !== undefined) value.tenant = tenant
  }

  if (partial && Object.keys(body).length === 0) {
    errors.push({ field: 'body', message: 'Tidak ada field yang dikirim untuk diupdate' })
  }

  if (errors.length > 0) throw validationFailed(errors)

  if (!partial && value.status === undefined) value.status = 'Tersedia'

  return value
}

export const validateCreateRental = (body) => validateRentalFields(body, { partial: false })

export const validateUpdateRental = (body) => validateRentalFields(body, { partial: true })

export function validateListQuery(query = {}) {
  const errors = []
  const value = {}

  for (const key of Object.keys(query)) {
    if (!QUERY_FIELDS.includes(key)) {
      errors.push({
        field: key,
        message: `Query parameter '${key}' tidak dikenali. Yang valid: ${QUERY_FIELDS.join(', ')}`
      })
    }
  }

  if (query.category !== undefined) {
    if (!CATEGORIES.includes(query.category)) {
      errors.push({ field: 'category', message: `category harus salah satu dari: ${CATEGORIES.join(', ')}` })
    } else {
      value.category = query.category
    }
  }

  if (query.status !== undefined) {
    if (!STATUSES.includes(query.status)) {
      errors.push({ field: 'status', message: `status harus salah satu dari: ${STATUSES.join(', ')}` })
    } else {
      value.status = query.status
    }
  }

  if (query.search !== undefined) {
    if (typeof query.search !== 'string' || query.search.length > 100) {
      errors.push({ field: 'search', message: 'search harus string maksimal 100 karakter' })
    } else if (query.search.trim() !== '') {
      value.search = query.search.trim()
    }
  }

  if (query.sort !== undefined) {
    if (!SORT_FIELDS.includes(query.sort)) {
      errors.push({ field: 'sort', message: `sort harus salah satu dari: ${SORT_FIELDS.join(', ')}` })
    } else {
      value.sort = query.sort
    }
  }

  if (query.order !== undefined) {
    if (!['asc', 'desc'].includes(query.order)) {
      errors.push({ field: 'order', message: "order harus 'asc' atau 'desc'" })
    } else {
      value.order = query.order
    }
  }

  for (const [field, min, max] of [
    ['page', 1, Number.MAX_SAFE_INTEGER],
    ['limit', 1, 100]
  ]) {
    if (query[field] === undefined) continue
    const parsed = Number(query[field])
    if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
      errors.push({ field, message: `${field} harus bilangan bulat antara ${min} dan ${max}` })
    } else {
      value[field] = parsed
    }
  }

  if (errors.length > 0) throw validationFailed(errors)

  return { sort: 'createdAt', order: 'desc', page: 1, limit: 20, ...value }
}
