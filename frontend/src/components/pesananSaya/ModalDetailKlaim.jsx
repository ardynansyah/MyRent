import React from 'react'
import { X, AlertTriangle, ShieldAlert, Store, Calendar, FileText, DollarSign, MessageCircle } from 'lucide-react'
import { formatLongDate } from '../../lib/dateHelpers'

export default function ModalDetailKlaim({ isOpen, onClose, order, onChatOwner }) {
  if (!isOpen || !order) return null

  const formatRupiah = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`
  const reason = order.disputeReason || order.disputeNote || order.returnData?.ownerNotes || 'Tidak ada keterangan klaim terperinci.'
  const damageFee = order.damageFee || order.returnData?.damageFeeClaimed || 0
  const equipment = order.equipment || {}
  const owner = equipment.owner || {}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 overflow-hidden my-8 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-rose-100 bg-rose-50/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 m-0">Detail Klaim &amp; Sengketa</h3>
              <p className="text-[11px] text-slate-500 m-0 font-medium">Invoice: {order.invoiceNumber}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Unit & Owner Summary */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl ring-1 ring-slate-200/70">
            <div className="w-14 h-14 bg-white rounded-lg ring-1 ring-slate-200 overflow-hidden shrink-0">
              <img
                src={equipment.imageUrl || 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=400&q=80'}
                alt={equipment.name || 'Alat'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate m-0">{equipment.name || 'Unit Alat'}</h4>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5">{equipment.category || 'Alat'} · Daya {equipment.powerWatt || 0}W</p>
              <div className="flex items-center gap-1.5 text-[10px] text-blue-600 font-semibold mt-1">
                <Store className="w-3 h-3 shrink-0" />
                <span>{owner.fullName || 'Pemilik Alat'}</span>
              </div>
            </div>
          </div>

          {/* Alasan Klaim Box (Dispute Reason) */}
          <div className="flex flex-col gap-1.5 p-4 bg-rose-50/70 rounded-xl border border-rose-200">
            <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Alasan Klaim dari Pemilik Alat:</span>
            </div>
            <p className="text-xs text-rose-950 font-semibold leading-relaxed bg-white/80 p-3 rounded-lg border border-rose-200/80 m-0">
              "{reason}"
            </p>
          </div>

          {/* Rincian Kompensasi & Dana Deposit */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-50 rounded-xl ring-1 ring-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Security Deposit</span>
              <p className="text-xs font-extrabold text-slate-900 m-0 tabular-nums">
                {formatRupiah(order.depositAmount)}
              </p>
            </div>
            <div className="p-3 bg-rose-50/60 rounded-xl ring-1 ring-rose-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-500">Estimasi Klaim Kerusakan</span>
              <p className="text-xs font-extrabold text-rose-700 m-0 tabular-nums">
                {formatRupiah(damageFee)}
              </p>
            </div>
          </div>

          {/* Status Mediasi Admin */}
          <div className="p-3.5 bg-blue-50/80 border border-blue-200/70 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-blue-900">Alur Penyelesaian Mediasi MyRent</span>
            <p className="text-[11px] text-blue-800 m-0 leading-relaxed">
              Tim mediasi MyRent akan meninjau bukti dokumentasi BAST awal dan BAST akhir. Security deposit Anda ditahan aman di rekening escrow sampai tercapai kesepakatan bersama atau putusan admin.
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2.5 p-4 border-t border-slate-100 bg-slate-50">
          {onChatOwner && (
            <button
              type="button"
              onClick={() => {
                onClose()
                onChatOwner(order)
              }}
              className="py-2 px-3.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 ring-1 ring-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Hubungi Pemilik</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
