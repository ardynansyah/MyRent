import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlarmClock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CalendarPlus,
  MessageCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Star
} from 'lucide-react'
import { formatShortDate, formatLongDate } from '../../lib/dateHelpers'

export default function PesananCard({
  order,
  onChatOwner,
  onExtend,
  onConfirmDelivery,
  onCancel,
  onViewDetail,
  onTrack,
  onViewContract,
  onReview
}) {
  const navigate = useNavigate()
  const equipment = order.equipment || {}
  const status = order.status

  // Live countdown timer untuk SEWA_AKTIF
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (status !== 'SEWA_AKTIF') return

    const calculateTime = () => {
      const end = new Date(order.endDate).getTime()
      // Tambah jam 20:00 batas pengembalian
      const deadline = new Date(order.endDate)
      deadline.setHours(20, 0, 0, 0)
      const now = Date.now()
      const diff = deadline.getTime() - now

      if (diff <= 0) {
        setTimeLeft('Waktu sewa berakhir')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      )
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [order.endDate, status])

  const formatRupiah = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`

  const getStatusBadge = () => {
    switch (status) {
      case 'MENUNGGU_PEMBAYARAN':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">
            Menunggu Pembayaran
          </span>
        )
      case 'MENUNGGU_KONFIRMASI':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200">
            Menunggu Konfirmasi
          </span>
        )
      case 'DIKIRIM':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">
            Dikirim
          </span>
        )
      case 'SEWA_AKTIF':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            Sewa Aktif
          </span>
        )
      case 'INSPEKSI':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">
            Inspeksi
          </span>
        )
      case 'SELESAI':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200">
            Selesai
          </span>
        )
      case 'DISPUTE':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-red-50 text-red-700 ring-1 ring-red-200">
            Dispute / Klaim
          </span>
        )
      case 'DIBATALKAN':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-red-50 text-red-700 ring-1 ring-red-200">
            Dibatalkan
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-slate-100 text-slate-700">
            {status}
          </span>
        )
    }
  }

  const startDateText = formatShortDate(order.startDate)
  const endDateText = formatShortDate(order.endDate)

  return (
    <div className="box-border w-full flex flex-col gap-3.5 p-5 bg-white ring-1 ring-slate-200 rounded-2xl shadow-2xs hover:shadow-xs transition-shadow">
      {/* 1. Header: Invoice & Dates & Badge */}
      <div className="flex flex-row justify-between items-center pb-1">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-900 tracking-tight">{order.invoiceNumber}</span>
          <span className="w-1 h-1 rounded-full bg-slate-400"></span>
          <span className="text-[11px] text-slate-500 font-medium">
            {startDateText} – {endDateText} {new Date(order.endDate).getFullYear()}
          </span>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* 2. Mid: Unit Photo & Info & Pricing */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Photo */}
        <div className="w-[76px] h-[68px] rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200 shrink-0">
          <img
            src={equipment.imageUrl || 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=400&q=80'}
            alt={equipment.name || 'Alat'}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <h3 className="text-sm font-bold text-slate-900 truncate m-0">{equipment.name || 'Unit Alat'}</h3>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span>{equipment.category || 'Alat Produksi'}</span>
            <span>·</span>
            <span>Daya {equipment.powerWatt || 0}W</span>
            <span>·</span>
            <span className="text-blue-600 font-medium">{equipment.owner?.fullName || 'Pemilik Alat'}</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {order.deliveryMethod === 'PICKUP' ? 'Ambil di Gudang Pemilik' : 'Diantar Kurir Toko'} · {equipment.location || 'Jakarta'}
          </span>
        </div>

        {/* Pricing breakdown summary */}
        <div className="flex items-baseline sm:items-end flex-row sm:flex-col gap-2 sm:gap-0.5 shrink-0">
          <span className="text-sm font-extrabold text-slate-900 tabular-nums">
            {formatRupiah(order.totalPaid)}
          </span>
          <span className="text-[10px] text-slate-400">
            Deposit {formatRupiah(order.depositAmount)} · {order.rentalDays} hari
          </span>
        </div>
      </div>

      {/* 3. Conditional Alert / Countdown Banner */}
      {status === 'MENUNGGU_PEMBAYARAN' && (
        <div className="flex items-center gap-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl">
          <Clock className="w-4 h-4 text-amber-700 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-amber-900">
              Menunggu pembayaran escrow
            </div>
            <div className="text-[10px] text-amber-800">
              Selesaikan pembayaran sebelum batas waktu agar pesanan tidak dibatalkan otomatis.
            </div>
          </div>
        </div>
      )}

      {status === 'SEWA_AKTIF' && (
        <div className="flex items-center gap-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl">
          <AlarmClock className="w-4 h-4 text-amber-700 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-amber-900">
              Sisa masa sewa aktif: {timeLeft}
            </div>
            <div className="text-[10px] text-amber-800">
              Kembalikan sebelum {formatLongDate(order.endDate)} · 20:00 WIB untuk menghindari denda keterlambatan.
            </div>
          </div>
          <span className="hidden sm:inline-block text-xs font-extrabold text-amber-800 tabular-nums">
            {timeLeft}
          </span>
        </div>
      )}

      {status === 'DIKIRIM' && (
        <div className="flex items-center gap-3 p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl">
          <Truck className="w-4 h-4 text-blue-700 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-blue-900">
              {order.deliveryMethod === 'PICKUP'
                ? 'Unit siap diambil di gudang pemilik'
                : 'Unit sedang dalam perjalanan oleh kurir toko'}
            </div>
            <div className="text-[10px] text-blue-800">
              Periksa kondisi fisik dan fungsi kelistrikan sebelum melakukan konfirmasi penerimaan unit.
            </div>
          </div>
        </div>
      )}

      {status === 'INSPEKSI' && (
        <div className="flex items-center gap-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl">
          <Clock className="w-4 h-4 text-amber-700 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-amber-900">
              Menunggu verifikasi inspeksi pemilik alat
            </div>
            <div className="text-[10px] text-amber-800">
              BAST Akhir telah diserahkan. Dana security deposit akan diteruskan ke dompet Anda setelah inspeksi disetujui.
            </div>
          </div>
        </div>
      )}

      {status === 'MENUNGGU_KONFIRMASI' && (
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-700">
              Menunggu konfirmasi ketersediaan dari pemilik alat
            </div>
            <div className="text-[10px] text-slate-500">
              Pemilik alat memiliki waktu maksimal 12 jam untuk menyetujui pengajuan sewa ini.
            </div>
          </div>
        </div>
      )}

      {/* 4. Footer: Escrow info + Dynamic Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2.5 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Dana ditahan aman di escrow SewaAlat</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Action: Hubungi Pemilik */}
          <button
            type="button"
            onClick={() => onChatOwner(order)}
            className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 ring-1 ring-slate-200 rounded-xl transition-all"
          >
            Hubungi Pemilik
          </button>

          {/* Tombol Lihat Kontrak Sewa jika sudah disetujui */}
          {order.contractAgreedAt && (
            <button
              type="button"
              onClick={() => onViewContract?.(order)}
              className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 ring-1 ring-slate-200 rounded-xl transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Kontrak Sewa</span>
            </button>
          )}

          {/* Status: MENUNGGU_PEMBAYARAN */}
          {status === 'MENUNGGU_PEMBAYARAN' && (
            <>
              <button
                type="button"
                onClick={() => onCancel(order)}
                className="py-2 px-3 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 ring-1 ring-slate-200 rounded-xl transition-all"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={() => navigate(`/checkout/pembayaran/${order.id}`)}
                className="py-2 px-3.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Lanjutkan Pembayaran</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Status: MENUNGGU_KONFIRMASI */}
          {status === 'MENUNGGU_KONFIRMASI' && (
            <>
              <button
                type="button"
                onClick={() => onCancel(order)}
                className="py-2 px-3 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 ring-1 ring-slate-200 rounded-xl transition-all"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={() => onViewDetail(order)}
                className="py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-xl transition-all"
              >
                Lihat Pengajuan
              </button>
            </>
          )}

          {/* Status: DIKIRIM */}
          {status === 'DIKIRIM' && (
            <>
              <button
                type="button"
                onClick={() => onTrack(order)}
                className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 ring-1 ring-slate-200 rounded-xl transition-all"
              >
                Lacak Pengiriman
              </button>
              <button
                type="button"
                onClick={() => onConfirmDelivery(order)}
                className="py-2 px-3.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
              >
                Konfirmasi Terima &amp; BAST Awal
              </button>
            </>
          )}

          {/* Status: SEWA_AKTIF */}
          {status === 'SEWA_AKTIF' && (
            <>
              <button
                type="button"
                onClick={() => onExtend(order)}
                className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 ring-1 ring-slate-200 rounded-xl transition-all"
              >
                Perpanjang
              </button>
              <button
                type="button"
                onClick={() => navigate(`/pesanan-saya/${order.id}/kembalikan`)}
                className="py-2 px-3.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Kembalikan Alat &amp; BAST Akhir</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Status: INSPEKSI */}
          {status === 'INSPEKSI' && (
            <button
              type="button"
              onClick={() => navigate(`/pesanan-saya/${order.id}/kembalikan`)}
              className="py-2 px-3 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>Lihat Status Inspeksi &amp; Refund</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Status: SELESAI */}
          {status === 'SELESAI' && (
            <>
              {order.review ? (
                <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-50 text-amber-800 ring-1 ring-amber-200 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>Diulas {order.review.rating}/5</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onReview?.(order)}
                  className="py-2 px-3.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Beri Ulasan</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate(`/pesanan-saya/${order.id}/kembalikan`)}
                className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 ring-1 ring-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Lihat Dokumen BAST
              </button>
              <button
                type="button"
                onClick={() => navigate(`/detail-alat/${order.equipmentId}`)}
                className="py-2 px-3.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all cursor-pointer"
              >
                Sewa Lagi
              </button>
            </>
          )}

          {/* Status: DIBATALKAN */}
          {status === 'DIBATALKAN' && (
            <button
              type="button"
              onClick={() => navigate('/beranda-sewa')}
              className="py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
            >
              Cari Alat Lain
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
