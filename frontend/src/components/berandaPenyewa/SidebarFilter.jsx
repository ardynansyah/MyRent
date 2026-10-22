import React, { useState, useRef, useEffect } from 'react'
import { Calendar as CalendarIcon, Check, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react'
import {
  daysInMonth,
  diffDays,
  formatShortDate,
  normalizeDate,
  MONTH_NAMES
} from '../../lib/dateHelpers'

// Opsi batas security deposit. Nilai `null` berarti tanpa batas.
const DEPOSIT_OPTIONS = [
  { label: '< 300rb', value: 300000 },
  { label: '< 1jt', value: 1000000 },
  { label: 'Semua', value: 'semua' }
]

const DEFAULT_FILTERS = {
  dateRange: { start: null, end: null },
  maxDeposit: 'semua'
}

export default function SidebarFilter({
  // Filter bersama dengan parent (BerandaSewa). `onFiltersChange` harus berupa
  // setter React (`setFilters`) supaya bisa menerima updater function.
  filters = DEFAULT_FILTERS,
  onFiltersChange,
  powerMatch = true,
  onPowerMatchChange,
  powerLimit = null,
  maxPrice = 500000,
  onMaxPriceChange,
  deliveryMethods = { selfPickup: true, courier: true },
  onDeliveryMethodChange,
  onReset,
  onApply
}) {
  // Metode pengiriman belum dipakai untuk menyaring katalog, jadi masih lokal.
  const [internalDelivery, setInternalDelivery] = useState(deliveryMethods)

  const dateRange = filters.dateRange ?? { start: null, end: null }
  const maxDeposit = filters.maxDeposit ?? 'semua'

  // Popover kalender mini
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const calendarRef = useRef(null)

  // Inisialisasi tampilan bulan & tahun kalender
  const getInitialView = () => {
    const d = normalizeDate(dateRange.start) || normalizeDate(dateRange.end) || new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  }
  const [viewDate, setViewDate] = useState(getInitialView)

  // Tutup dropdown saat klik di luar atau tekan Escape
  useEffect(() => {
    if (!isCalendarOpen) return undefined

    const handlePointerDown = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setIsCalendarOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsCalendarOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCalendarOpen])

  const handlePrevMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 }
      return { year: prev.year, month: prev.month - 1 }
    })
  }

  const handleNextMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 }
      return { year: prev.year, month: prev.month + 1 }
    })
  }

  const handleRangeChange = (start, end) => {
    if (!onFiltersChange) return
    onFiltersChange((prev) => ({
      ...prev,
      dateRange: { start: start || null, end: end || null }
    }))
  }

  const handleSelectDay = (day) => {
    const m = String(viewDate.month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    const clickedStr = `${viewDate.year}-${m}-${d}`

    // 1. Belum ada tanggal terpilih ATAU sudah lengkap start & end -> set start baru
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      handleRangeChange(clickedStr, null)
      return
    }

    // 2. Klik ulang tanggal yang sama -> batalkan
    if (clickedStr === dateRange.start) {
      handleRangeChange(null, null)
      return
    }

    // 3. Sudah ada start, sekarang tentukan rentang
    if (clickedStr < dateRange.start) {
      handleRangeChange(clickedStr, dateRange.start)
    } else {
      handleRangeChange(dateRange.start, clickedStr)
    }
  }

  const totalDays = daysInMonth(viewDate.year, viewDate.month)
  const firstDayOfWeek = new Date(viewDate.year, viewDate.month, 1).getDay()
  // Offset hari Senin = 0, Selasa = 1, ..., Minggu = 6
  const startOffset = (firstDayOfWeek + 6) % 7
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1)

  const handleTogglePower = () => {
    if (onPowerMatchChange) onPowerMatchChange(!powerMatch)
  }

  const handlePriceChange = (e) => {
    const val = Number(e.target.value)
    if (onMaxPriceChange) onMaxPriceChange(val)
  }

  const handleDepositSelect = (value) => {
    if (!onFiltersChange) return

    onFiltersChange((prev) => ({ ...prev, maxDeposit: value }))
  }

  const handleDeliveryToggle = (key) => {
    const next = { ...internalDelivery, [key]: !internalDelivery[key] }
    setInternalDelivery(next)
    if (onDeliveryMethodChange) onDeliveryMethodChange(next)
  }

  const handleReset = () => {
    setInternalDelivery({ selfPickup: true, courier: true })

    if (onFiltersChange) {
      onFiltersChange((prev) => ({
        ...prev,
        dateRange: { start: null, end: null },
        maxDeposit: 'semua'
      }))
    }

    if (onReset) onReset()
  }

  const formatRupiah = (val) => {
    return `Rp ${val.toLocaleString('id-ID')}`
  }

  const rangeDays =
    dateRange.start && dateRange.end ? diffDays(dateRange.start, dateRange.end) + 1 : 0

  return (
    <aside className="box-border w-full lg:w-[264px] shrink-0 h-fit flex flex-col gap-4.5 p-5 justify-start items-start bg-white ring-1 ring-slate-200 rounded-[14px]">
      {/* Head */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
        <h2 className="text-sm text-slate-900 font-bold text-left whitespace-nowrap m-0">
          Filter
        </h2>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-blue-600 font-semibold text-left whitespace-nowrap bg-transparent border-0 cursor-pointer hover:underline p-0"
        >
          Reset
        </button>
      </div>

      <div className="box-border w-full h-px shrink-0 bg-slate-200"></div>

      {/* Rentang Tanggal Popover Kalender Mini */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-2.5 justify-start items-start">
        <div className="text-xs text-slate-600 font-semibold text-left whitespace-nowrap">
          Rentang Tanggal
        </div>

        {/* Trigger Popover Button */}
        <div className="relative w-full" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setIsCalendarOpen((prev) => !prev)}
            aria-expanded={isCalendarOpen}
            className={`box-border w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 ring-1 rounded-xl transition-all cursor-pointer text-left ${
              isCalendarOpen
                ? 'ring-2 ring-primary bg-white shadow-xs'
                : 'ring-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Tanggal Sewa
                </span>
                <span className="text-xs font-bold text-slate-800 truncate">
                  {dateRange.start && dateRange.end
                    ? `${formatShortDate(dateRange.start)} – ${formatShortDate(dateRange.end)}`
                    : dateRange.start
                    ? `${formatShortDate(dateRange.start)} (Pilih selesai)`
                    : 'Pilih tanggal sewa'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {(dateRange.start || dateRange.end) && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRangeChange(null, null)
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                  title="Hapus tanggal"
                >
                  <X className="w-3.5 h-3.5" />
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  isCalendarOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Absolute Div (Dropdown Modal Kalender Mini) */}
          {isCalendarOpen && (
            <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[270px] -left-1 sm:left-0 bg-white rounded-2xl shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 p-3.5 flex flex-col gap-2.5">
              {/* Header Kalender Mini */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">
                  {MONTH_NAMES[viewDate.month]} {viewDate.year}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer border-0 transition-colors"
                    title="Bulan sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer border-0 transition-colors"
                    title="Bulan berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Header Hari (Sen - Min) */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((d) => (
                  <span key={d} className="text-[10px] font-semibold text-slate-400 py-0.5">
                    {d}
                  </span>
                ))}
              </div>

              {/* Grid 7 Kolom */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Leading blanks */}
                {Array.from({ length: startOffset }).map((_, i) => (
                  <div key={`blank-${i}`} className="h-7 w-7" />
                ))}

                {/* Day cells */}
                {daysArray.map((day) => {
                  const mStr = String(viewDate.month + 1).padStart(2, '0')
                  const dStr = String(day).padStart(2, '0')
                  const isoStr = `${viewDate.year}-${mStr}-${dStr}`

                  const isStart = dateRange.start === isoStr
                  const isEnd = dateRange.end === isoStr
                  const inRange =
                    dateRange.start &&
                    dateRange.end &&
                    isoStr > dateRange.start &&
                    isoStr < dateRange.end

                  let cellClasses = 'text-slate-700 hover:bg-slate-100 font-medium'
                  if (isStart || isEnd) {
                    cellClasses = 'bg-primary text-primary-foreground font-bold shadow-xs scale-105'
                  } else if (inRange) {
                    cellClasses = 'bg-blue-50 text-blue-700 font-semibold'
                  }

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={`h-7 w-7 mx-auto flex items-center justify-center text-xs rounded-lg transition-all cursor-pointer border-0 ${cellClasses}`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>

              {/* Footer Ringkasan & Aksi Popover */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleRangeChange(null, null)}
                  className="text-slate-400 hover:text-slate-700 font-medium cursor-pointer border-0 bg-transparent p-0"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(false)}
                  className="text-primary hover:text-primary/80 font-bold cursor-pointer border-0 bg-transparent p-0"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Ringkasan Durasi Sewa */}
        <div className="text-[11px] text-slate-500 font-normal tabular-nums text-left whitespace-nowrap">
          {rangeDays > 0
            ? `${rangeDays} hari sewa · 1 hari buffer`
            : dateRange.start
            ? 'Pilih tanggal selesai'
            : 'Pilih tanggal mulai & selesai'}
        </div>
      </div>

      <div className="box-border w-full h-px shrink-0 bg-slate-200"></div>

      {/* Sesuai Listrik Usaha Saya */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2.5 justify-start items-start">
        <div className="box-border flex-1 h-fit flex flex-col gap-[3px] justify-start items-start">
          <div className="text-xs text-slate-900 font-bold text-left whitespace-nowrap">
            Sesuai listrik usaha saya
          </div>
          <div className="text-[11px] leading-[15px] w-full text-slate-500 font-normal text-left tabular-nums">
            {powerLimit
              ? `Maks. ${powerLimit} W · hanya alat yang aman`
              : 'Daya listrik usaha belum diisi'}
          </div>
        </div>
        <button
          type="button"
          onClick={handleTogglePower}
          aria-label="Saring alat sesuai daya listrik usaha"
          aria-pressed={powerMatch}
          className={`box-border w-9 shrink-0 h-5 flex flex-row p-0.5 items-center rounded-full transition-colors cursor-pointer border-0 ${
            powerMatch ? 'justify-end bg-blue-600' : 'justify-start bg-slate-300'
          }`}
        >
          <div className="box-border w-4 shrink-0 h-4 bg-white rounded-full shadow-xs"></div>
        </button>
      </div>

      <div className="box-border w-full h-px shrink-0 bg-slate-200"></div>

      {/* Harga Harian Maksimal */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-2 justify-start items-start">
        <div className="text-xs text-slate-600 font-semibold text-left whitespace-nowrap">
          Harga harian maksimal
        </div>
        <div className="text-base text-blue-600 font-bold tabular-nums tracking-tight text-left whitespace-nowrap">
          {formatRupiah(maxPrice)}
        </div>

        {/* Slider */}
        <div className="w-full py-1">
          <input
            type="range"
            min={50000}
            max={500000}
            step={25000}
            value={maxPrice}
            onChange={handlePriceChange}
            className="w-full accent-blue-600 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none"
          />
        </div>

        <div className="text-[11px] text-slate-500 font-normal tabular-nums text-left whitespace-nowrap">
          Rp 0 — Rp 500.000
        </div>
      </div>

      <div className="box-border w-full h-px shrink-0 bg-slate-200"></div>

      {/* Batas Security Deposit */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-2 justify-start items-start">
        <div className="text-xs text-slate-600 font-semibold text-left whitespace-nowrap">
          Batas security deposit
        </div>
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-1.5 justify-start items-start">
          {DEPOSIT_OPTIONS.map((opt) => {
            const isSelected = maxDeposit === opt.value
            return (
              <button
                key={opt.label}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleDepositSelect(opt.value)}
                className={`box-border flex-1 h-fit flex flex-row py-[7px] px-0 justify-center items-start rounded-lg cursor-pointer transition-all border-0 ${
                  isSelected
                    ? 'bg-blue-50 ring-1 ring-blue-600 text-blue-700 font-bold'
                    : 'bg-white ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50 font-medium'
                }`}
              >
                <span className="text-[11px] whitespace-nowrap">{opt.label}</span>
              </button>
            )
          })}
        </div>
        <div className="text-[11px] text-slate-500 font-normal tabular-nums text-left whitespace-nowrap">
          {maxDeposit === 'semua'
            ? 'Tanpa batas deposit'
            : `Deposit maksimal ${formatRupiah(maxDeposit)}`}
        </div>
      </div>

      <div className="box-border w-full h-px shrink-0 bg-slate-200"></div>

      {/* Metode Pengiriman */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-2 justify-start items-start">
        <div className="text-xs text-slate-600 font-semibold text-left whitespace-nowrap">
          Metode pengiriman
        </div>

        {/* Option 1: Ambil sendiri di gudang */}
        <label
          onClick={() => handleDeliveryToggle('selfPickup')}
          className="box-border w-fit h-fit shrink-0 flex flex-row gap-2 justify-start items-center cursor-pointer select-none"
        >
          <div
            className={`box-border w-4 shrink-0 h-4 flex flex-row justify-center items-center rounded transition-colors ${
              internalDelivery.selfPickup
                ? 'bg-blue-600'
                : 'bg-white ring-1 ring-slate-300'
            }`}
          >
            {internalDelivery.selfPickup && (
              <Check className="w-[11px] h-[11px] text-white stroke-[3]" />
            )}
          </div>
          <span className="text-xs text-slate-600 font-normal text-left whitespace-nowrap">
            Ambil sendiri di gudang
          </span>
        </label>

        {/* Option 2: Diantar kurir toko */}
        <label
          onClick={() => handleDeliveryToggle('courier')}
          className="box-border w-fit h-fit shrink-0 flex flex-row gap-2 justify-start items-center cursor-pointer select-none"
        >
          <div
            className={`box-border w-4 shrink-0 h-4 flex flex-row justify-center items-center rounded transition-colors ${
              internalDelivery.courier
                ? 'bg-blue-600'
                : 'bg-white ring-1 ring-slate-300'
            }`}
          >
            {internalDelivery.courier && (
              <Check className="w-[11px] h-[11px] text-white stroke-[3]" />
            )}
          </div>
          <span className="text-xs text-slate-600 font-normal text-left whitespace-nowrap">
            Diantar kurir toko
          </span>
        </label>
      </div>

      {/* Terapkan Filter Button */}
      <button
        type="button"
        onClick={() => onApply && onApply({
          powerMatch,
          maxPrice,
          maxDeposit,
          deliveryMethods: internalDelivery
        })}
        className="box-border w-full h-fit shrink-0 flex flex-row gap-2 py-[11px] px-4 justify-center items-center bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all rounded-[10px] cursor-pointer border-0 mt-1 shadow-xs"
      >
        <span className="text-[13px] text-white font-semibold text-left whitespace-nowrap">
          Terapkan Filter
        </span>
      </button>
    </aside>
  )
}
