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
    <aside className="box-border w-full lg:w-[264px] shrink-0 h-fit flex flex-col gap-[18px] p-[20px] justify-start items-start bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[14px] font-['Plus_Jakarta_Sans',system-ui,sans-serif]">
      {/* Head */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
        <h2 className="text-[14px] text-[#0F172A] font-bold text-left whitespace-nowrap m-0">
          Filter
        </h2>
        <button
          type="button"
          onClick={handleReset}
          className="text-[12px] text-[#2563EB] font-semibold text-left whitespace-nowrap bg-transparent border-0 cursor-pointer hover:underline p-0"
        >
          Reset
        </button>
      </div>

      <div className="box-border w-full h-[1px] shrink-0 bg-[#E2E8F0]"></div>

      {/* Rentang Tanggal */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] justify-start items-start">
        <div className="text-[12px] text-[#475569] font-semibold text-left whitespace-nowrap">
          Rentang Tanggal
        </div>
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-start">
          <div className="box-border flex-1 h-fit flex flex-col gap-[3px] py-[8px] px-[10px] justify-start items-start bg-[#F8FAFC] ring-1 ring-[#E2E8F0] rounded-[8px]">
            <span className="text-[10px] text-[#94A3B8] font-normal whitespace-nowrap">
              Mulai
            </span>
            <span className="text-[12px] text-[#0F172A] font-semibold whitespace-nowrap">
              {startDate}
            </span>
          </div>
          <div className="box-border flex-1 h-fit flex flex-col gap-[3px] py-[8px] px-[10px] justify-start items-start bg-[#F8FAFC] ring-1 ring-[#E2E8F0] rounded-[8px]">
            <span className="text-[10px] text-[#94A3B8] font-normal whitespace-nowrap">
              Selesai
            </span>
            <span className="text-[12px] text-[#0F172A] font-semibold whitespace-nowrap">
              {endDate}
            </span>
          </div>
        </div>
        <div className="text-[11px] text-[#94A3B8] font-normal text-left whitespace-nowrap">
          3 hari sewa · 1 hari buffer
        </div>
      </div>

      <div className="box-border w-full h-[1px] shrink-0 bg-[#E2E8F0]"></div>

      {/* Sesuai Listrik Usaha Saya */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] justify-start items-start">
        <div className="box-border flex-1 h-fit flex flex-col gap-[3px] justify-start items-start">
          <div className="text-[12px] text-[#0F172A] font-bold text-left whitespace-nowrap">
            Sesuai listrik usaha saya
          </div>
          <div className="text-[11px] leading-[15px] w-full text-[#94A3B8] font-normal text-left">
            Maks. 1300 W · hanya alat yang aman
          </div>
        </div>
        <button
          type="button"
          onClick={handleTogglePower}
          className={`box-border w-[36px] shrink-0 h-[20px] flex flex-row p-[2px] items-center rounded-full transition-colors cursor-pointer border-0 ${
            internalPowerMatch ? 'justify-end bg-[#2563EB]' : 'justify-start bg-slate-300'
          }`}
        >
          <div className="box-border w-[16px] shrink-0 h-[16px] bg-[#FFFFFF] rounded-full shadow-xs"></div>
        </button>
      </div>

      <div className="box-border w-full h-[1px] shrink-0 bg-[#E2E8F0]"></div>

      {/* Harga Harian Maksimal */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start">
        <div className="text-[12px] text-[#475569] font-semibold text-left whitespace-nowrap">
          Harga harian maksimal
        </div>
        <div className="text-[16px] text-[#2563EB] font-bold text-left whitespace-nowrap">
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
            className="w-full accent-[#2563EB] cursor-pointer h-[4px] bg-slate-200 rounded-lg appearance-none"
          />
        </div>

        <div className="text-[10px] text-[#94A3B8] font-normal text-left whitespace-nowrap">
          Rp 0 — Rp 500.000
        </div>
      </div>

      <div className="box-border w-full h-[1px] shrink-0 bg-[#E2E8F0]"></div>

      {/* Batas Security Deposit */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start">
        <div className="text-[12px] text-[#475569] font-semibold text-left whitespace-nowrap">
          Batas security deposit
        </div>
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[6px] justify-start items-start">
          {['< 300rb', '< 1jt', 'Semua'].map((opt) => {
            const isSelected = internalDeposit === opt
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleDepositSelect(opt)}
                className={`box-border flex-1 h-fit flex flex-row py-[7px] px-0 justify-center items-start rounded-[8px] cursor-pointer transition-all border-0 ${
                  isSelected
                    ? 'bg-[#EFF6FF] ring-1 ring-[#2563EB] text-[#1D4ED8] font-bold'
                    : 'bg-[#FFFFFF] ring-1 ring-[#E2E8F0] text-[#475569] hover:bg-slate-50 font-medium'
                }`}
              >
                <span className="text-[11px] whitespace-nowrap">{opt}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="box-border w-full h-[1px] shrink-0 bg-[#E2E8F0]"></div>

      {/* Metode Pengiriman */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start">
        <div className="text-[12px] text-[#475569] font-semibold text-left whitespace-nowrap">
          Metode pengiriman
        </div>

        {/* Option 1: Ambil sendiri di gudang */}
        <label
          onClick={() => handleDeliveryToggle('selfPickup')}
          className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center cursor-pointer select-none"
        >
          <div
            className={`box-border w-[16px] shrink-0 h-[16px] flex flex-row justify-center items-center rounded-[4px] transition-colors ${
              internalDelivery.selfPickup
                ? 'bg-[#2563EB]'
                : 'bg-white ring-1 ring-slate-300'
            }`}
          >
            {internalDelivery.selfPickup && (
              <Check className="w-[11px] h-[11px] text-white stroke-[3]" />
            )}
          </div>
          <span className="text-[12px] text-[#475569] font-normal text-left whitespace-nowrap">
            Ambil sendiri di gudang
          </span>
        </label>

        {/* Option 2: Diantar kurir toko */}
        <label
          onClick={() => handleDeliveryToggle('courier')}
          className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center cursor-pointer select-none"
        >
          <div
            className={`box-border w-[16px] shrink-0 h-[16px] flex flex-row justify-center items-center rounded-[4px] transition-colors ${
              internalDelivery.courier
                ? 'bg-[#2563EB]'
                : 'bg-white ring-1 ring-slate-300'
            }`}
          >
            {internalDelivery.courier && (
              <Check className="w-[11px] h-[11px] text-white stroke-[3]" />
            )}
          </div>
          <span className="text-[12px] text-[#475569] font-normal text-left whitespace-nowrap">
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
        className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] py-[11px] px-[16px] justify-center items-center bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] transition-all rounded-[10px] cursor-pointer border-0 mt-1 shadow-xs"
      >
        <span className="text-[13px] text-[#FFFFFF] font-semibold text-left whitespace-nowrap">
          Terapkan Filter
        </span>
      </button>
    </aside>
  )
}
