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
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-4 p-5 justify-start items-start bg-white ring-1 ring-slate-200 rounded-2xl shadow-xs sticky top-22">
      {/* Header */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
        <h2 className="text-[15px] text-slate-900 font-bold text-left whitespace-nowrap m-0">
          Atur tanggal sewa
        </h2>
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-1.25 px-2.5 justify-start items-center bg-blue-50 rounded-full">
          <span className="text-[11px] text-blue-700 font-semibold tabular-nums whitespace-nowrap">
            {rentalDays} hari
          </span>
        </div>
      </div>

      {/* Date Row */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2.5 justify-start items-start">
        <div className="box-border flex-1 h-fit flex flex-col gap-0.75 py-2.25 px-2.75 justify-start items-start bg-white ring-1 ring-slate-200 rounded-[10px]">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">
            Mulai
          </span>
          <span className="text-xs text-slate-900 font-bold tabular-nums whitespace-nowrap">
            {startDateText}
          </span>
        </div>
        <div className="box-border flex-1 h-fit flex flex-col gap-0.75 py-2.25 px-2.75 justify-start items-start bg-white ring-1 ring-slate-200 rounded-[10px]">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">
            Selesai
          </span>
          <span className="text-xs text-slate-900 font-bold tabular-nums whitespace-nowrap">
            {endDateText}
          </span>
        </div>
      </div>

      <div className="box-border w-full h-px shrink-0 bg-slate-200"></div>

      {/* Delivery Method Selector */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
        <div className="text-xs text-slate-600 font-semibold text-left whitespace-nowrap">
          Metode serah terima
        </div>
        <div className="text-[10px] text-slate-400 font-normal text-left whitespace-nowrap">
          Wajib dipilih
        </div>
      </div>

      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-2 justify-start items-start">
        {/* Option 1: Pickup */}
        <label
          onClick={() => setSelectedDelivery('pickup')}
          className={`box-border w-full h-fit shrink-0 flex flex-row gap-2.5 p-3 justify-start items-center rounded-[10px] cursor-pointer transition-all ${
            selectedDelivery === 'pickup'
              ? 'bg-blue-50 ring-1 ring-blue-600'
              : 'bg-white ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          <div
            className={`box-border w-4 shrink-0 h-4 flex flex-row justify-center items-center rounded-full ${
              selectedDelivery === 'pickup' ? 'bg-blue-600' : 'ring-1 ring-slate-300'
            }`}
          >
            {selectedDelivery === 'pickup' && (
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            )}
          </div>
          <div className="box-border flex-1 h-fit flex flex-col gap-px justify-start items-start">
            <span
              className={`text-xs font-bold text-left whitespace-nowrap ${
                selectedDelivery === 'pickup' ? 'text-blue-700' : 'text-slate-900'
              }`}
            >
              Ambil di gudang pemilik
            </span>
            <span className="text-[10px] text-slate-400 font-normal text-left whitespace-nowrap">
              {ownerAddress}
            </span>
          </div>
          <div className="text-xs text-green-700 font-bold text-right whitespace-nowrap">
            Gratis
          </div>
        </label>

        {/* Option 2: Courier */}
        <label
          onClick={() => setSelectedDelivery('courier')}
          className={`box-border w-full h-fit shrink-0 flex flex-row gap-2.5 p-3 justify-start items-center rounded-[10px] cursor-pointer transition-all ${
            selectedDelivery === 'courier'
              ? 'bg-blue-50 ring-1 ring-blue-600'
              : 'bg-white ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          <div
            className={`box-border w-4 shrink-0 h-4 flex flex-row justify-center items-center rounded-full ${
              selectedDelivery === 'courier' ? 'bg-blue-600' : 'ring-1 ring-slate-300'
            }`}
          >
            {selectedDelivery === 'courier' && (
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            )}
          </div>
          <div className="box-border flex-1 h-fit flex flex-col gap-px justify-start items-start">
            <span
              className={`text-xs font-bold text-left whitespace-nowrap ${
                selectedDelivery === 'courier' ? 'text-blue-700' : 'text-slate-900'
              }`}
            >
              Diantar kurir toko
            </span>
            <span className="text-[10px] text-slate-400 font-normal text-left whitespace-nowrap">
              Estimasi tiba 12 Jun pagi
            </span>
          </div>
          <div className="text-xs text-slate-900 font-semibold text-right whitespace-nowrap">
            {formatRupiah(courierFee)}
          </div>
        </label>
      </div>

      <div className="box-border w-full h-px shrink-0 bg-slate-200"></div>

      {/* Rincian Biaya */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-2.5 justify-start items-start">
        <div className="text-[11px] text-slate-500 font-bold tracking-wider text-left uppercase whitespace-nowrap">
          Rincian biaya
        </div>

        {/* Tarif Sewa */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row justify-between items-center text-xs">
          <span className="text-slate-600 font-normal">
            Tarif sewa ({rentalDays} hari × <span className="tabular-nums">{formatRupiah(dailyPrice)}</span>)
          </span>
          <span className="text-slate-900 font-semibold tabular-nums">{formatRupiah(rentalSubtotal)}</span>
        </div>

        {/* Biaya Pengiriman */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row justify-between items-center text-xs">
          <span className="text-slate-600 font-normal">Biaya pengiriman</span>
          <span className="text-slate-900 font-semibold tabular-nums">
            {deliveryCost === 0 ? 'Gratis' : formatRupiah(deliveryCost)}
          </span>
        </div>

        {/* Security Deposit */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row justify-between items-start text-xs">
          <div className="flex flex-col gap-px">
            <span className="text-slate-600 font-normal">Security deposit</span>
            <span className="text-[10px] text-green-700 font-medium">
              Ditahan di escrow · 100% kembali
            </span>
          </div>
          <span className="text-slate-900 font-semibold tabular-nums">{formatRupiah(depositAmount)}</span>
        </div>

        <div className="box-border w-full h-px shrink-0 bg-slate-200 my-1"></div>

        {/* Total Dibayar Sekarang */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row justify-between items-end">
          <span className="text-[13px] text-slate-900 font-bold">
            Total dibayar sekarang
          </span>
          <span className="text-xl text-blue-600 font-extrabold tracking-tight tabular-nums">
            {formatRupiah(totalPayment)}
          </span>
        </div>
      </div>

      {/* Escrow Guarantee Notice */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2.5 p-3 justify-start items-start bg-blue-50 rounded-[10px]">
        <Lock className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-4 text-blue-700 font-normal text-left m-0">
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
        className="box-border w-full h-fit shrink-0 flex flex-row gap-2 py-3 px-4 justify-center items-center bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all rounded-[10px] cursor-pointer border-0 shadow-xs"
      >
        <span className="text-[13px] text-white font-semibold whitespace-nowrap">
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
