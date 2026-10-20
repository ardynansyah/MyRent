import React from 'react'
import {
  ShieldCheck,
  Scale,
  Users,
  Receipt,
  Settings,
  LogOut
} from 'lucide-react'
import { getAdminUser } from '../adminAuth/adminSession'

/**
 * Navigasi samping portal admin HQ.
 * Konversi dari bagian "Sidebar" pada `frontend/assetAdmin/AdminPanel-export.html`.
 */

const MENU = [
  { key: 'verifikasi', label: 'Verifikasi Akun', icon: ShieldCheck, badgeKey: 'verifikasi' },
  { key: 'mediasi', label: 'Mediasi Klaim', icon: Scale, badgeKey: 'mediasi' },
  { key: 'pengguna', label: 'Semua Pengguna', icon: Users },
  { key: 'transaksi', label: 'Transaksi', icon: Receipt },
  { key: 'pengaturan', label: 'Pengaturan', icon: Settings }
]

/**
 * @param {object} props
 * @param {string} props.activeKey - menu yang sedang aktif
 * @param {function} props.onNavigate - callback saat menu diklik
 * @param {object} props.counts - jumlah antrean per menu
 * @param {function} props.onLogout - aksi keluar sesi
 */
export default function AdminSidebar({ activeKey = 'verifikasi', onNavigate, counts = {}, onLogout }) {
  const adminUser = getAdminUser()
  const namaAdmin = adminUser?.fullName || adminUser?.name || 'Rani Admin'
  const emailAdmin = adminUser?.email || 'admin@myrent.com'
  const inisial = (namaAdmin || 'RA')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <aside className="hidden lg:flex w-[248px] shrink-0 flex-col gap-[4px] p-[22px_16px] bg-white border-r border-[#E2E8F0]">
      {/* Brand */}
      <div className="flex items-center gap-[10px] pb-[18px] px-2">
        <span className="text-[17px] font-extrabold tracking-[-0.3px] text-[#2563EB] whitespace-nowrap">
          SewaAlat
        </span>
        <span className="rounded-[6px] bg-[#0F172A] px-[7px] py-[3px] text-[8px] font-extrabold tracking-[0.6px] text-white">
          ADMIN
        </span>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-[4px]">
        {MENU.map((item) => {
          const Icon = item.icon
          const isActive = item.key === activeKey
          const badge = item.badgeKey ? counts[item.badgeKey] : null

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate && onNavigate(item.key)}
              className={`group flex w-full items-center gap-[10px] rounded-[8px] px-[10px] py-[9px] text-left transition-colors cursor-pointer ${
                isActive ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
              }`}
            >
              <Icon
                className={`w-[16px] h-[16px] shrink-0 ${
                  isActive ? 'text-[#1D4ED8]' : 'text-[#94A3B8] group-hover:text-[#64748B]'
                }`}
              />
              <span
                className={`text-[13px] whitespace-nowrap ${
                  isActive ? 'text-[#1D4ED8] font-bold' : 'text-[#475569] font-medium'
                }`}
              >
                {item.label}
              </span>
              <span className="flex-1 h-[1px]" />
              {badge ? (
                <span className="rounded-[999px] bg-[#FEF2F2] px-[10px] py-[5px] text-[11px] font-semibold text-[#B91C1C] whitespace-nowrap">
                  {badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      <span className="flex-1" />

      {/* Blok user + logout */}
      <div className="flex flex-col gap-[10px] border-t border-[#E2E8F0] px-[6px] pt-[12px]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[30px] h-[30px] shrink-0 rounded-full bg-[#0F172A] flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{inisial}</span>
          </div>
          <div className="flex-1 flex flex-col gap-[1px] min-w-0">
            <span className="text-[12px] font-bold text-[#0F172A] truncate">{namaAdmin}</span>
            <span className="text-[10px] text-[#94A3B8] truncate">{emailAdmin}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center justify-center gap-[6px] w-full rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-[10px] py-[8px] text-[11px] font-bold text-[#B91C1C] transition-colors hover:bg-[#FEE2E2] cursor-pointer"
        >
          <LogOut className="w-[13px] h-[13px]" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  )
}
