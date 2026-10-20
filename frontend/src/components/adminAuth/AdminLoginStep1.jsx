import React, { useRef, useState } from 'react'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  AlertCircle
} from 'lucide-react'

export default function AdminLoginStep1({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  isLoading,
  error,
  setError,
  rememberDevice,
  setRememberDevice,
  onBackToHome
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [infoModal, setInfoModal] = useState(null)

  // Input email & password sengaja dibiarkan tanpa atribut `value`/`defaultValue`
  // supaya tidak terisi otomatis. Nilainya tetap disinkronkan ke state wrapper
  // lewat onChange, danreferensi DOM dipakai untuk mengisi kredensial default.
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const isEmailEntered = email && email.trim().length > 0
  const isGmailOrDomain = email && (email.includes('@') && email.length >= 5)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Ambil nilai langsung dari input supaya yang dikirim sama persis dengan isi form.
    const emailValue = emailRef.current ? emailRef.current.value : email
    const passwordValue = passwordRef.current ? passwordRef.current.value : password

    if (!emailValue.trim() || !passwordValue) {
      if (setError) setError('Harap isi alamat email dan kata sandi')
      return
    }
    onSubmit(e, { email: emailValue, password: passwordValue })
  }

  const fillDefaultCredentials = () => {
    if (emailRef.current) emailRef.current.value = 'admin@myrent.com'
    if (passwordRef.current) passwordRef.current.value = 'Admin#Sewa2026'
    setEmail('admin@myrent.com')
    setPassword('Admin#Sewa2026')
    if (setError) setError('')
  }

  return (
    <div className="box-border w-full min-h-screen flex flex-col justify-between items-center bg-[#F8FAFC] py-6 px-4">
      {/* TopBar */}
      <div className="box-border w-full max-w-[1440px] px-4 sm:px-12 py-3 flex flex-row justify-between items-center">
        <div className="text-[10px] text-[#94A3B8] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-bold tracking-[1.5px] uppercase">
          PORTAL INTERNAL
        </div>
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="text-[11px] text-[#64748B] hover:text-[#0F172A] font-medium transition-colors cursor-pointer"
          >
            ← Kembali ke Beranda Publik
          </button>
        )}
      </div>

      {/* Main Body */}
      <div className="w-full flex-1 flex flex-col justify-center items-center py-6">
        <form
          onSubmit={handleSubmit}
          className="box-border w-full max-w-[456px] flex flex-col gap-[16px] p-[28px] justify-start items-start bg-[#FFFFFF] outline outline-1 outline-[#E2E8F0] -outline-offset-1 rounded-[20px] shadow-sm shadow-slate-200/50"
        >
          {/* Header */}
          <div className="w-full flex flex-col gap-1">
            <h1 className="text-[26px] sm:text-[28px] leading-tight text-[#0F172A] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-extrabold tracking-[-0.9px] text-left">
              Masuk sebagai admin
            </h1>
            <p className="text-[12.5px] leading-[20px] text-[#475569] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-normal text-left">
              Gunakan email Gmail resmi yang terdaftar pada undangan admin SewaAlat.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="w-full flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-[10px] text-red-700 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Form Fields */}
          <div className="box-border w-full flex flex-col gap-[14px]">
            {/* Field Email */}
            <div className="box-border w-full flex flex-col gap-[6px]">
              <div className="box-border w-full flex flex-row justify-between items-center">
                <label className="text-[12px] text-[#475569] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-semibold text-left">
                  Email Gmail
                </label>
                {isGmailOrDomain && (
                  <div className="flex flex-row items-center gap-[4px]">
                    <CheckCircle2 className="w-[12px] h-[12px] text-[#15803D]" />
                    <span className="text-[10px] text-[#15803D] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-semibold">
                      terdaftar
                    </span>
                  </div>
                )}
              </div>

              <div className="box-border w-full h-[46px] flex flex-row gap-[10px] px-[12px] items-center bg-[#FFFFFF] outline outline-1 outline-[#E2E8F0] -outline-offset-1 focus-within:outline-2 focus-within:outline-[#2563EB] rounded-[10px] transition-all">
                <Mail className="w-[15px] h-[15px] text-[#94A3B8] shrink-0" />
                <input
                  ref={emailRef}
                  type="email"
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error && setError) setError('')
                  }}
                  placeholder="admin@myrent.com atau rani.admin@gmail.com"
                  autoComplete="off"
                  required
                  className="w-full bg-transparent border-none outline-none text-[12.5px] text-[#0F172A] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-normal placeholder:text-slate-400"
                />
                {isEmailEntered && (
                  <CheckCircle2 className="w-[14px] h-[14px] text-[#2563EB] shrink-0" />
                )}
              </div>

              <div className="text-[10.5px] text-[#94A3B8] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-normal text-left">
                Domain wajib @gmail.com atau @myrent.com
              </div>
            </div>

            {/* Field Kata Sandi */}
            <div className="box-border w-full flex flex-col gap-[6px]">
              <div className="box-border w-full flex flex-row justify-between items-center">
                <label className="text-[12px] text-[#475569] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-semibold text-left">
                  Kata sandi
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setInfoModal(
                      'Untuk mereset kata sandi admin, silakan hubungi tim DevOps internal HQ di it-support@myrent.id.'
                    )
                  }
                  className="text-[10.5px] text-[#2563EB] hover:text-blue-700 font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-bold text-left cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>

              <div className="box-border w-full h-[46px] flex flex-row gap-[10px] px-[12px] items-center bg-[#FFFFFF] outline outline-1 outline-[#E2E8F0] -outline-offset-1 focus-within:outline-2 focus-within:outline-[#2563EB] rounded-[10px] transition-all">
                <Lock className="w-[15px] h-[15px] text-[#94A3B8] shrink-0" />
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error && setError) setError('')
                  }}
                  placeholder="••••••••••"
                  autoComplete="new-password"
                  required
                  className="w-full bg-transparent border-none outline-none text-[13px] text-[#0F172A] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-normal placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#94A3B8] hover:text-[#475569] p-0.5 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-[15px] h-[15px]" />
                  ) : (
                    <Eye className="w-[15px] h-[15px]" />
                  )}
                </button>
              </div>

              <div className="text-[10.5px] text-[#94A3B8] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-normal text-left">
                Sandi sementara 12 karakter dari email undangan
              </div>
            </div>

            {/* Info Sandi Sementara */}
            <div className="box-border w-full flex flex-row gap-[9px] p-[11px] justify-start items-start bg-[#FFFBEB] outline outline-1 outline-[#FDE68A] -outline-offset-1 rounded-[10px]">
              <KeyRound className="w-[14px] h-[14px] text-[#B45309] shrink-0 mt-0.5" />
              <div className="flex-1 flex flex-col gap-[3px] text-left">
                <div className="text-[11px] text-[#B45309] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-bold">
                  Kata sandi sementara aktif
                </div>
                <div className="text-[10.5px] leading-[16px] text-[#92400E] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-normal flex flex-wrap items-center justify-between gap-1">
                  <span>
                    <strong className="font-semibold">Admin#Sewa2026</strong> — wajib diganti setelah login pertama.
                  </span>
                  <button
                    type="button"
                    onClick={fillDefaultCredentials}
                    className="text-[10px] font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer"
                  >
                    Gunakan kredensial default
                  </button>
                </div>
              </div>
            </div>

            {/* Opsi: Remember Device */}
            <div className="box-border w-full flex flex-row justify-between items-center pt-1">
              <button
                type="button"
                onClick={() => setRememberDevice(!rememberDevice)}
                className="flex flex-row items-center gap-[8px] cursor-pointer group text-left"
              >
                <div
                  className={`box-border w-[30px] h-[18px] flex flex-row p-[2px] items-center rounded-full transition-colors ${
                    rememberDevice
                      ? 'bg-[#2563EB] justify-end'
                      : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-[14px] h-[14px] bg-[#FFFFFF] rounded-full shadow-xs"></div>
                </div>
                <span className="text-[11px] text-[#475569] group-hover:text-slate-800 font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-normal">
                  Ingat perangkat ini
                </span>
              </button>
            </div>

            {/* Button Lanjut */}
            <button
              type="submit"
              disabled={isLoading}
              className="box-border w-full h-[46px] flex flex-row gap-[8px] justify-center items-center bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.99] disabled:opacity-60 text-white rounded-[10px] transition-all cursor-pointer shadow-xs mt-1"
            >
              <span className="text-[13px] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-bold">
                {isLoading ? 'Memverifikasi...' : 'Lanjut verifikasi'}
              </span>
              <ArrowRight className="w-[15px] h-[15px] text-[#FFFFFF]" />
            </button>
          </div>

          {/* Footer Security Notice */}
          <div className="box-border w-full flex flex-row gap-[7px] pt-[4px] justify-center items-center text-center">
            <ShieldCheck className="w-[12px] h-[12px] text-[#94A3B8] shrink-0" />
            <div className="text-[10.5px] text-[#94A3B8] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-normal">
              Akses terbatas. 5 percobaan gagal mengunci akun 30 menit.
            </div>
          </div>
        </form>
      </div>

      {/* Info Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4 text-center">
            <h3 className="font-bold text-slate-900 text-sm">Informasi Keamanan Internal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{infoModal}</p>
            <button
              type="button"
              onClick={() => setInfoModal(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Bottom Footer Note */}
      <div className="w-full text-center text-[11px] text-slate-400 py-2">
        MyRent Admin Security Gateway &copy; 2026. All rights reserved.
      </div>
    </div>
  )
}
