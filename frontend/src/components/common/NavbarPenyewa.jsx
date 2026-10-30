import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, CalendarDays, Wallet, LogOut, ChevronDown, ChevronRight, MessageSquare } from 'lucide-react'
import ModalDompet from '../pesananSaya/ModalDompet'
import { getUnreadCount } from '../../lib/chatsApi'
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
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const menuRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    getUnreadCount()
      .then((count) => {
        if (isMounted) setUnreadCount(count)
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [activeTab])

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
    <header className="box-border w-full bg-white border-b border-slate-200 sticky top-0 z-40 transition-all">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-12 lg:px-20 h-[68px] flex flex-row gap-4 lg:gap-7 items-center justify-between">
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
            if (onNavigateTab) onNavigateTab('pesan')
            else navigate('/pesan')
          }}
          className={`box-border w-fit shrink-0 h-fit flex flex-row gap-1.5 py-[7px] px-3 justify-start items-center rounded-lg cursor-pointer transition-all border-0 ${
            activeTab === 'pesan'
              ? 'bg-blue-50 text-blue-700 font-bold'
              : 'bg-transparent text-slate-600 hover:bg-slate-50 font-medium'
          }`}
        >
          <div className="relative flex items-center">
            <MessageSquare className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[9px] font-bold px-1 rounded-full min-w-3.5 text-center leading-tight">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span className="text-[13px] whitespace-nowrap">Pesan</span>
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

        {/* User Profile Button with Integrated Wallet Indicator */}
        <div ref={menuRef} className="relative box-border w-fit shrink-0 h-fit flex flex-row justify-start items-center">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Buka menu profil dan dompet"
            aria-expanded={isMenuOpen}
            className="box-border flex flex-row items-center gap-2 py-1 px-1.5 sm:px-2 rounded-full bg-slate-100/90 hover:bg-slate-200/80 ring-1 ring-slate-200/90 cursor-pointer transition-all border-0 select-none shadow-2xs"
          >
            <div className="w-[30px] h-[30px] rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-[11px] shadow-2xs">
              {userInitials}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none pr-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Dompet</span>
              <span className="text-xs text-blue-700 font-extrabold tabular-nums mt-0.5">{walletBalance}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-[46px] z-50 w-[260px] box-border flex flex-col gap-2 p-3 bg-white ring-1 ring-slate-200 rounded-[14px] shadow-xl animate-in fade-in zoom-in-95 duration-100">
              {/* User Info Header */}
              <div className="box-border flex flex-col gap-0.5 p-1 justify-start items-start">
                <span className="text-xs text-slate-900 font-bold truncate w-full">
                  {user?.fullName || user?.name || 'Penyewa UMKM'}
                </span>
                <span className="text-[10px] text-slate-500 truncate w-full">
                  {user?.email || '-'}
                </span>
              </div>

              <div className="box-border w-full h-px bg-slate-100"></div>

              {/* Dompet Card Trigger */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsWalletModalOpen(true)
                }}
                className="w-full flex items-center justify-between p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50/70 hover:from-blue-100/80 hover:to-indigo-100/80 text-slate-900 rounded-xl transition-all border border-blue-100 cursor-pointer text-left shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs shrink-0">
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 leading-tight">Dompet &amp; Escrow</span>
                    <span className="text-[10px] text-blue-700 font-extrabold">{walletBalance}</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              </button>

              <div className="box-border w-full h-px bg-slate-100"></div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="box-border w-full flex flex-row gap-2 py-2 px-2.5 justify-start items-center bg-transparent hover:bg-red-50 text-red-600 font-semibold text-xs rounded-lg cursor-pointer border-0 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Akun</span>
              </button>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Global Wallet Modal */}
      <ModalDompet
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </header>
  )
}
