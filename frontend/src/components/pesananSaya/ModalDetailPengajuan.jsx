import React from 'react'
import { X, FileText, Calendar, ShieldCheck, Truck, Store } from 'lucide-react'
import { formatLongDate, formatShortDate } from '../../lib/dateHelpers'

export default function ModalDetailPengajuan({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null

  const formatRupiah = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 m-0">Detail Pengajuan Sewa</h3>
              <p className="text-[11px] text-slate-500 m-0">{order.invoiceNumber}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Unit info */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-14 h-12 bg-white rounded-lg ring-1 ring-slate-200 overflow-hidden shrink-0">
              <img
                src={order.equipment?.imageUrl || 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=400&q=80'}
                alt={order.equipment?.name || 'Alat'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate m-0">{order.equipment?.name || 'Unit Alat'}</h4>
              <p className="text-[11px] text-slate-500 m-0">{order.equipment?.category} · {order.equipment?.powerWatt || 0}W</p>
              <p className="text-[10px] text-blue-600 font-medium m-0">{order.equipment?.owner?.fullName || 'Pemilik Alat'}</p>
            </div>
          </div>

          {/* Rental Timing */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tanggal Mulai</span>
              <p className="text-xs font-bold text-slate-800 m-0 mt-0.5">{formatLongDate(order.startDate)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tanggal Selesai</span>
              <p className="text-xs font-bold text-slate-800 m-0 mt-0.5">{formatLongDate(order.endDate)}</p>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2">
              {order.deliveryMethod === 'PICKUP' ? (
                <Store className="w-4 h-4 text-slate-600" />
              ) : (
                <Truck className="w-4 h-4 text-blue-600" />
              )}
              <span className="font-semibold text-slate-700">
                {order.deliveryMethod === 'PICKUP' ? 'Ambil Sendiri di Gudang' : 'Diantar Kurir Toko'}
              </span>
            </div>
            <span className="text-slate-500 font-medium">
              {order.shippingCost === 0 ? 'Gratis' : formatRupiah(order.shippingCost)}
            </span>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex justify-between text-slate-600">
              <span>Tarif Sewa ({order.rentalDays} hari)</span>
              <span className="font-semibold tabular-nums text-slate-800">{formatRupiah(order.rentalCost)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Biaya Pengiriman</span>
              <span className="font-semibold tabular-nums text-slate-800">{formatRupiah(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <div>
                <span>Security Deposit</span>
                <span className="block text-[10px] text-emerald-600">Ditahan di escrow · 100% kembali</span>
              </div>
              <span className="font-semibold tabular-nums text-slate-800">{formatRupiah(order.depositAmount)}</span>
            </div>

            <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-900">Total Dibayar</span>
              <span className="font-extrabold text-blue-600 text-base tabular-nums">{formatRupiah(order.totalPaid)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-blue-700 text-[11px]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Dana Anda tersimpan aman di rekening escrow SewaAlat selama masa sewa berlangsung.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
