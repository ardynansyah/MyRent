/**
 * Helper tanggal ringkas untuk kalender sewa & panel checkout.
 *
 * Semua tanggal dinormalisasi ke tengah malam waktu lokal supaya:
 *  - perbandingan hari selalu akurat (tidak terkena efek jam 3 pagi / DST),
 *  - selisih hari dihitung dengan benar,
 *  - string ISO `YYYY-MM-DD` dari `<input type="date">` tidak bergeser
 *    satu hari ke belakang (string ISO di-parse sebagai UTC oleh browser).
 */

export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
]

export const MONTH_SHORT_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des'
]

export const DAY_SHORT_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

/**
 * Ubah nilai apa pun menjadi Date pada tengah malam waktu lokal.
 *
 * @param {Date|string|number|null} value
 * @returns {Date|null}
 */
export function normalizeDate(value) {
  if (value === null || value === undefined || value === '') return null

  // String tanggal saja (YYYY-MM-DD) → parse manual, bukan `new Date(string)`.
  if (typeof value === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    }
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/**
 * Tambah (atau kurangi) sejumlah hari.
 *
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
export function addDays(date, days) {
  const next = normalizeDate(date)
  next.setDate(next.getDate() + days)
  return next
}

/**
 * Selisih hari antara dua tanggal (tanggal awal = 0).
 *
 * @param {Date|string} start
 * @param {Date|string} end
 * @returns {number}
 */
export function diffDays(start, end) {
  const from = normalizeDate(start)
  const to = normalizeDate(end)
  if (!from || !to) return 0

  return Math.round((to.getTime() - from.getTime()) / 86400000)
}

/**
 * Format tanggal pendek: `12 Jun`.
 *
 * @param {Date|string|null} value
 * @returns {string}
 */
export function formatShortDate(value) {
  const date = normalizeDate(value)
  if (!date) return '-'

  return `${date.getDate()} ${MONTH_SHORT_NAMES[date.getMonth()]}`
}

/**
 * Format tanggal panjang: `Kam, 12 Jun 2025`.
 *
 * @param {Date|string|null} value
 * @returns {string}
 */
export function formatLongDate(value) {
  const date = normalizeDate(value)
  if (!date) return '-'

  const day = DAY_SHORT_NAMES[date.getDay()]
  const month = MONTH_SHORT_NAMES[date.getMonth()]

  return `${day}, ${date.getDate()} ${month} ${date.getFullYear()}`
}

/**
 * Format bulan & tahun: `Juni 2025`.
 *
 * @param {Date} date
 * @returns {string}
 */
export function formatMonthYear(date) {
  if (!date) return '-'

  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
}
