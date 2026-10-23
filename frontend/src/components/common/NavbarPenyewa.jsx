import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, CalendarDays, Wallet, LogOut, ChevronDown } from 'lucide-react'
import {
  getSessionUser,
  getUserInitials,
  getUserPowerLimit,
  logoutUser
} from '../../lib/userSession'

export default function NavbarPenyewa({
  activeTab = 'jelajahi',
  searchQuery = '',
  onSearchChange,
  dateRange = '12 – 15 Jun',
  walletBalance = 'Rp 1.250.000',
  onNavigateTab,
  onNavigateHome
}) {
  const navigate = useNavigate()
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Data pengguna dibaca dari localStorage (sesi login penyewa).
  const user = getSessionUser()
  const userInitials = getUserInitials(user)
  const powerLimit = getUserPowerLimit(user)
  const userPower = powerLimit ? `${powerLimit} W` : 'Daya belum diisi'

  // Tutup menu profil saat klik di luar area menu.
  useEffect(() => {
    if (!isMenuOpen) return undefined

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isMenuOpen])

  const handleSearch = (e) => {
    setLocalSearch(e.target.value)
    if (onSearchChange) {
      onSearchChange(e.target.value)
    }
  }

  const handleLogout = () => {
    setIsMenuOpen(false)
    logoutUser(navigate)
  }

  return (
    <header className="box-border w-full h-[68px] shrink-0 flex flex-row gap-4 lg:gap-7 px-4 md:px-8 justify-start items-center bg-white border-b border-slate-200 sticky top-0 z-40 transition-all">
      {/* Wordmark Logo */}
      <Link
        to="/beranda-sewa"
        className="text-lg text-blue-600 font-extrabold tracking-tight text-left whitespace-nowrap cursor-pointer hover:opacity-90 transition-opacity bg-transparent border-0 p-0 no-underline"
      >
        SewaAlat
      </Link>

      {/* NavLinks */}
      <nav className="box-border w-fit shrink-0 h-fit hidden md:flex flex-row gap-2 lg:gap-5 justify-start items-center">
        <button
          type="button"
          onClick={() => {
            if (onNavigateTab) onNavigateTab('jelajahi')
            else navigate('/beranda-sewa')
          }}
          className={`box-border w-fit shrink-0 h-fit flex flex-col gap-1.5 py-[7px] px-3 justify-start items-center rounded-lg cursor-pointer transition-all border-0 ${
            activeTab === 'jelajahi'
              ? 'bg-blue-50 text-blue-700 font-bold'
              : 'bg-transparent text-slate-600 hover:bg-slate-50 font-medium'
          }`}
        >
          <span className="text-[13px] whitespace-nowrap">Jelajahi Alat</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (onNavigateTab) onNavigateTab('pesanan')
            else navigate('/pesanan-saya')
          }}
          className={`box-border w-fit shrink-0 h-fit flex flex-col gap-1.5 py-[7px] px-3 justify-start items-center rounded-lg cursor-pointer transition-all border-0 ${
            activeTab === 'pesanan'
              ? 'bg-blue-50 text-blue-700 font-bold'
              : 'bg-transparent text-slate-600 hover:bg-slate-50 font-medium'
          }`}
        >
          <span className="text-[13px] whitespace-nowrap">Pesanan Saya</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (onNavigateTab) onNavigateTab('dompet')
            else navigate('/pesanan-saya')
          }}
          className={`box-border w-fit shrink-0 h-fit flex flex-col gap-1.5 py-[7px] px-3 justify-start items-center rounded-lg cursor-pointer transition-all border-0 ${
            activeTab === 'dompet'
              ? 'bg-blue-50 text-blue-700 font-bold'
              : 'bg-transparent text-slate-600 hover:bg-slate-50 font-medium'
          }`}
        >
          <span className="text-[13px] whitespace-nowrap">Dompet</span>
        </button>
      </nav>

      {/* Search Bar with Power Badge */}
      <div className="box-border flex-1 h-10 flex flex-row gap-2.5 px-3 justify-start items-center bg-slate-50 ring-1 ring-slate-200 rounded-[10px] focus-within:ring-2 focus-within:ring-blue-600 transition-all">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={onSearchChange ? searchQuery : localSearch}
          onChange={handleSearch}
          placeholder="Cari mesin kopi, oven, mesin kemasan…"
          className="text-[13px] text-slate-900 placeholder:text-slate-400 bg-transparent border-0 outline-none w-full font-normal"
        />
        <div
          title="Kapasitas daya listrik usaha"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-[5px] px-2.5 justify-start items-center bg-blue-50 rounded-full select-none"
        >
          <span className="text-[11px] text-blue-700 font-semibold tabular-nums whitespace-nowrap">
            {userPower}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-2 sm:gap-3 justify-start items-center">
        {/* Date Selector Badge */}
        <div
          title="Rentang Tanggal Sewa Aktif"
          className="box-border w-fit shrink-0 h-fit hidden sm:flex flex-row gap-2 py-[9px] px-3 justify-start items-center bg-white ring-1 ring-slate-200 rounded-[10px] cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <CalendarDays className="w-[15px] h-[15px] text-slate-600" />
          <span className="text-xs text-slate-900 font-semibold tabular-nums whitespace-nowrap">
            {dateRange}
          </span>
        </div>

        {/* Wallet Balance */}
        <div
          title="Saldo Dompet MyRent"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-2 py-[9px] px-3 justify-start items-center bg-blue-50 rounded-[10px] cursor-pointer hover:bg-blue-100/70 transition-colors"
        >
          <Wallet className="w-[15px] h-[15px] text-blue-700" />
          <span className="text-xs text-blue-700 font-bold tabular-nums whitespace-nowrap">
            {walletBalance}
          </span>
        </div>

        {/* User Avatar + Menu Profil */}
        <div ref={menuRef} className="relative box-border w-fit shrink-0 h-fit flex flex-row justify-start items-center">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Buka menu profil"
            aria-expanded={isMenuOpen}
            className="box-border w-[34px] h-[34px] shrink-0 flex flex-row justify-center items-center gap-1 bg-blue-600 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-transform border-0"
          >
            <span className="text-[11px] text-white font-bold whitespace-nowrap">
              {userInitials}
            </span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-[42px] z-50 w-[230px] box-border flex flex-col gap-2 p-3 bg-white ring-1 ring-slate-200 rounded-[12px] shadow-lg">
              <div className="box-border flex flex-col gap-0.5 justify-start items-start">
                <span className="text-xs text-slate-900 font-bold truncate w-full">
                  {user?.fullName || user?.name || 'Penyewa UMKM'}
                </span>
                <span className="text-[10px] text-slate-500 truncate w-full">
                  {user?.email || '-'}
                </span>
              </div>

              <div className="box-border w-full h-px bg-slate-200"></div>

              <button
                type="button"
                onClick={handleLogout}
                className="box-border w-full flex flex-row gap-2 py-2 px-2 justify-start items-center bg-transparent hover:bg-red-50 text-red-600 font-semibold text-xs rounded-lg cursor-pointer border-0 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
                <ChevronDown className="w-3 h-3 ml-auto rotate-[-90deg]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
