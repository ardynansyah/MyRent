import React, { useState } from 'react'
import { Search, CalendarDays, Wallet } from 'lucide-react'

export default function NavbarPenyewa({
  activeTab = 'jelajahi',
  searchQuery = '',
  onSearchChange,
  userPower = '1300 W',
  dateRange = '12 – 15 Jun',
  walletBalance = 'Rp 1.250.000',
  userInitials = 'BS',
  onNavigateTab,
  onNavigateHome
}) {
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const handleSearch = (e) => {
    setLocalSearch(e.target.value)
    if (onSearchChange) {
      onSearchChange(e.target.value)
    }
  }

  return (
    <header className="box-border w-full h-[68px] shrink-0 flex flex-row gap-4 lg:gap-7 px-4 md:px-8 justify-start items-center bg-white border-b border-slate-200 sticky top-0 z-40 transition-all">
      {/* Wordmark Logo */}
      <button
        type="button"
        onClick={onNavigateHome}
        className="text-lg text-blue-600 font-extrabold tracking-tight text-left whitespace-nowrap cursor-pointer hover:opacity-90 transition-opacity bg-transparent border-0 p-0"
      >
        SewaAlat
      </button>

      {/* NavLinks */}
      <nav className="box-border w-fit shrink-0 h-fit hidden md:flex flex-row gap-2 lg:gap-5 justify-start items-center">
        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab('jelajahi')}
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
          onClick={() => onNavigateTab && onNavigateTab('pesanan')}
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
          onClick={() => onNavigateTab && onNavigateTab('dompet')}
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
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-[5px] px-2.5 justify-start items-center bg-blue-50 rounded-full select-none">
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

        {/* User Avatar */}
        <div
          title="Profil Pengguna"
          className="box-border w-[34px] shrink-0 h-[34px] flex flex-row justify-center items-center bg-blue-600 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="text-[11px] text-white font-bold whitespace-nowrap">
            {userInitials}
          </span>
        </div>
      </div>
    </header>
  )
}
