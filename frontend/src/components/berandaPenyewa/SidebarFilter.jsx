import React, { useState } from 'react'
import { Check } from 'lucide-react'
import { diffDays } from '../../lib/dateHelpers'

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

  const handleTogglePower = () => {
    if (onPowerMatchChange) onPowerMatchChange(!powerMatch)
  }

  const handlePriceChange = (e) => {
    const val = Number(e.target.value)
    if (onMaxPriceChange) onMaxPriceChange(val)
  }

  const handleDateChange = (key, value) => {
    if (!onFiltersChange) return

    onFiltersChange((prev) => ({
      ...prev,
      dateRange: {
        ...(prev.dateRange ?? { start: null, end: null }),
        [key]: value || null
      }
    }))
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

      {/* Rentang Tanggal */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-2.5 justify-start items-start">
        <div className="text-xs text-slate-600 font-semibold text-left whitespace-nowrap">
          Rentang Tanggal
        </div>
        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-2 justify-start items-start">
          <div className="box-border w-full h-fit flex flex-col gap-[3px] py-2 px-2.5 justify-start items-start bg-slate-50 ring-1 ring-slate-200 rounded-lg">
            <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
              Mulai
            </span>
            <input
              type="date"
              value={dateRange.start || ''}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className="box-border w-full bg-transparent border-0 p-0 text-xs text-slate-900 font-semibold tabular-nums outline-none cursor-pointer focus:text-blue-600"
            />
          </div>
          <div className="box-border w-full h-fit flex flex-col gap-[3px] py-2 px-2.5 justify-start items-start bg-slate-50 ring-1 ring-slate-200 rounded-lg">
            <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
              Selesai
            </span>
            <input
              type="date"
              value={dateRange.end || ''}
              min={dateRange.start || undefined}
              onChange={(e) => handleDateChange('end', e.target.value)}
              className="box-border w-full bg-transparent border-0 p-0 text-xs text-slate-900 font-semibold tabular-nums outline-none cursor-pointer focus:text-blue-600"
            />
          </div>
        </div>
        <div className="text-[11px] text-slate-500 font-normal tabular-nums text-left whitespace-nowrap">
          {rangeDays > 0 ? `${rangeDays} hari sewa · 1 hari buffer` : 'Pilih tanggal mulai & selesai'}
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
