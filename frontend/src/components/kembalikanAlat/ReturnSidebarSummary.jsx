import React from 'react'
import {
  ShieldCheck,
  Calendar,
  Clock,
  Truck,
  Store,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'
import { formatShortDate, formatLongDate } from '../../lib/dateHelpers'

export default function ReturnSidebarSummary({
  order,
  step,
  returnData,
  onNext,
  isNextDisabled,
  nextLabel,
  agreementChecked,
  onAgreementChange
}) {
  const equipment = order.equipment || {}
  const formatRupiah = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`

  const deposit = order.depositAmount || 0
  const lateFee = returnData.lateFee || 0
  const damageFee = 0 // Menunggu inspeksi
  const estimatedRefund = Math.max(0, deposit - lateFee - damageFee)

  return (
    <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-4">
      {/* Unit & Summary Card */}
      <div className="box-border w-full p-5 bg-white ring-1 ring-slate-200 rounded-2xl shadow-2xs flex flex-col gap-4 text-xs">
        {/* Head */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 m-0">Ringkasan Pengembalian</h3>
            <p className="text-[11px] text-slate-500 m-0">{order.invoiceNumber}</p>
          </div>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-full">
            Langkah {step} dari 4
          </span>
        </div>

        {/* Equipment Preview */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-white ring-1 ring-slate-200 overflow-hidden shrink-0">
            <img
              src={equipment.imageUrl || 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=400&q=80'}
              alt={equipment.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate m-0">{equipment.name}</h4>
            <p className="text-[11px] text-slate-500 m-0">{equipment.category} · {equipment.powerWatt || 0}W</p>
          </div>
        </div>

        {/* Jadwal Ringkasan */}
        <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
          <div className="flex justify-between items-center text-slate-600">
            <div className="flex items-center gap-1.5">
              {returnData.returnMethod === 'COURIER_PICKUP' ? (
                <Truck className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <Store className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span>Metode:</span>
            </div>
            <span className="font-semibold text-slate-800">
              {returnData.returnMethod === 'COURIER_PICKUP' ? 'Dijemput Kurir Toko' : 'Antar ke Gudang'}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Tanggal:</span>
            </div>
            <span className="font-semibold text-slate-800">
              {formatShortDate(returnData.returnDate || order.endDate)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Slot Waktu:</span>
            </div>
            <span className="font-semibold text-slate-800">
              {returnData.returnSlot || '09:00 – 12:00 WIB'}
            </span>
          </div>
        </div>

        {/* Deposit & Refund Calculation */}
        <div className="flex flex-col gap-2 pt-3 border-t border-slate-200">
          <div className="text-[11px] uppercase font-bold text-slate-400">Proyeksi Pengembalian Deposit</div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Deposit Ditahan (Escrow):</span>
            <span className="font-semibold text-slate-800 tabular-nums">{formatRupiah(deposit)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Potongan Keterlambatan:</span>
            <span className={`font-semibold tabular-nums ${lateFee > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {lateFee > 0 ? `-${formatRupiah(lateFee)}` : 'Rp 0'}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Potongan Kerusakan:</span>
            <span className="text-[11px] text-amber-700 font-medium">Menunggu inspeksi</span>
          </div>

          <div className="border-t border-slate-200 pt-2 flex justify-between items-end">
            <span className="font-bold text-slate-900">Estimasi Refund:</span>
            <span className="text-base font-extrabold text-blue-600 tabular-nums">
              {formatRupiah(estimatedRefund)}
            </span>
          </div>
        </div>

        {/* Step 2 specific checkbox */}
        {step === 2 && (
          <label className="flex items-start gap-2.5 p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl cursor-pointer transition-colors border border-slate-200">
            <input
              type="checkbox"
              checked={!!agreementChecked}
              onChange={(e) => onAgreementChange(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-[11px] text-slate-600 leading-snug">
              Saya menyatakan kondisi alat sesuai checklist dan siap diperiksa bersama saat serah terima.
            </span>
          </label>
        )}

        {/* Next Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
            isNextDisabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-[0.98]'
          }`}
        >
          <span>{nextLabel || 'Lanjut'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Escrow Guarantee */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl text-blue-800 text-[11px] leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Dana deposit dikembalikan ke dompet setelah proses serah terima dan inspeksi unit selesai.</span>
        </div>
      </div>
    </aside>
  )
}
