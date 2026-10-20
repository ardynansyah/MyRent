import React, { useState, useRef, useEffect } from 'react'
import {
  UserCheck,
  Timer,
  ArrowRight,
  TriangleAlert,
  AlertCircle,
  ArrowLeft,
  KeyRound
} from 'lucide-react'

export default function AdminLoginStep2({
  email,
  onVerifyOtp,
  onBackToStep1,
  isLoading,
  error,
  setError
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(300) // 5 minutes timer
  const [attemptsUsed, setAttemptsUsed] = useState(1)

  const inputRefs = useRef([])

  // Format countdown mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // Countdown timer effect
  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  // Auto focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index, value) => {
    if (error && setError) setError('')

    // Hanya ambil digit angka
    const sanitized = value.replace(/\D/g, '')

    // Handle paste multiple digits
    if (sanitized.length > 1) {
      const newDigits = [...digits]
      for (let i = 0; i < 6; i++) {
        newDigits[i] = sanitized[i] || ''
      }
      setDigits(newDigits)
      const nextFocus = Math.min(sanitized.length, 5)
      setFocusedIndex(nextFocus)
      if (inputRefs.current[nextFocus]) {
        inputRefs.current[nextFocus].focus()
      }

      if (sanitized.length >= 6) {
        onVerifyOtp(sanitized.slice(0, 6))
      }
      return
    }

    const newDigits = [...digits]
    newDigits[index] = sanitized ? sanitized[sanitized.length - 1] : ''
    setDigits(newDigits)

    // Jika mengisi digit, pindah ke input berikutnya
    if (sanitized && index < 5) {
      setFocusedIndex(index + 1)
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus()
      }
    }

    // Jika sudah 6 digit terisi semua, auto submit
    const fullOtp = newDigits.join('')
    if (fullOtp.length === 6) {
      onVerifyOtp(fullOtp)
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Pindah ke kotak sebelumnya jika kosong dan tombol backspace ditekan
      setFocusedIndex(index - 1)
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setFocusedIndex(index - 1)
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      setFocusedIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    const otpCode = digits.join('')
    if (otpCode.length !== 6) {
      if (setError) setError('Masukkan seluruh 6 digit kode verifikasi')
      return
    }
    setAttemptsUsed((prev) => Math.min(5, prev + 1))
    onVerifyOtp(otpCode)
  }

  const fillDemoOtp = () => {
    const demo = ['1', '2', '3', '4', '5', '6']
    setDigits(demo)
    setFocusedIndex(5)
    if (setError) setError('')
    onVerifyOtp('123456')
  }

  // Get current client device and time context
  const [currentHour] = useState(() => {
    try {
      return new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return '12.04'
    }
  })

  return (
    <div className="box-border w-full min-h-screen flex flex-col justify-between items-center bg-[#F8FAFC] py-6 px-4">
      {/* TopBar */}
      <div className="box-border w-full max-w-[1440px] px-4 sm:px-12 py-3 flex flex-row justify-between items-center">
        <div className="text-[10px] text-[#94A3B8] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-bold tracking-[1.5px] uppercase">
          PORTAL INTERNAL
        </div>
        <button
          type="button"
          onClick={onBackToStep1}
          className="flex items-center gap-1.5 text-[11px] text-[#64748B] hover:text-[#0F172A] font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Form Login</span>
        </button>
      </div>

      {/* Main Body */}
      <div className="w-full flex-1 flex flex-col justify-center items-center py-6">
        <form
          onSubmit={handleManualSubmit}
          className="box-border w-full max-w-[456px] flex flex-col gap-[16px] p-[28px] justify-start items-start bg-[#FFFFFF] outline outline-1 outline-[#E2E8F0] -outline-offset-1 rounded-[20px] shadow-sm shadow-slate-200/50"
        >
          {/* Header */}
          <div className="w-full flex flex-col gap-1">
            <h1 className="text-[24px] leading-tight text-[#0F172A] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-extrabold tracking-[-0.7px] text-left">
              Verifikasi kode admin
            </h1>
            <p className="text-[12.5px] leading-[20px] text-[#475569] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-normal text-left">
              Masukkan 6 digit kode verifikasi yang Anda buat sendiri di Pengaturan › Keamanan untuk
              menyelesaikan login.
            </p>
          </div>

          {/* Konteks Sesi */}
          <div className="box-border w-full p-[10px_12px] flex flex-row justify-between items-center bg-[#F8FAFC] rounded-[10px] border border-slate-100">
            <div className="flex flex-row items-center gap-[10px]">
              <div className="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-700">
                <UserCheck className="w-[14px] h-[14px]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-[#0F172A] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-bold">
                  {email || 'admin@myrent.com'}
                </span>
                <span className="text-[9.5px] text-[#94A3B8] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-normal">
                  Chrome · Jakarta, ID · {currentHour} WIB
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onBackToStep1}
              className="text-[10px] font-semibold text-[#2563EB] hover:text-blue-700 cursor-pointer"
            >
              Ganti akun
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-[10px] text-red-700 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* 6-Digit OTP Box Area */}
          <div className="box-border w-full flex flex-col gap-[10px]">
            <div className="box-border w-full flex flex-row gap-[8px] justify-start items-center">
              {digits.map((digit, idx) => {
                const isCurrent = focusedIndex === idx
                const hasValue = digit !== ''

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setFocusedIndex(idx)
                      inputRefs.current[idx]?.focus()
                    }}
                    className={`box-border flex-1 h-[56px] flex flex-row justify-center items-center rounded-[11px] transition-all cursor-text relative ${
                      isCurrent
                        ? 'bg-[#FFFFFF] outline outline-2 outline-[#2563EB] -outline-offset-1'
                        : hasValue
                        ? 'bg-[#EFF6FF] outline outline-1 outline-[#BFDBFE] -outline-offset-1'
                        : 'bg-[#FFFFFF] outline outline-1 outline-[#E2E8F0] -outline-offset-1'
                    }`}
                  >
                    <input
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={digit}
                      onFocus={() => setFocusedIndex(idx)}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                    />

                    {digit ? (
                      <span className="text-[22px] text-[#0F172A] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-bold">
                        {digit}
                      </span>
                    ) : isCurrent ? (
                      <div className="w-[2px] h-[22px] bg-[#2563EB] animate-pulse"></div>
                    ) : (
                      <span className="text-[16px] text-[#CBD5E1] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-normal">
                        –
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Meta Information: Timer & Attempts */}
            <div className="box-border w-full flex flex-row justify-between items-center text-[10.5px] pt-1">
              <div className="flex flex-row items-center gap-[5px] text-[#94A3B8]">
                <Timer className="w-[12px] h-[12px]" />
                <span className="font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-normal">
                  {secondsLeft > 0
                    ? `Kode kedaluwarsa dalam ${formatTime(secondsLeft)}`
                    : 'Kode telah kedaluwarsa'}
                </span>
              </div>

              <div className="text-[#B45309] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-semibold">
                {attemptsUsed} dari 5 percobaan
              </div>
            </div>
          </div>

          {/* Quick MVP Demo Helper */}
          <div className="w-full flex items-center justify-between p-2.5 bg-blue-50/70 border border-blue-100 rounded-[10px] text-xs text-blue-800">
            <span className="flex items-center gap-1.5 font-medium">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              Kode Demo MVP: <strong className="font-bold text-blue-900">123456</strong>
            </span>
            <button
              type="button"
              onClick={fillDemoOtp}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
            >
              Gunakan Kode
            </button>
          </div>

          {/* Button Verifikasi & Masuk */}
          <button
            type="submit"
            disabled={isLoading || digits.join('').length !== 6}
            className="box-border w-full h-[46px] flex flex-row gap-[8px] justify-center items-center bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.99] disabled:opacity-50 text-white rounded-[10px] transition-all cursor-pointer shadow-xs"
          >
            <span className="text-[13px] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-bold">
              {isLoading ? 'Memverifikasi kode...' : 'Verifikasi & masuk'}
            </span>
            <ArrowRight className="w-[15px] h-[15px] text-[#FFFFFF]" />
          </button>

          {/* Catatan Keamanan */}
          <div className="box-border w-full flex flex-row gap-[9px] p-[11px] justify-start items-start bg-[#FFFBEB] outline outline-1 outline-[#FDE68A] -outline-offset-1 rounded-[10px]">
            <TriangleAlert className="w-[14px] h-[14px] text-[#B45309] shrink-0 mt-0.5" />
            <div className="flex-1 flex flex-col gap-[3px] text-left">
              <div className="text-[11px] text-[#B45309] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-bold">
                Jangan bagikan kode ini
              </div>
              <div className="text-[10.5px] leading-[16px] text-[#92400E] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-normal">
                Tim SewaAlat tidak pernah meminta kode verifikasi Anda. Jika Anda tidak merasa login,
                hentikan dan segera ubah kredensial akun.
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Bottom Footer Note */}
      <div className="w-full text-center text-[11px] text-slate-400 py-2">
        MyRent Admin Security Gateway &copy; 2026. All rights reserved.
      </div>
    </div>
  )
}
