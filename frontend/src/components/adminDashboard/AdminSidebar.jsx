import React from 'react'
import {
  ShieldCheck,
  Scale,
  Users,
  Receipt,
  Settings,
  LogOut,
  Layers
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
    <aside className="hidden lg:flex sticky top-0 h-screen w-[248px] shrink-0 flex-col gap-[4px] p-[22px_16px] bg-background border-r border-border">
      {/* Brand */}
      <div className="flex items-center gap-2 pb-[18px] px-2">
        <div className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Layers className="size-6 text-primary" />
          <span className="whitespace-nowrap">MyRent HQ</span>
        </div>
        <span className="rounded-[6px] bg-foreground px-[7px] py-[3px] text-[8px] font-extrabold tracking-[0.6px] text-background">
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
                isActive ? 'bg-accent' : 'hover:bg-muted'
              }`}
            >
              <Icon
                className={`size-4 shrink-0 ${
                  isActive ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-foreground'
                }`}
              />
              <span
                className={`text-[13px] whitespace-nowrap ${
                  isActive ? 'text-accent-foreground font-bold' : 'text-muted-foreground font-medium'
                }`}
              >
                {item.label}
              </span>
              <span className="flex-1 h-[1px]" />
              {badge ? (
                <span className="rounded-[999px] bg-destructive/10 px-[10px] py-[5px] text-[11px] font-semibold text-destructive whitespace-nowrap">
                  {badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      {/* Blok user + logout — mt-auto menjaga blok ini menempel di dasar sidebar */}
      <div className="mt-auto flex flex-col gap-[10px] border-t border-border px-[6px] pt-[12px]">
        <div className="flex items-center gap-[10px]">
          <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-foreground">
            <span className="text-[10px] font-bold text-background">{inisial}</span>
          </div>
          <div className="flex-1 flex flex-col gap-[1px] min-w-0">
            <span className="text-[12px] font-bold text-foreground truncate">{namaAdmin}</span>
            <span className="text-[10px] text-muted-foreground truncate">{emailAdmin}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center justify-center gap-[6px] w-full rounded-[8px] border border-destructive/30 bg-destructive/10 px-[10px] py-[8px] text-[11px] font-bold text-destructive transition-colors hover:bg-destructive/20 cursor-pointer"
        >
          <LogOut className="size-[13px]" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  )
}
