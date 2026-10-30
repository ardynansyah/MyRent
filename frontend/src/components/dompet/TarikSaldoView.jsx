import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Check
} from 'lucide-react'
import { withdrawWallet } from '../../lib/walletApi'

export default function TarikSaldoView({
  currentBalance = 0,
  accounts = [],
  onBack,
  onNavigateAddAccount,
  onSuccess
}) {
  const [amount, setAmount] = useState('')
  const [selectedAccountId, setSelectedAccountId] = useState(() => {
    const primary = accounts.find((a) => a.isPrimary)
    return primary?.id || accounts[0]?.id || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successData, setSuccessData] = useState(null)

  // Otomatis pilih rekening utama saat data rekening selesai dimuat
  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) {
      const primary = accounts.find((a) => a.isPrimary)
      setSelectedAccountId(primary?.id || accounts[0]?.id || '')
    }
  }, [accounts, selectedAccountId])

  const numericAmount = Number(amount) || 0

  const handleWithdrawAll = () => {
    setAmount(String(currentBalance))
    setError(null)
  }

  const handleSelectPreset = (val) => {
    if (val <= currentBalance) {
      setAmount(String(val))
      setError(null)
    } else {
      setError(`Saldo Anda (Rp ${currentBalance.toLocaleString('id-ID')}) tidak mencukupi untuk nominal ini`)
    }
  }

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault()
    if (!selectedAccountId) {
      setError('Pilih rekening tujuan pencairan terlebih dahulu atau daftarkan rekening baru')
      return
    }

    if (numericAmount < 10000) {
      setError('Nominal minimal penarikan dana adalah Rp 10.000')
      return
    }

    if (numericAmount > currentBalance) {
      setError(`Saldo tidak mencukupi. Saldo tersedia: Rp ${currentBalance.toLocaleString('id-ID')}`)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await withdrawWallet({
        amount: numericAmount,
        accountId: selectedAccountId
      })
      setSuccessData(res)
      if (onSuccess) onSuccess(res.newBalance)
    } catch (err) {
      setError(err.message || 'Gagal memproses penarikan saldo')
    } finally {
      setLoading(false)
    }
  }

  const activeAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0]

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Dompet</span>
        </button>
        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
          Tarik Saldo
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span className="text-xs font-medium">{error}</span>
        </div>
      )}

      {!successData ? (
        <form onSubmit={handleWithdrawSubmit} className="flex flex-col gap-4">
          {/* Card Saldo Tersedia */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex justify-between items-center shadow-xs">
            <div>
              <span className="text-[11px] text-slate-400">Saldo yang Dapat Ditarik</span>
              <h2 className="text-xl font-extrabold text-white mt-0.5 tracking-tight tabular-nums">
                Rp {Number(currentBalance).toLocaleString('id-ID')}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleWithdrawAll}
              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer"
            >
              Tarik Semua
            </button>
          </div>

          {/* Rekening Tujuan */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700">Rekening Tujuan Pencairan</label>
              <button
                type="button"
                onClick={onNavigateAddAccount}
                className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Rekening</span>
              </button>
            </div>

            {accounts.length === 0 ? (
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50 flex flex-col items-center gap-2">
                <p className="text-slate-500 text-xs">Belum ada rekening penarikan terdaftar.</p>
                <button
                  type="button"
                  onClick={onNavigateAddAccount}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors shadow-2xs"
                >
                  Daftarkan Rekening Sekarang
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {accounts.map((acc) => {
                  const isSelected = selectedAccountId === acc.id
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setSelectedAccountId(acc.id)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-600 ring-1 ring-blue-600'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">{acc.bankName}</span>
                            {acc.isPrimary && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-full">
                                Utama
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-600 font-mono">{acc.accountNumber}</span>
                          <span className="text-[10px] text-slate-400 ml-1">a.n. {acc.accountHolder}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Nominal Penarikan */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Nominal Penarikan (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-sm">Rp</span>
              <input
                type="text"
                value={amount ? Number(amount).toLocaleString('id-ID') : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '')
                  setAmount(raw)
                  setError(null)
                }}
                placeholder="cth. 100.000"
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Minimal penarikan Rp 10.000</p>
          </div>

          {/* Pilihan Cepat */}
          <div className="flex gap-1.5 flex-wrap">
            {[50000, 100000, 250000, 500000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleSelectPreset(val)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
              >
                Rp {val.toLocaleString('id-ID')}
              </button>
            ))}
          </div>

          {/* Rincian Penarikan */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Biaya Layanan Pencairan</span>
              <span className="font-bold text-emerald-600">Gratis (Rp 0)</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Estimasi Masuk Rekening</span>
              <span className="font-semibold text-slate-700">Instan (BI-FAST)</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-900">
              <span>Dana yang Akan Diterima</span>
              <span className="text-blue-700 tabular-nums">
                Rp {numericAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || accounts.length === 0 || numericAmount <= 0}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Penarikan…</span>
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                <span>Konfirmasi Tarik Dana</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Status Sukses */
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 m-0">Penarikan Dana Berhasil!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Dana sebesar <strong className="text-slate-800">Rp {numericAmount.toLocaleString('id-ID')}</strong> telah diproses dan dikirim ke rekening:
            </p>
            {activeAccount && (
              <div className="mt-3 p-3 bg-white border border-slate-200 rounded-xl text-left">
                <div className="font-bold text-slate-900 text-xs">{activeAccount.bankName} - {activeAccount.accountNumber}</div>
                <div className="text-[11px] text-slate-500">a.n. {activeAccount.accountHolder}</div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onBack}
            className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      )}
    </div>
  )
}
