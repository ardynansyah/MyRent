import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Wallet,
  ArrowRight,
  Building,
  AlertCircle
} from 'lucide-react'
import ModalDokumenBAST from './ModalDokumenBAST'
import ModalDompet from '../pesananSaya/ModalDompet'
import { formatLongDate, formatRupiah } from '../../lib/dateHelpers'
import { getSessionUser } from '../../lib/userSession'

export default function Step4RefundDeposit({ order, returnData }) {
  const navigate = useNavigate()
  const user = getSessionUser()
  const kyc = user?.kycData || {}

  const [isBastModalOpen, setIsBastModalOpen] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  const depositAmount = order?.depositAmount || 0
  const lateFee = order?.lateFee || returnData?.lateFee || 0
  const damageFee = order?.damageFee || 0
  const estimatedRefund = Math.max(0, depositAmount - lateFee - damageFee)

  return (
    <div className="w-full flex flex-col gap-5">
      {/* 1. Success Hero Banner */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-white mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Pengembalian Berhasil Diajukan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white m-0">
            BAST Akhir Diterbitkan &amp; Menunggu Inspeksi
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed m-0">
            Unit alat sedang dalam proses serah terima kembali ke pemilik. Pantau tahapan inspeksi fisik dan pencairan refund deposit Anda di bawah ini.
          </p>
        </div>

        <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
      </section>

      {/* 2. Grid: Status Timeline (Left) & Refund Financial Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Timeline (7 cols) */}
        <section className="lg:col-span-7 bg-white ring-1 ring-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 m-0">
              Alur Verifikasi Pengembalian
            </h2>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Status: {order.status === 'SELESAI' ? 'Selesai' : 'Inspeksi Berjalan'}
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {/* Step A: BAST Diserahkan */}
            <div className="relative">
              <div className="absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 m-0">
                    BAST Akhir Diserahkan oleh Penyewa
                  </h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md">
                    Selesai
                  </span>
                </div>
                <p className="text-xs text-slate-500 m-0">
                  Foto fisik 4 sisi dan tanda tangan digital Anda telah tersimpan secara resmi di dokumen No. BAST-OUT-{order.invoiceNumber}.
                </p>
                <div className="text-[10px] text-slate-400 pt-1">
                  Waktu penyerahan: {formatLongDate(returnData?.bastSubmittedAt || new Date())}
                </div>
              </div>
            </div>

            {/* Step B: Inspeksi Fisik */}
            <div className="relative">
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-xs ${
                  order.status === 'SELESAI'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 text-white animate-pulse'
                }`}
              >
                {order.status === 'SELESAI' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 m-0">
                    Konfirmasi Penerimaan &amp; Inspeksi Fisik Pemilik
                  </h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      order.status === 'SELESAI'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                    }`}
                  >
                    {order.status === 'SELESAI' ? 'Inspeksi Disetujui' : 'Menunggu Unit Tiba & Diperiksa'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 m-0 leading-relaxed">
                  Timer inspeksi fisik 2×24 jam aktif otomatis saat unit terkonfirmasi sampai di gudang pemilik ({order.equipment?.owner?.fullName || 'Mitra Pemilik'}).
                </p>
                <div className="p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-[11px] text-blue-900 mt-1 flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Proteksi SLA Escrow:</strong> Bila serah terima telah selesai dan pemilik tidak melakukan konfirmasi dalam batas waktu wajar, sistem MyRent akan melakukan verifikasi otomatis (Auto-Confirm) demi melindungi dana penyewa.
                  </span>
                </div>
              </div>
            </div>

            {/* Step C: Refund Deposit */}
            <div className="relative">
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-xs ${
                  order.status === 'SELESAI'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 ring-1 ring-slate-300 text-slate-400'
                }`}
              >
                {order.status === 'SELESAI' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 m-0">
                    Pencairan Refund Deposit ke Dompet
                  </h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                    {order.status === 'SELESAI' ? 'Telah Dicairkan' : 'Menunggu Hasil Inspeksi'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 m-0">
                  Dana deposit sebesar <strong className="text-slate-800">Rp {formatRupiah(estimatedRefund)}</strong> yang ditahan di escrow SewaAlat akan langsung diteruskan ke Dompet Anda setelah verifikasi disetujui.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Escrow & Refund Financials (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Card Rincian Deposit */}
          <section className="bg-white ring-1 ring-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900 m-0">Rincian Refund Deposit</h2>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Dana Terproteksi
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Security Deposit Awal</span>
                <span className="font-semibold text-slate-900">Rp {formatRupiah(depositAmount)}</span>
              </div>

              {lateFee > 0 && (
                <div className="flex justify-between items-center text-red-600">
                  <span>Denda Keterlambatan ({returnData?.daysLate || 0} hari)</span>
                  <span className="font-semibold">- Rp {formatRupiah(lateFee)}</span>
                </div>
              )}

              {damageFee > 0 && (
                <div className="flex justify-between items-center text-red-600">
                  <span>Biaya Klaim Kerusakan Fisik</span>
                  <span className="font-semibold">- Rp {formatRupiah(damageFee)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">Estimasi Dana Kembali</span>
                <span className="text-base font-extrabold text-blue-700">
                  Rp {formatRupiah(estimatedRefund)}
                </span>
              </div>
            </div>

            {/* Destination Bank Account */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Rekening Pencairan Terdaftar
              </div>
              <div className="p-3 bg-slate-50 rounded-xl ring-1 ring-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                    {kyc.bankName || 'BANK'}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">
                      {kyc.bankAccountNumber || '8830-1928-44'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      a.n. {kyc.bankAccountName || user?.fullName || 'Penyewa Terdaftar'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Terverifikasi
                </span>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setIsBastModalOpen(true)}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 ring-1 ring-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Lihat Detail Dokumen BAST Akhir</span>
            </button>

            <button
              type="button"
              onClick={() => setIsWalletModalOpen(true)}
              className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100/80 ring-1 ring-blue-200 rounded-xl text-xs font-bold text-blue-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Wallet className="w-4 h-4 text-blue-600" />
              <span>Buka Dompet Penyewa</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/pesanan-saya')}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Kembali ke Pesanan Saya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Dokumen BAST */}
      <ModalDokumenBAST
        isOpen={isBastModalOpen}
        onClose={() => setIsBastModalOpen(false)}
        order={order}
        returnData={returnData}
      />

      {/* Modal Dompet Penyewa */}
      <ModalDompet
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  )
}
