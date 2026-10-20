import React from 'react'
import { useNavigate } from 'react-router-dom'
import AdminDashboard from '../adminDashboard/AdminDashboard'
import { logoutAdmin } from './adminSession'

/**
 * Halaman dashboard admin (entry point lama).
 *
 * Implementasi tabel pengajuan kini dipindah ke
 * `components/adminDashboard/AdminDashboard.jsx` supaya mudah dirawat.
 * File ini dipertahankan sebagai alias agar import path lama tidak-breaking.
 *
 * @param {function} props.onLogout - callback logout opsional (diganti bila provided)
 */
export default function AdminDashboardPlaceholder({ onLogout }) {
  const navigate = useNavigate()

  /**
   * Logout aman:
   * - hapus token & data user admin dari localStorage
   * - navigate dengan `replace: true` agar riwayat dashboard ditimpa,
   *   sehingga tombol Back browser tidak bisa membuka dashboard lagi.
   */
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
      return
    }
    logoutAdmin(navigate)
  }

  return <AdminDashboard onLogout={handleLogout} />
}
