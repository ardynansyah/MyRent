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
    <header className="box-border w-full h-[68px] shrink-0 flex flex-row gap-4 lg:gap-[28px] px-4 md:px-8 justify-start items-center bg-[#FFFFFF] border-b border-[#E2E8F0] sticky top-0 z-40 transition-all">
      {/* Wordmark Logo */}
      <button
        type="button"
        onClick={onNavigateHome}
        className="text-[18px] text-[#2563EB] font-extrabold tracking-tight text-left whitespace-nowrap cursor-pointer hover:opacity-90 transition-opacity bg-transparent border-0 p-0"
      >
        SewaAlat
      </button>

      {/* NavLinks */}
      <nav className="box-border w-fit shrink-0 h-fit hidden md:flex flex-row gap-2 lg:gap-[20px] justify-start items-center">
        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab('jelajahi')}
          className={`box-border w-fit shrink-0 h-fit flex flex-col gap-[6px] py-[7px] px-[12px] justify-start items-center rounded-[8px] cursor-pointer transition-all border-0 ${
            activeTab === 'jelajahi'
              ? 'bg-[#EFF6FF] text-[#1D4ED8] font-bold'
              : 'bg-transparent text-[#475569] hover:bg-slate-50 font-medium'
          }`}
        >
          <span className="text-[13px] whitespace-nowrap">Jelajahi Alat</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab('pesanan')}
          className={`box-border w-fit shrink-0 h-fit flex flex-col gap-[6px] py-[7px] px-[12px] justify-start items-center rounded-[8px] cursor-pointer transition-all border-0 ${
            activeTab === 'pesanan'
              ? 'bg-[#EFF6FF] text-[#1D4ED8] font-bold'
              : 'bg-transparent text-[#475569] hover:bg-slate-50 font-medium'
          }`}
        >
          <span className="text-[13px] whitespace-nowrap">Pesanan Saya</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab('dompet')}
          className={`box-border w-fit shrink-0 h-fit flex flex-col gap-[6px] py-[7px] px-[12px] justify-start items-center rounded-[8px] cursor-pointer transition-all border-0 ${
            activeTab === 'dompet'
              ? 'bg-[#EFF6FF] text-[#1D4ED8] font-bold'
              : 'bg-transparent text-[#475569] hover:bg-slate-50 font-medium'
          }`}
        >
          <span className="text-[13px] whitespace-nowrap">Dompet</span>
        </button>
      </nav>

      {/* Search Bar with Power Badge */}
      <div className="box-border flex-1 h-[40px] flex flex-row gap-[10px] px-[12px] justify-start items-center bg-[#F8FAFC] ring-1 ring-[#E2E8F0] rounded-[10px] focus-within:ring-2 focus-within:ring-[#2563EB] transition-all">
        <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
        <input
          type="text"
          value={onSearchChange ? searchQuery : localSearch}
          onChange={handleSearch}
          placeholder="Cari mesin kopi, oven, mesin kemasan…"
          className="text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] bg-transparent border-0 outline-none w-full font-normal"
        />
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-[5px] px-[10px] justify-start items-center bg-[#EFF6FF] rounded-full select-none">
          <span className="text-[11px] text-[#1D4ED8] font-semibold tabular-nums whitespace-nowrap">
            {userPower}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] sm:gap-[12px] justify-start items-center">
        {/* Date Selector Badge */}
        <div
          title="Rentang Tanggal Sewa Aktif"
          className="box-border w-fit shrink-0 h-fit hidden sm:flex flex-row gap-[8px] py-[9px] px-[12px] justify-start items-center bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[10px] cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <CalendarDays className="w-[15px] h-[15px] text-[#475569]" />
          <span className="text-[12px] text-[#0F172A] font-semibold tabular-nums whitespace-nowrap">
            {dateRange}
          </span>
        </div>

        {/* Wallet Balance */}
        <div
          title="Saldo Dompet MyRent"
          className="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] py-[9px] px-[12px] justify-start items-center bg-[#EFF6FF] rounded-[10px] cursor-pointer hover:bg-blue-100/70 transition-colors"
        >
          <Wallet className="w-[15px] h-[15px] text-[#1D4ED8]" />
          <span className="text-[12px] text-[#1D4ED8] font-bold tabular-nums whitespace-nowrap">
            {walletBalance}
          </span>
        </div>

        {/* User Avatar */}
        <div
          title="Profil Pengguna"
          className="box-border w-[34px] shrink-0 h-[34px] flex flex-row justify-center items-center bg-[#2563EB] rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="text-[11px] text-[#FFFFFF] font-bold whitespace-nowrap">
            {userInitials}
          </span>
        </div>
      </div>
    </header>
  )
}
