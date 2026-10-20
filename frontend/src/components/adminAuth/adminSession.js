/**
 * Helper aksesiblitas sesi Administrator HQ.
 * Dipakai bersama oleh AdminProtectedRoute, sidebar dashboard admin, dan halaman detail pengajuan.
 */

export const ADMIN_LOGIN_PATH = '/portal-internal-hq'
export const ADMIN_DASHBOARD_PATH = '/portal-internal-hq/dashboard'

/**
 * Ambil token admin dari localStorage.
 * @returns {string|null}
 */
export function getAdminToken() {
  try {
    return localStorage.getItem('token')
  } catch {
    // localStorage tidak tersedia (mis. mode privat / SSR)
    return null
  }
}

/**
 * Ambil data user admin dari localStorage.
 * @returns {object|null}
 */
export function getAdminUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Cek apakah user yang tersimpan berperan sebagai admin.
 * @param {object|null} user
 * @returns {boolean}
 */
export function isAdminRole(user) {
  const role = String(user?.role || '').toUpperCase()
  return role === 'ADMIN' || role === 'SUPER_ADMIN'
}

/**
 * Sesi admin dianggap valid bila token tersedia.
 * Bila data user ikut tersimpan, perannya juga wajib admin.
 * @returns {boolean}
 */
export function hasAdminSession() {
  if (!getAdminToken()) return false

  const user = getAdminUser()
  if (user && user.role && !isAdminRole(user)) return false

  return true
}

/**
 * Hapus seluruh kredensial admin dari localStorage.
 */
export function clearAdminSession() {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  } catch {
    // abaikan error storage, token sudah dianggap tidak berlaku
  }
}

/**
 * Logout aman untuk portal admin.
 *
 * 1. Hapus token & data user dari localStorage.
 * 2. Navigasi memakai `replace: true` agar entri dashboard ditimpa oleh halaman login.
 *    Dengan begitu tombol Back browser tidak bisa membuka kembali halaman dashboard.
 *
 * @param {function} navigate - navigate dari react-router-dom
 */
export function logoutAdmin(navigate) {
  clearAdminSession()
  navigate(ADMIN_LOGIN_PATH, { replace: true })
}
