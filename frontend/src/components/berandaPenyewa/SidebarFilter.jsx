import React, { useState } from 'react'
import { Check } from 'lucide-react'

export default function SidebarFilter({
  startDate = '12 Jun 2025',
  endDate = '15 Jun 2025',
  powerMatch = true,
  onPowerMatchChange,
  maxPrice = 250000,
  onMaxPriceChange,
  depositLimit = '< 1jt',
  onDepositLimitChange,
  deliveryMethods = { selfPickup: true, courier: true },
  onDeliveryMethodChange,
  onReset,
  onApply
}) {
  const [internalPowerMatch, setInternalPowerMatch] = useState(powerMatch)
  const [internalPrice, setInternalPrice] = useState(maxPrice)
  const [internalDeposit, setInternalDeposit] = useState(depositLimit)
  const [internalDelivery, setInternalDelivery] = useState(deliveryMethods)

  const handleTogglePower = () => {
    const val = !internalPowerMatch
    setInternalPowerMatch(val)
    if (onPowerMatchChange) onPowerMatchChange(val)
  }

  const handlePriceChange = (e) => {
    const val = Number(e.target.value)
    setInternalPrice(val)
    if (onMaxPriceChange) onMaxPriceChange(val)
  }

  const handleDepositSelect = (opt) => {
    setInternalDeposit(opt)
    if (onDepositLimitChange) onDepositLimitChange(opt)
  }

  const handleDeliveryToggle = (key) => {
    const next = { ...internalDelivery, [key]: !internalDelivery[key] }
    setInternalDelivery(next)
    if (onDeliveryMethodChange) onDeliveryMethodChange(next)
  }

  const handleReset = () => {
    setInternalPowerMatch(true)
    setInternalPrice(250000)
    setInternalDeposit('< 1jt')
    setInternalDelivery({ selfPickup: true, courier: true })
    if (onReset) onReset()
  }

  const formatRupiah = (val) => {
    return `Rp ${val.toLocaleString('id-ID')}`
  }

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
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2 justify-start items-start">
          <div className="box-border flex-1 h-fit flex flex-col gap-[3px] py-2 px-2.5 justify-start items-start bg-slate-50 ring-1 ring-slate-200 rounded-lg">
            <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
              Mulai
            </span>
            <span className="text-xs text-slate-900 font-semibold tabular-nums whitespace-nowrap">
              {startDate}
            </span>
          </div>
          <div className="box-border flex-1 h-fit flex flex-col gap-[3px] py-2 px-2.5 justify-start items-start bg-slate-50 ring-1 ring-slate-200 rounded-lg">
            <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
              Selesai
            </span>
            <span className="text-xs text-slate-900 font-semibold tabular-nums whitespace-nowrap">
              {endDate}
            </span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 font-normal tabular-nums text-left whitespace-nowrap">
          3 hari sewa · 1 hari buffer
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
            Maks. 1300 W · hanya alat yang aman
          </div>
        </div>
        <button
          type="button"
          onClick={handleTogglePower}
          className={`box-border w-9 shrink-0 h-5 flex flex-row p-0.5 items-center rounded-full transition-colors cursor-pointer border-0 ${
            internalPowerMatch ? 'justify-end bg-blue-600' : 'justify-start bg-slate-300'
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
          {formatRupiah(internalPrice)}
        </div>

        {/* Slider */}
        <div className="w-full py-1">
          <input
            type="range"
            min={50000}
            max={500000}
            step={25000}
            value={internalPrice}
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
          {['< 300rb', '< 1jt', 'Semua'].map((opt) => {
            const isSelected = internalDeposit === opt
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleDepositSelect(opt)}
                className={`box-border flex-1 h-fit flex flex-row py-[7px] px-0 justify-center items-start rounded-lg cursor-pointer transition-all border-0 ${
                  isSelected
                    ? 'bg-blue-50 ring-1 ring-blue-600 text-blue-700 font-bold'
                    : 'bg-white ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50 font-medium'
                }`}
              >
                <span className="text-[11px] whitespace-nowrap">{opt}</span>
              </button>
            )
          })}
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
          powerMatch: internalPowerMatch,
          maxPrice: internalPrice,
          depositLimit: internalDeposit,
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
