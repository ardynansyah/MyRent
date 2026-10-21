/**
 * Client HTTP untuk katalog alat (MyRent API).
 *
 * Semua request memakai base URL absolut `http://localhost:3000/api` agar
 * halaman katalog tetap bisa dipanggil langsung dari dev server Vite.
 */

export const API_BASE = 'http://localhost:3000/api'

/**
 * Ambil daftar alat yang tersedia disewa.
 *
 * @param {object} [params] - query string opsional (category, search, ownerId)
 * @returns {Promise<object[]>} daftar alat
 */
export async function listEquipments(params = {}) {
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  }

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const response = await fetch(`${API_BASE}/equipments${suffix}`)

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(body?.error?.message || 'Gagal memuat katalog alat')
  }

  return Array.isArray(body?.data) ? body.data : []
}

/**
 * Ambil detail satu alat.
 *
 * @param {string} id - UUID alat
 * @returns {Promise<object>} detail alat
 */
export async function getEquipment(id) {
  const response = await fetch(`${API_BASE}/equipments/${encodeURIComponent(id)}`)

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(body?.error?.message || 'Gagal memuat detail alat')
  }

  return body?.data
}

/**
 * Format angka Rupiah ke gaya tampilan lokal.
 * @param {number|string} value
 * @returns {string}
 */
export function formatRupiah(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 'Rp 0'
  return `Rp ${number.toLocaleString('id-ID')}`
}
