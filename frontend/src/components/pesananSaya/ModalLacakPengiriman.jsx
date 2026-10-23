import React from 'react'
import { X, Truck, MapPin, CheckCircle2, Clock } from 'lucide-react'

export default function ModalLacakPengiriman({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null

  const isPickup = order.deliveryMethod === 'PICKUP'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 m-0">Lacak Pengiriman</h3>
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

        <div className="p-5 flex flex-col gap-4">
          <div className="bg-blue-50/60 ring-1 ring-blue-100 rounded-xl p-3.5 flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-blue-900">
                {isPickup ? 'Siap Diambil di Gudang Pemilik' : 'Kurir Sedang Dalam Perjalanan'}
              </span>
              <p className="text-[11px] text-blue-700 m-0">
                {isPickup
                  ? 'Silakan bawa bukti pesanan dan identitas saat pengambilan unit.'
                  : 'Estimasi tiba dalam 1-2 jam ke alamat operasional Anda.'}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-50"></div>
              <h4 className="text-xs font-bold text-slate-900 m-0">Pengajuan Sewa Disetujui</h4>
              <p className="text-[11px] text-slate-500 m-0">Pemilik alat telah mengonfirmasi kesiapan unit.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-50"></div>
              <h4 className="text-xs font-bold text-slate-900 m-0">
                {isPickup ? 'Unit Disiapkan di Gudang' : 'Barang Diserahkan ke Kurir Toko'}
              </h4>
              <p className="text-[11px] text-slate-500 m-0">QC fisik dan fungsi awal telah selesai dilakukan.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50 animate-pulse"></div>
              <h4 className="text-xs font-bold text-blue-600 m-0">
                {isPickup ? 'Menunggu Pengambilan' : 'Dalam Perjalanan Menuju Lokasi'}
              </h4>
              <p className="text-[11px] text-slate-500 m-0">
                {isPickup
                  ? `Alamat gudang: ${order.equipment?.location || 'Tebet, Jakarta Selatan'}`
                  : 'Kurir menuju lokasi operasional UMKM Anda.'}
              </p>
            </div>
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
