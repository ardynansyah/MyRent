import React from 'react'
import { X, Wallet, ShieldCheck, ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react'
import { getSessionUser } from '../../lib/userSession'

export default function ModalDompet({ isOpen, onClose }) {
  if (!isOpen) return null

  const user = getSessionUser()
  const kyc = user?.kycData || {}

  const bankName = kyc.bankName || 'BCA'
  const bankAccount = kyc.bankAccountNumber || '8830-1928-44'
  const accountHolder = kyc.bankAccountName || user?.fullName || 'Penyewa UMKM'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 m-0">Dompet &amp; Escrow SewaAlat</h3>
              <p className="text-[11px] text-slate-500 m-0">Saldo dan jaminan dana penyewa</p>
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
          {/* Main Balance Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] text-blue-200">Saldo Tersedia</span>
                <h2 className="text-2xl font-extrabold text-white mt-0.5 tracking-tight">Rp 1.250.000</h2>
              </div>
              <span className="text-[10px] bg-blue-500/40 text-blue-100 px-2.5 py-1 rounded-full font-semibold">
                Aktif
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-500/40 flex justify-between items-center text-[11px]">
              <div className="flex items-center gap-1.5 text-blue-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Dana Ditahan Escrow:</span>
              </div>
              <span className="font-bold text-white">Rp 2.000.000</span>
            </div>
          </div>

          {/* Bank Destination Card */}
          <div className="p-3.5 bg-slate-50 rounded-xl flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rekening Tujuan Refund</span>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 text-xs m-0">{bankName} - {bankAccount}</p>
                <p className="text-[11px] text-slate-500 m-0">a.n. {accountHolder}</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full ring-1 ring-emerald-200">
                Terverifikasi
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => alert('Fitur Top Up Saldo Dompet berhasil disimulasikan!')}
              className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Top Up Saldo</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Pengajuan Tarik Dana ke rekening Anda berhasil disimulasikan!')}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Tarik Saldo</span>
            </button>
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
