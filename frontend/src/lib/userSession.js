/**
 * Helper aksesiblitas sesi Penyewa / Pemilik (non-admin).
 *
 * Dipakai bersama oleh UserProtectedRoute, NavbarPenyewa, BerandaSewa, dan
 * DetailAlat supaya sumber kebenaran sesi hanya satu tempat.
 *
 * Key `token` / `user` sengaja berbeda dari `admin_token` / `admin_user`
 * milik portal admin, sehingga dua sesi bisa hidup berdampingan di browser
 * yang sama tanpa saling menimpa.
 */

export const USER_TOKEN_KEY = 'token'
export const USER_KEY = 'user'
export const LOGIN_PATH = '/login'

/**
 * Ambil token JWT pengguna dari localStorage.
 * @returns {string|null}
 */
export function getUserToken() {
  try {
    return localStorage.getItem(USER_TOKEN_KEY)
  } catch {
    // localStorage tidak tersedia (mis. mode privat / SSR)
    return null
  }
}

/**
 * Ambil data user yang tersimpan di localStorage.
 * @returns {object|null}
 */
export function getSessionUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Simpan token & data user ke localStorage.
 * @param {string} token
 * @param {object} user
 */
export function setUserSession(token, user) {
  try {
    if (token) localStorage.setItem(USER_TOKEN_KEY, token)
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    // abaikan error storage
  }
}

/**
 * Hapus seluruh kredensial pengguna dari localStorage.
 */
export function clearUserSession() {
  try {
    localStorage.removeItem(USER_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {
    // abaikan error storage, token sudah dianggap tidak berlaku
  }
}

/**
 * Role pengguna dalam bentuk huruf besar.
 * @param {object|null} user
 * @returns {string}
 */
export function getUserRole(user) {
  return String(user?.role || '').toUpperCase()
}

/**
 * Cek apakah pengguna berperan sebagai PENYEWA.
 * @param {object|null} user
 * @returns {boolean}
 */
export function isPenyewa(user) {
  return getUserRole(user) === 'PENYEWA'
}

/**
 * Cek apakah pengguna berperan sebagai PEMILIK.
 * @param {object|null} user
 * @returns {boolean}
 */
export function isPemilik(user) {
  return getUserRole(user) === 'PEMILIK'
}

/**
 * Sesi penyewa dianggap valid bila token tersedia dan role-nya PENYEWA.
 * @returns {boolean}
 */
export function hasPenyewaSession() {
  if (!getUserToken()) return false
  return isPenyewa(getSessionUser())
}

/**
 * Sesi pemilik dianggap valid bila token tersedia dan role-nya PEMILIK.
 * @returns {boolean}
 */
export function hasPemilikSession() {
  if (!getUserToken()) return false
  return isPemilik(getSessionUser())
}

/**
 * Ambil kapasitas daya listrik usaha penyewa (dalam watt).
 *
 * Sumber nilai: `user.kycData.dayaListrik` (dinormalisasi backend), dengan
 * fallback ke `powerCapacity` / `customPower` untuk data lama.
 *
 * @param {object|null} user
 * @returns {number|null} watt, atau null bila belum tercatat
 */
export function getUserPowerLimit(user) {
  const kycData = user?.kycData
  if (!kycData || typeof kycData !== 'object') return null

  const candidates = [kycData.dayaListrik, kycData.customPower, kycData.powerCapacity]

  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined || candidate === '') continue

    const match = String(candidate).match(/\d+/)
    if (!match) continue

    const watt = Number(match[0])
    if (Number.isFinite(watt) && watt > 0) return watt
  }

  return null
}

/**
 * Inisial avatar penyewa, diambil dari nama pengguna.
 *
 * Mengambil maksimal dua huruf pertama dari setiap kata nama, mis.
 * "Budi Santoso" → "BS", "Kopi Senja Roastery" → "KS".
 *
 * @param {object|null} user
 * @returns {string}
 */
export function getUserInitials(user) {
  const source = String(user?.fullName || user?.name || user?.businessName || '').trim()

  if (!source) return '?'

  const words = source.split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

/**
 * Logout aman untuk penyewa.
 *
 * 1. Hapus token & data user dari localStorage.
 * 2. Navigasi memakai `replace: true` agar halaman yang baru saja ditinggalkan
 *    tidak bisa dibuka kembali lewat tombol Back browser.
 *
 * @param {function} navigate - navigate dari react-router-dom
 */
export function logoutUser(navigate) {
  clearUserSession()
  navigate(LOGIN_PATH, { replace: true })
}
