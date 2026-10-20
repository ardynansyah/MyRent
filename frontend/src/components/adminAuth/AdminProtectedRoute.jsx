import React from 'react'
import { Navigate } from 'react-router-dom'
import { ADMIN_LOGIN_PATH, hasAdminSession } from './adminSession'

/**
 * Pelindung rute dashboard admin.
 *
 * Jika token admin tidak ada di localStorage (user belum login atau sesi sudah
 * dihapus saat logout), pengguna langsung diarahkan ke portal login dengan
 * `replace` supaya halaman yang baru saja ditinggalkan tidak bisa dibuka
 * kembali lewat tombol Back browser.
 *
 * @param {object} props.children - konten rute yang dilindungi
 */
export default function AdminProtectedRoute({ children }) {
  if (!hasAdminSession()) {
    return <Navigate to={ADMIN_LOGIN_PATH} replace />
  }

  return children
}
