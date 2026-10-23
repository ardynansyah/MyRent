import React, { useState } from 'react'
import { X, AlertTriangle, Loader2 } from 'lucide-react'

export default function ModalBatalPesanan({ isOpen, onClose, order, onConfirm }) {
  const [reason, setReason] = useState('Jadwal produksi berubah')
  const [customReason, setCustomReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen || !order) return null

  const handleCancel = async () => {
    try {
      setSubmitting(true)
      await onConfirm(order.id, reason === 'Lainnya' ? customReason : reason)
      onClose()
    } catch {
      // Error handled by parent
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 m-0">Batalkan Pesanan</h3>
              <p className="text-[11px] text-slate-500 m-0">{order.invoiceNumber}</p>
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
          <p className="text-slate-600 m-0 leading-relaxed">
            Apakah Anda yakin ingin membatalkan pengajuan sewa untuk{' '}
            <strong className="text-slate-900">{order.equipment?.name || 'unit alat'}</strong>?
            Dana deposit dan sewa yang telah dibayar akan dikembalikan 100% ke saldo dompet Anda.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-700">Alasan Pembatalan</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Jadwal produksi berubah">Jadwal produksi berubah</option>
              <option value="Menemukan alat pengganti lain">Menemukan alat pengganti lain</option>
              <option value="Salah memilih tanggal atau spesifikasi">Salah memilih tanggal atau spesifikasi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {reason === 'Lainnya' && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Tuliskan alasan pembatalan..."
              rows={3}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-xs"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Ya, Batalkan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
