import React, { useState } from 'react'
import { X, CalendarPlus, ShieldCheck, Loader2 } from 'lucide-react'
import { formatLongDate, addDays } from '../../lib/dateHelpers'

export default function ModalPerpanjangSewa({ isOpen, onClose, order, onExtendSuccess }) {
  const [additionalDays, setAdditionalDays] = useState(3)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  if (!isOpen || !order) return null

  const dailyPrice = order.equipment?.pricePerDay || 0
  const additionalCost = dailyPrice * additionalDays
  const currentEndDate = new Date(order.endDate)
  const newEndDate = addDays(currentEndDate, additionalDays)

  const formatRupiah = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`

  const handleExtend = async () => {
    try {
      setSubmitting(true)
      setErrorMsg(null)
      const res = await onExtendSuccess(order.id, additionalDays)
      onClose()
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memperpanjang masa sewa')
    } finally {
      setSubmitting(false)
    }
  }

  const dayOptions = [1, 2, 3, 5, 7]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <CalendarPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 m-0">Perpanjang Masa Sewa</h3>
              <p className="text-[11px] text-slate-500 m-0">{order.invoiceNumber} · {order.equipment?.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Current schedule info */}
          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Jadwal Selesai Saat Ini</span>
              <p className="text-xs font-bold text-slate-800 m-0">{formatLongDate(order.endDate)}</p>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
              {order.rentalDays} Hari Aktif
            </span>
          </div>

          {/* Option Pills */}
          <div>
            <label className="font-bold text-slate-800 block mb-2">Pilih Tambahan Hari</label>
            <div className="grid grid-cols-5 gap-1.5">
              {dayOptions.map((days) => {
                const isSelected = additionalDays === days
                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setAdditionalDays(days)}
                    className={`py-2 px-1 flex flex-col items-center justify-center rounded-xl font-bold transition-all border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm leading-none">+{days}</span>
                    <span className={`text-[10px] mt-0.5 font-normal ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      Hari
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Schedule Calculation */}
          <div className="p-3.5 bg-blue-50/70 ring-1 ring-blue-100 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-slate-600">
              <span>Tanggal Selesai Baru:</span>
              <span className="font-bold text-blue-900">{formatLongDate(newEndDate)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Tarif Harian:</span>
              <span className="font-semibold text-slate-800">{formatRupiah(dailyPrice)} / hari</span>
            </div>
            <div className="border-t border-blue-200/60 pt-2 flex justify-between items-center">
              <span className="font-bold text-slate-800">Biaya Tambahan:</span>
              <span className="font-extrabold text-blue-700 text-sm">{formatRupiah(additionalCost)}</span>
            </div>
          </div>

          {/* Escrow Note */}
          <div className="flex items-start gap-2 text-slate-500 text-[11px] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Biaya perpanjangan akan ditahan di rekening escrow dan diteruskan ke pemilik setelah masa sewa perpanjangan selesai.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleExtend}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-xs"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Konfirmasi +{additionalDays} Hari</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
