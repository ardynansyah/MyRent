import React, { useState } from 'react'
import {
  ArrowLeft,
  QrCode,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import { topUpWallet } from '../../lib/walletApi'

const PRESET_AMOUNTS = [50000, 100000, 250000, 500000, 1000000, 2500000]

const PAYMENT_METHODS = [
  {
    id: 'QRIS',
    name: 'QRIS (Semua E-Wallet & M-Banking)',
    desc: 'BCA, Mandiri, GoPay, OVO, DANA, LinkAja',
    type: 'qris',
    badge: 'Otomatis Instan'
  },
  {
    id: 'BCA Virtual Account',
    name: 'BCA Virtual Account',
    desc: 'Transfer via m-BCA, KlikBCA, atau ATM',
    type: 'va',
    vaNumber: '8277 0812 3344 5566'
  },
  {
    id: 'Mandiri Virtual Account',
    name: 'Mandiri Virtual Account',
    desc: 'Transfer via Livin by Mandiri atau ATM',
    type: 'va',
    vaNumber: '8950 0812 3344 5566'
  },
  {
    id: 'BRI Virtual Account (BRIVA)',
    name: 'BRI Virtual Account (BRIVA)',
    desc: 'Transfer via BRImo atau ATM BRI',
    type: 'va',
    vaNumber: '1280 0812 3344 5566'
  }
]

export default function TopUpView({ onBack, onSuccess }) {
  const [amount, setAmount] = useState(250000)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('QRIS')
  const [step, setStep] = useState(1) // 1: Form, 2: Payment Preview, 3: Success
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const activeAmount = customAmount ? Number(customAmount) : amount

  const handleSelectPreset = (val) => {
    setAmount(val)
    setCustomAmount('')
    setError(null)
  }

  const handleCustomChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '')
    setCustomAmount(raw)
    setAmount(0)
    setError(null)
  }

  const handleProceedToPayment = () => {
    if (!activeAmount || activeAmount < 10000) {
      setError('Nominal minimal top up adalah Rp 10.000')
      return
    }
    if (activeAmount > 50000000) {
      setError('Nominal maksimal top up adalah Rp 50.000.000')
      return
    }
    setError(null)
    setStep(2)
  }

  const handleConfirmPayment = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await topUpWallet({
        amount: activeAmount,
        paymentMethod: selectedMethod
      })
      setStep(3)
      if (onSuccess) onSuccess(res.newBalance)
    } catch (err) {
      setError(err.message || 'Gagal memproses top up saldo')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyVa = (text) => {
    navigator.clipboard?.writeText(text.replace(/\s+/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentMethodObj = PAYMENT_METHODS.find((m) => m.id === selectedMethod) || PAYMENT_METHODS[0]

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Header View */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          type="button"
          onClick={step === 2 ? () => setStep(1) : onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{step === 2 ? 'Ubah Nominal / Metode' : 'Kembali'}</span>
        </button>
        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
          {step === 1 ? 'Pilih Nominal' : step === 2 ? 'Pembayaran' : 'Berhasil'}
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span className="text-xs font-medium">{error}</span>
        </div>
      )}

      {/* STEP 1: FORM INPUT */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 mb-2 block">
              Pilih Nominal Cepat
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((val) => {
                const isSelected = !customAmount && amount === val
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectPreset(val)}
                    className={`py-2 px-1 text-center rounded-xl font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    Rp {val.toLocaleString('id-ID')}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Atau Masukkan Nominal Lain (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-sm">Rp</span>
              <input
                type="text"
                value={customAmount ? Number(customAmount).toLocaleString('id-ID') : ''}
                onChange={handleCustomChange}
                placeholder="cth. 750.000"
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Minimal top up Rp 10.000</p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-2 block">
              Metode Pembayaran
            </label>
            <div className="flex flex-col gap-2">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethod === method.id
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          method.type === 'qris'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {method.type === 'qris' ? (
                          <QrCode className="w-4 h-4" />
                        ) : (
                          <Building2 className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{method.name}</div>
                        <div className="text-[10px] text-slate-500">{method.desc}</div>
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
          </div>

          <button
            type="button"
            onClick={handleProceedToPayment}
            className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Lanjut Pembayaran (Rp {activeAmount.toLocaleString('id-ID')})</span>
          </button>
        </div>
      )}

      {/* STEP 2: PAYMENT PREVIEW & CONFIRMATION */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center text-center">
            <span className="text-[11px] text-slate-500">Total Tagihan Top Up</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5 tracking-tight tabular-nums">
              Rp {activeAmount.toLocaleString('id-ID')}
            </h2>
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Biaya Admin Rp 0 (Gratis)
            </div>
          </div>

          {currentMethodObj.type === 'qris' ? (
            <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center text-center gap-3">
              <div className="font-bold text-slate-800 text-xs">Pindai QRIS untuk Menyelesaikan Pembayaran</div>
              {/* QR Code Container */}
              <div className="p-3 bg-white border border-slate-300 rounded-xl shadow-xs">
                <svg
                  className="w-40 h-40"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="100" fill="white" />
                  <path
                    d="M10 10H35V35H10V10ZM15 15V30H30V15H15Z"
                    fill="#1E293B"
                  />
                  <path
                    d="M65 10H90V35H65V10ZM70 15V30H85V15H70Z"
                    fill="#1E293B"
                  />
                  <path
                    d="M10 65H35V90H10V65ZM15 70V85H30V70H15Z"
                    fill="#1E293B"
                  />
                  <rect x="20" y="20" width="5" height="5" fill="#1E293B" />
                  <rect x="75" y="20" width="5" height="5" fill="#1E293B" />
                  <rect x="20" y="75" width="5" height="5" fill="#1E293B" />
                  <path
                    d="M45 10H55V25H45V10ZM45 35H60V45H45V35ZM10 45H25V55H10V45ZM35 45H45V60H35V45ZM65 45H75V60H65V45ZM80 45H90V55H80V45ZM45 65H60V75H45V65ZM65 65H90V75H65V65ZM45 80H55V90H45V80ZM75 80H90V90H75V80Z"
                    fill="#1E293B"
                  />
                </svg>
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Buka aplikasi BCA, Livin, GoPay, OVO, ShopeePay, atau DANA lalu scan kode QR di atas.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{currentMethodObj.name}</span>
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                  Verifikasi Otomatis
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block">Nomor Virtual Account</span>
                  <span className="text-base font-extrabold text-slate-900 tracking-wider">
                    {currentMethodObj.vaNumber || '8277 0812 3344 5566'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyVa(currentMethodObj.vaNumber || '8277081233445566')}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs text-[11px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Lakukan transfer tepat sesuai nominal yang tertera agar transaksi langsung masuk tanpa jeda.
              </p>
            </div>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleConfirmPayment}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Pembayaran…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Simulasikan Pembayaran Berhasil</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* STEP 3: SUCCESS */}
      {step === 3 && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 m-0">Top Up Saldo Berhasil!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Saldo sebesar <strong className="text-slate-800">Rp {activeAmount.toLocaleString('id-ID')}</strong> telah masuk ke dompet Anda secara langsung.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Lihat Saldo Saya
          </button>
        </div>
      )}
    </div>
  )
}
