import React, { useState } from 'react'
import { Lock } from 'lucide-react'

export default function CheckoutPanel({
  dailyPrice = 320000,
  depositAmount = 1200000,
  rentalDays = 4,
  startDateText = 'Kam, 12 Jun 2025',
  endDateText = 'Min, 15 Jun 2025',
  ownerAddress = 'Tebet, Jakarta Selatan (6.5 km)',
  courierFee = 45000,
  onAjukanSewa
}) {
  const [selectedDelivery, setSelectedDelivery] = useState('courier') // 'pickup' | 'courier'

  const rentalSubtotal = dailyPrice * rentalDays
  const deliveryCost = selectedDelivery === 'courier' ? courierFee : 0
  const totalPayment = rentalSubtotal + deliveryCost + depositAmount

  const formatRupiah = (val) => {
    return `Rp ${val.toLocaleString('id-ID')}`
  }

  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[16px] p-[20px] justify-start items-start bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[16px] shadow-xs sticky top-[88px]">
      {/* Header */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
        <h2 className="text-[15px] text-[#0F172A] font-bold text-left whitespace-nowrap m-0">
          Atur tanggal sewa
        </h2>
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-[5px] px-[10px] justify-start items-center bg-[#EFF6FF] rounded-full">
          <span className="text-[11px] text-[#1D4ED8] font-semibold tabular-nums whitespace-nowrap">
            {rentalDays} hari
          </span>
        </div>
      </div>

      {/* Date Row */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] justify-start items-start">
        <div className="box-border flex-1 h-fit flex flex-col gap-[3px] py-[9px] px-[11px] justify-start items-start bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[10px]">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">
            Mulai
          </span>
          <span className="text-[12px] text-[#0F172A] font-bold tabular-nums whitespace-nowrap">
            {startDateText}
          </span>
        </div>
        <div className="box-border flex-1 h-fit flex flex-col gap-[3px] py-[9px] px-[11px] justify-start items-start bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[10px]">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">
            Selesai
          </span>
          <span className="text-[12px] text-[#0F172A] font-bold tabular-nums whitespace-nowrap">
            {endDateText}
          </span>
        </div>
      </div>

      <div className="box-border w-full h-[1px] shrink-0 bg-[#E2E8F0]"></div>

      {/* Delivery Method Selector */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
        <div className="text-[12px] text-[#475569] font-semibold text-left whitespace-nowrap">
          Metode serah terima
        </div>
        <div className="text-[10px] text-[#94A3B8] font-normal text-left whitespace-nowrap">
          Wajib dipilih
        </div>
      </div>

      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start">
        {/* Option 1: Pickup */}
        <label
          onClick={() => setSelectedDelivery('pickup')}
          className={`box-border w-full h-fit shrink-0 flex flex-row gap-[10px] p-[12px] justify-start items-center rounded-[10px] cursor-pointer transition-all ${
            selectedDelivery === 'pickup'
              ? 'bg-[#EFF6FF] ring-1 ring-[#2563EB]'
              : 'bg-[#FFFFFF] ring-1 ring-[#E2E8F0] hover:bg-slate-50'
          }`}
        >
          <div
            className={`box-border w-[16px] shrink-0 h-[16px] flex flex-row justify-center items-center rounded-full ${
              selectedDelivery === 'pickup' ? 'bg-[#2563EB]' : 'ring-1 ring-slate-300'
            }`}
          >
            {selectedDelivery === 'pickup' && (
              <div className="w-[6px] h-[6px] bg-[#FFFFFF] rounded-full"></div>
            )}
          </div>
          <div className="box-border flex-1 h-fit flex flex-col gap-[1px] justify-start items-start">
            <span
              className={`text-[12px] font-bold text-left whitespace-nowrap ${
                selectedDelivery === 'pickup' ? 'text-[#1D4ED8]' : 'text-[#0F172A]'
              }`}
            >
              Ambil di gudang pemilik
            </span>
            <span className="text-[10px] text-[#94A3B8] font-normal text-left whitespace-nowrap">
              {ownerAddress}
            </span>
          </div>
          <div className="text-[12px] text-[#15803D] font-bold text-right whitespace-nowrap">
            Gratis
          </div>
        </label>

        {/* Option 2: Courier */}
        <label
          onClick={() => setSelectedDelivery('courier')}
          className={`box-border w-full h-fit shrink-0 flex flex-row gap-[10px] p-[12px] justify-start items-center rounded-[10px] cursor-pointer transition-all ${
            selectedDelivery === 'courier'
              ? 'bg-[#EFF6FF] ring-1 ring-[#2563EB]'
              : 'bg-[#FFFFFF] ring-1 ring-[#E2E8F0] hover:bg-slate-50'
          }`}
        >
          <div
            className={`box-border w-[16px] shrink-0 h-[16px] flex flex-row justify-center items-center rounded-full ${
              selectedDelivery === 'courier' ? 'bg-[#2563EB]' : 'ring-1 ring-slate-300'
            }`}
          >
            {selectedDelivery === 'courier' && (
              <div className="w-[6px] h-[6px] bg-[#FFFFFF] rounded-full"></div>
            )}
          </div>
          <div className="box-border flex-1 h-fit flex flex-col gap-[1px] justify-start items-start">
            <span
              className={`text-[12px] font-bold text-left whitespace-nowrap ${
                selectedDelivery === 'courier' ? 'text-[#1D4ED8]' : 'text-[#0F172A]'
              }`}
            >
              Diantar kurir toko
            </span>
            <span className="text-[10px] text-[#94A3B8] font-normal text-left whitespace-nowrap">
              Estimasi tiba 12 Jun pagi
            </span>
          </div>
          <div className="text-[12px] text-[#0F172A] font-semibold text-right whitespace-nowrap">
            {formatRupiah(courierFee)}
          </div>
        </label>
      </div>

      <div className="box-border w-full h-[1px] shrink-0 bg-[#E2E8F0]"></div>

      {/* Rincian Biaya */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] justify-start items-start">
        <div className="text-[11px] text-slate-500 font-bold tracking-wider text-left uppercase whitespace-nowrap">
          Rincian biaya
        </div>

        {/* Tarif Sewa */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row justify-between items-center text-[12px]">
          <span className="text-[#475569] font-normal">
            Tarif sewa ({rentalDays} hari × <span className="tabular-nums">{formatRupiah(dailyPrice)}</span>)
          </span>
          <span className="text-[#0F172A] font-semibold tabular-nums">{formatRupiah(rentalSubtotal)}</span>
        </div>

        {/* Biaya Pengiriman */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row justify-between items-center text-[12px]">
          <span className="text-[#475569] font-normal">Biaya pengiriman</span>
          <span className="text-[#0F172A] font-semibold tabular-nums">
            {deliveryCost === 0 ? 'Gratis' : formatRupiah(deliveryCost)}
          </span>
        </div>

        {/* Security Deposit */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row justify-between items-start text-[12px]">
          <div className="flex flex-col gap-[1px]">
            <span className="text-[#475569] font-normal">Security deposit</span>
            <span className="text-[10px] text-[#15803D] font-medium">
              Ditahan di escrow · 100% kembali
            </span>
          </div>
          <span className="text-[#0F172A] font-semibold tabular-nums">{formatRupiah(depositAmount)}</span>
        </div>

        <div className="box-border w-full h-[1px] shrink-0 bg-[#E2E8F0] my-1"></div>

        {/* Total Dibayar Sekarang */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row justify-between items-end">
          <span className="text-[13px] text-[#0F172A] font-bold">
            Total dibayar sekarang
          </span>
          <span className="text-[20px] text-[#2563EB] font-extrabold tracking-tight tabular-nums">
            {formatRupiah(totalPayment)}
          </span>
        </div>
      </div>

      {/* Escrow Guarantee Notice */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] p-[12px] justify-start items-start bg-[#EFF6FF] rounded-[10px]">
        <Lock className="w-[14px] h-[14px] text-[#1D4ED8] shrink-0 mt-[2px]" />
        <p className="text-[11px] leading-[16px] text-[#1D4ED8] font-normal text-left m-0">
          Dana Anda ditahan di escrow dan baru diteruskan ke pemilik setelah BAST akhir
          disetujui.
        </p>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={() => onAjukanSewa && onAjukanSewa({
          rentalDays,
          selectedDelivery,
          totalPayment
        })}
        className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] py-[12px] px-[16px] justify-center items-center bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] transition-all rounded-[10px] cursor-pointer border-0 shadow-xs"
      >
        <span className="text-[13px] text-[#FFFFFF] font-semibold whitespace-nowrap">
          Ajukan Sewa Sekarang
        </span>
      </button>

      {/* Subtext Note */}
      <div className="text-xs text-slate-500 font-normal text-center w-full">
        Belum ada biaya. Kontrak digital muncul di langkah checkout.
      </div>
    </div>
  )
}
