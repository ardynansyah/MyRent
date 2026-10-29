import React, { useState } from 'react'
import {
  X,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Store,
  Calendar,
  FileText,
  DollarSign,
  MessageCircle,
  CheckCircle2,
  Image as ImageIcon,
  Check,
  ArrowRight
} from 'lucide-react'
import { formatLongDate } from '../../lib/dateHelpers'

export default function ModalDetailKlaim({ isOpen, onClose, order, onChatOwner }) {
  if (!isOpen || !order) return null

  const [activeTab, setActiveTab] = useState('komparasi') // 'komparasi' | 'rincian'

  const formatRupiah = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`
  const reason = order.disputeReason || order.disputeNote || order.returnData?.ownerNotes || 'Tidak ada keterangan klaim terperinci.'
  const initialDemand = order.damageFee || order.returnData?.damageFeeClaimed || 0
  const equipment = order.equipment || {}
  const owner = equipment.owner || {}

  const isResolved = order.isResolvedByAdmin || (order.status === 'SELESAI' && order.finalDamageFee !== null && order.finalDamageFee !== undefined)
  const finalDamageFee = isResolved ? (order.finalDamageFee ?? 0) : null
  const renterRefund = isResolved ? Math.max(0, (order.depositAmount || 0) - (order.finalDamageFee || 0)) : null

  // Ekstraksi Foto BAST Awal
  const initialBast = order.initialBast || {}
  const initialPhotosObj = initialBast.photos || {}
  const initialPhotos = Array.isArray(initialPhotosObj)
    ? initialPhotosObj
    : [initialPhotosObj.front, initialPhotosObj.side, initialPhotosObj.panel, ...(initialPhotosObj.extra || [])].filter(Boolean)

  // Ekstraksi Foto BAST Akhir (Penyewa)
  const returnData = order.returnData || {}
  const returnPhotosObj = returnData.photos || {}
  const returnPhotos = Array.isArray(returnPhotosObj)
    ? returnPhotosObj
    : [returnPhotosObj.front, returnPhotosObj.side, returnPhotosObj.panel, ...(returnPhotosObj.extra || [])].filter(Boolean)

  // Ekstraksi Foto Bukti Kerusakan (Pemilik)
  const ownerPhotos = Array.isArray(order.ownerInspectionPhotos)
    ? order.ownerInspectionPhotos
    : (order.ownerInspectionPhotos ? [order.ownerInspectionPhotos] : [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
          isResolved ? 'bg-emerald-50/70 border-emerald-100' : 'bg-rose-50/70 border-rose-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isResolved ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {isResolved ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 m-0">
                  {isResolved ? 'Putusan Mediasi Sengketa Selesai' : 'Detail Klaim Sengketa & Mediasi'}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isResolved ? 'Selesai Putusan' : 'Mediasi Aktif'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 m-0 font-medium mt-0.5">
                Invoice: <span className="font-mono font-bold text-slate-700">{order.invoiceNumber}</span> · Unit: {equipment.name || 'Alat'}
              </p>
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

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Box Putusan Admin Jika Sudah Selesai */}
          {isResolved && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Hasil Putusan Resmi Admin MyRent</span>
                </div>
                {order.resolvedAt && (
                  <span className="text-[10px] text-emerald-700 font-medium">
                    Diputuskan pada {formatLongDate(order.resolvedAt)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-white/90 rounded-lg border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Ganti Rugi Disetujui Pemilik
                  </span>
                  <p className="text-sm font-black text-rose-600 mt-0.5 tabular-nums">
                    {formatRupiah(finalDamageFee)}
                  </p>
                  <span className="text-[10px] text-slate-400">Dipotong dari deposit</span>
                </div>
                <div className="p-3 bg-white/90 rounded-lg border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Sisa Deposit Dikembalikan
                  </span>
                  <p className="text-sm font-black text-emerald-600 mt-0.5 tabular-nums">
                    {formatRupiah(renterRefund)}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold">Telah cair ke dompet Anda</span>
                </div>
              </div>

              {order.adminResolutionNote && (
                <div className="pt-2 border-t border-emerald-200/60">
                  <span className="text-[10px] font-bold text-emerald-900 block mb-1">
                    Pertimbangan &amp; Catatan Mediasi Admin:
                  </span>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed italic m-0 bg-white/60 p-2.5 rounded-lg border border-emerald-100">
                    "{order.adminResolutionNote}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ringkasan Klaim Pemilik */}
          <div className="p-4 bg-rose-50/70 border border-rose-200/90 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-rose-900 font-bold text-xs">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Klaim Kerusakan &amp; Tuntutan Pemilik</span>
              </div>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-mono font-bold px-2 py-0.5 rounded">
                Tuntutan: {formatRupiah(initialDemand)}
              </span>
            </div>
            <p className="text-xs text-rose-950 font-semibold leading-relaxed bg-white/80 p-3 rounded-lg border border-rose-200/70 m-0">
              "{reason}"
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Total Security Deposit Ditahan di Escrow:</span>
              <strong className="text-slate-900">{formatRupiah(order.depositAmount)}</strong>
            </div>
          </div>

          {/* TAB KOMPARASI BAST AWAL VS BAST AKHIR */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                Komparasi Dokumentasi BAST (Visual Evidence)
              </span>
              <span className="text-[11px] text-slate-400">Bukti penentu keputusan mediasi</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Kolom Kiri: BAST Awal Sebelum Sewa */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    BAST Awal (Sebelum Sewa)
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 font-semibold px-2 py-0.5 rounded">
                    Kondisi Awal
                  </span>
                </div>

                {/* Galeri Foto Awal */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">Foto Serah Terima Awal:</span>
                  {initialPhotos.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1.5">
                      {initialPhotos.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="aspect-square rounded-lg overflow-hidden bg-slate-200 border border-slate-300 hover:opacity-90 transition block"
                        >
                          <img src={url} alt={`BAST Awal ${idx + 1}`} className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-center text-slate-400 text-[11px]">
                      Foto BAST awal tersimpan otomatis dari profil inspeksi katalog pemilik.
                    </div>
                  )}
                </div>

                {/* Catatan BAST Awal */}
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                  <strong className="block text-[10px] text-slate-400 uppercase font-bold">Catatan Serah Terima:</strong>
                  <span>{initialBast.notes || 'Unit diserahkan dalam kondisi siap pakai, aksesoris lengkap terverifikasi.'}</span>
                </div>
              </div>

              {/* Kolom Kanan: BAST Akhir & Bukti Klaim Pemilik */}
              <div className="p-3.5 bg-rose-50/40 border border-rose-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-rose-200">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    BAST Akhir &amp; Bukti Kerusakan
                  </span>
                  <span className="text-[10px] text-rose-700 bg-rose-100 font-semibold px-2 py-0.5 rounded">
                    Saat Pengembalian
                  </span>
                </div>

                {/* Foto Pengembalian Penyewa & Foto Kerusakan Pemilik */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">Foto Pengembalian &amp; Bukti Kerusakan:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Foto Pengembalian Penyewa */}
                    {returnPhotos.slice(0, 2).map((url, idx) => (
                      <a
                        key={`ret-${idx}`}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="aspect-square rounded-lg overflow-hidden bg-slate-200 border border-slate-300 relative group block"
                        title="Foto dari Penyewa"
                      >
                        <img src={url} alt={`Return ${idx}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 left-0 right-0 bg-slate-900/70 text-[9px] text-white text-center py-0.5">
                          Penyewa
                        </span>
                      </a>
                    ))}
                    {/* Foto Bukti Klaim Pemilik */}
                    {ownerPhotos.map((url, idx) => (
                      <a
                        key={`own-${idx}`}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="aspect-square rounded-lg overflow-hidden bg-rose-100 border-2 border-rose-400 relative group block"
                        title="Foto Bukti Kerusakan dari Pemilik"
                      >
                        <img src={url} alt={`Klaim Kerusakan ${idx}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 left-0 right-0 bg-rose-700 text-[9px] text-white font-bold text-center py-0.5">
                          Bukti Klaim
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Catatan Pengembalian Penyewa */}
                <div className="bg-white p-2.5 rounded-lg border border-rose-200/80 text-[11px] text-slate-600">
                  <strong className="block text-[10px] text-slate-400 uppercase font-bold">Catatan Pengembalian Penyewa:</strong>
                  <span>{returnData.conditionNotes || returnData.notes || 'Penyewa telah menyerahkan kembali unit fisik.'}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Edukasi Keamanan Escrow */}
          {!isResolved && (
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Jaminan Perlindungan Escrow MyRent
              </span>
              <p className="text-[11px] text-blue-800 m-0 leading-relaxed">
                Deposit Anda sebesar <strong>{formatRupiah(order.depositAmount)}</strong> aman ditahan di rekening penampungan resmi. Admin HQ bertindak sebagai mediator netral independen dan tidak akan melepaskan dana sebelum kesepakatan atau putusan faktual selesai.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 p-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <div className="text-[11px] text-slate-500">
            {isResolved ? 'Status pesanan telah diselesaikan.' : 'Menunggu putusan mediasi Admin.'}
          </div>
          <div className="flex items-center gap-2">
            {onChatOwner && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onChatOwner(order)
                }}
                className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 ring-1 ring-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
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
    </div>
  )
}
