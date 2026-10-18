import { useState } from 'react'
import {
  CheckCircle2,
  Store,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  AlertCircle
} from 'lucide-react'

export default function AuthPage({ onLoginSuccess, onNavigateRegister }) {
  const [role, setRole] = useState('penyewa') // 'penyewa' | 'pemilik'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [notification, setNotification] = useState('')

  const isPenyewa = role === 'penyewa'

  const handleNotify = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3500)
  }

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    setError('')
    // Kosongkan email jika pengguna berganti role dan belum memasukkan data asli
    if (!email || email === 'example@gmail.com' || email === 'example@gmail.com') {
      setEmail('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Harap masukkan alamat email Anda.')
      return
    }

    // Validasi format email standar
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setError('Format email tidak valid. Gunakan format nama@domain.com')
      return
    }

    if (!password) {
      setError('Harap masukkan kata sandi Anda.')
      return
    }

    if (password.length < 6) {
      setError('Kata sandi minimal terdiri dari 6 karakter.')
      return
    }

    const roleName = isPenyewa ? 'Penyewa UMKM' : 'Pemilik Alat'
    handleNotify(`Berhasil masuk sebagai ${roleName}! Mengalihkan...`)

    if (onLoginSuccess) {
      onLoginSuccess({
        email: trimmedEmail,
        role,
        rememberMe
      })
    }
  }

  const handleRegisterClick = () => {
    if (onNavigateRegister) {
      onNavigateRegister(role)
    } else {
      const roleLabel = isPenyewa ? 'Penyewa UMKM' : 'Pemilik Alat'
      handleNotify(`Mengarahkan ke formulir pendaftaran ${roleLabel}...`)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-between items-center text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Toast Notifikasi */}
      {notification && (
        <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-medium border border-slate-700/60 animate-in fade-in slide-in-from-top-4 duration-300 max-w-[90vw]">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header: Judul Web MyRent (Tampil di semua ukuran layar) */}
      <header className="w-full max-w-[1440px] px-5 sm:px-10 py-5 sm:py-6 flex flex-row items-center justify-between">
        <div className="text-[22px] sm:text-[20px] text-[#2563EB] font-extrabold tracking-[-0.3px] select-none cursor-pointer">
          MyRent
        </div>
      </header>

      {/* Main Body */}
      <main className="w-full max-w-[1440px] flex-1 flex items-center justify-center px-4 sm:px-10 py-4 sm:py-8 lg:py-12">
        <div className="w-full max-w-[1080px] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-[72px]">

          {/* Panel Kiri (Hero & Value Propositions)
              Khusus di mobile: DISEMBUNYIKAN (hidden)
              Di desktop (>= lg): DITAMPILKAN (lg:flex) */}
          <div className="hidden lg:flex w-full lg:w-[480px] shrink-0 flex-col gap-5 text-left">
            {/* Eyebrow Dinamis */}
            <div className="text-[11px] text-[#2563EB] font-bold tracking-[1.2px] uppercase">
              {isPenyewa ? 'AKUN PENYEWA UMKM' : 'AKUN PEMILIK ALAT'}
            </div>

            {/* Headline Dinamis */}
            <h1 className="text-3xl sm:text-[36px] sm:leading-[44px] text-[#0F172A] font-extrabold tracking-[-0.9px]">
              {isPenyewa
                ? 'Masuk dan lanjutkan sewa alat Anda.'
                : 'Kelola dan sewakan alat produksi Anda.'}
            </h1>

            {/* Deskripsi Dinamis */}
            <p className="text-[14px] leading-[22px] text-[#475569] max-w-[480px]">
              {isPenyewa
                ? 'Pantau pengajuan sewa, masa sewa berjalan, dan status refund deposit Anda dalam satu tempat.'
                : 'Pantau status unit disewa, jadwal pengembalian, dan pencairan dana sewa langsung ke rekening Anda.'}
            </p>

            {/* 3 Checklist Keunggulan Dinamis */}
            <div className="w-full flex flex-col gap-3.5 pt-2">
              {isPenyewa ? (
                <>
                  <div className="flex flex-row items-start gap-2.5">
                    <CheckCircle2
                      className="w-[18px] h-[18px] text-[#15803D] shrink-0 mt-0.5"
                      strokeWidth={2.4}
                    />
                    <span className="text-[13px] leading-[20px] text-[#475569]">
                      Ajukan sewa &amp; bayar dengan QRIS atau Virtual Account
                    </span>
                  </div>
                  <div className="flex flex-row items-start gap-2.5">
                    <CheckCircle2
                      className="w-[18px] h-[18px] text-[#15803D] shrink-0 mt-0.5"
                      strokeWidth={2.4}
                    />
                    <span className="text-[13px] leading-[20px] text-[#475569]">
                      Deposit ditahan escrow, refund otomatis setelah inspeksi
                    </span>
                  </div>
                  <div className="flex flex-row items-start gap-2.5">
                    <CheckCircle2
                      className="w-[18px] h-[18px] text-[#15803D] shrink-0 mt-0.5"
                      strokeWidth={2.4}
                    />
                    <span className="text-[13px] leading-[20px] text-[#475569]">
                      Kontrak dan BAST tersimpan rapi di akun Anda
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-row items-start gap-2.5">
                    <CheckCircle2
                      className="w-[18px] h-[18px] text-[#15803D] shrink-0 mt-0.5"
                      strokeWidth={2.4}
                    />
                    <span className="text-[13px] leading-[20px] text-[#475569]">
                      Penyewa terverifikasi identitas KTP &amp; NIB resmi
                    </span>
                  </div>
                  <div className="flex flex-row items-start gap-2.5">
                    <CheckCircle2
                      className="w-[18px] h-[18px] text-[#15803D] shrink-0 mt-0.5"
                      strokeWidth={2.4}
                    />
                    <span className="text-[13px] leading-[20px] text-[#475569]">
                      Dana sewa dan deposit diamankan di escrow sebelum alat dikirim
                    </span>
                  </div>
                  <div className="flex flex-row items-start gap-2.5">
                    <CheckCircle2
                      className="w-[18px] h-[18px] text-[#15803D] shrink-0 mt-0.5"
                      strokeWidth={2.4}
                    />
                    <span className="text-[13px] leading-[20px] text-[#475569]">
                      BAST serah terima digital lengkap dengan bukti dokumentasi foto
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Panel Kanan: Kartu Form Login
              Di mobile: Tampil penuh sebagai fokus utama tanpa gangguan teks hero samping */}
          <div className="w-full max-w-[440px] shrink-0 bg-white border border-[#E2E8F0] rounded-[20px] p-5 sm:p-7 flex flex-col gap-4 shadow-sm">
            {/* Logo Brand MyRent di dalam card (Hanya tampil di desktop, karena di mobile sudah ada judul di header atas) */}
            <div className="hidden lg:block text-[20px] text-[#2563EB] font-extrabold tracking-[-0.3px]">
              MyRent
            </div>

            {/* Judul & Subjudul Form */}
            <div>
              <h2 className="text-[18px] sm:text-[19px] font-bold text-[#0F172A]">
                Masuk ke akun Anda
              </h2>
              <p className="text-[12px] leading-[18px] text-[#475569] mt-1">
                Pilih tipe akun, lalu masuk dengan email dan kata sandi Anda.
              </p>
            </div>

            {/* Pemilih Role */}
            <div className="w-full flex flex-col gap-2">
              <div className="text-[9px] text-[#94A3B8] font-bold tracking-[0.9px] uppercase">
                MASUK SEBAGAI
              </div>

              <div className="w-full flex flex-row gap-2">
                {/* Role 1: Penyewa UMKM */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('penyewa')}
                  className={`flex-1 flex flex-row items-center gap-[9px] p-[10px_11px] rounded-[10px] text-left transition-all cursor-pointer ${isPenyewa
                    ? 'bg-[#EFF6FF] border border-[#2563EB] ring-1 ring-[#2563EB]/20'
                    : 'bg-white border border-[#E2E8F0] hover:border-slate-300'
                    }`}
                >
                  <div
                    className={`w-[26px] h-[26px] shrink-0 rounded-[7px] flex items-center justify-center transition-colors ${isPenyewa ? 'bg-[#2563EB]' : 'bg-[#F8FAFC]'
                      }`}
                  >
                    <Store
                      className={`w-[14px] h-[14px] ${isPenyewa ? 'text-white' : 'text-[#94A3B8]'}`}
                      strokeWidth={2}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <span
                      className={`text-[11px] font-bold truncate ${isPenyewa ? 'text-[#1D4ED8]' : 'text-[#0F172A]'
                        }`}
                    >
                      Penyewa UMKM
                    </span>
                    <span
                      className={`text-[9px] truncate ${isPenyewa ? 'text-[#1D4ED8]' : 'text-[#94A3B8]'
                        }`}
                    >
                      Sewa alat produksi
                    </span>
                  </div>
                  {isPenyewa && (
                    <div className="w-4 h-4 shrink-0 rounded-full bg-[#2563EB] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>

                {/* Role 2: Pemilik Alat */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('pemilik')}
                  className={`flex-1 flex flex-row items-center gap-[9px] p-[10px_11px] rounded-[10px] text-left transition-all cursor-pointer ${!isPenyewa
                    ? 'bg-[#EFF6FF] border border-[#2563EB] ring-1 ring-[#2563EB]/20'
                    : 'bg-white border border-[#E2E8F0] hover:border-slate-300'
                    }`}
                >
                  <div
                    className={`w-[26px] h-[26px] shrink-0 rounded-[7px] flex items-center justify-center transition-colors ${!isPenyewa ? 'bg-[#2563EB]' : 'bg-[#F8FAFC]'
                      }`}
                  >
                    <KeyRound
                      className={`w-[14px] h-[14px] ${!isPenyewa ? 'text-white' : 'text-[#94A3B8]'}`}
                      strokeWidth={2}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <span
                      className={`text-[11px] font-bold truncate ${!isPenyewa ? 'text-[#1D4ED8]' : 'text-[#0F172A]'
                        }`}
                    >
                      Pemilik Alat
                    </span>
                    <span
                      className={`text-[9px] truncate ${!isPenyewa ? 'text-[#1D4ED8]' : 'text-[#94A3B8]'
                        }`}
                    >
                      Sewakan alat Anda
                    </span>
                  </div>
                  {!isPenyewa && (
                    <div className="w-4 h-4 shrink-0 rounded-full bg-[#2563EB] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message Box (Bila Validasi Gagal) */}
            {error && (
              <div className="w-full flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-[8px] animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="leading-tight">{error}</span>
              </div>
            )}

            {/* Form Input */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
              {/* Field Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#475569]">
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder={isPenyewa ? 'example@gmail.com' : 'example@gmail.com'}
                    className="w-full h-[44px] bg-white border border-[#E2E8F0] rounded-[10px] pl-9 pr-3 text-[13px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                  />
                </div>
              </div>

              {/* Field Kata Sandi */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#475569]">
                  Kata Sandi
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="••••••••"
                    className="w-full h-[44px] bg-white border border-[#E2E8F0] rounded-[10px] pl-9 pr-10 text-[13px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#94A3B8] hover:text-[#475569] p-1 cursor-pointer transition-colors"
                    title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Baris Opsi: Checkbox Ingat Saya & Link Lupa Sandi */}
              <div className="flex flex-row justify-between items-center pt-0.5">
                <label
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex flex-row items-center gap-2 cursor-pointer select-none"
                >
                  <div
                    className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors ${rememberMe ? 'bg-[#2563EB]' : 'border border-[#CBD5E1] bg-white'
                      }`}
                  >
                    {rememberMe && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-[11px] text-[#475569]">Ingat saya</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleNotify('Tautan pemulihan kata sandi telah dikirim ke email Anda.')}
                  className="text-[11px] text-[#2563EB] font-bold hover:underline cursor-pointer transition-colors"
                >
                  Lupa sandi?
                </button>
              </div>

              {/* Tombol Utama: Masuk */}
              <button
                type="submit"
                className="w-full h-[44px] bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-[13px] rounded-[10px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs mt-1"
              >
                Masuk
              </button>

              {/* Tombol Sekunder (Daftar): Outline Dinamis Mengikuti Role */}
              <button
                type="button"
                onClick={handleRegisterClick}
                className="w-full h-[44px] bg-white hover:bg-blue-50/60 active:scale-[0.99] border border-[#2563EB] text-[#2563EB] font-bold text-[13px] rounded-[10px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <span>
                  {isPenyewa
                    ? 'Daftar sebagai Penyewa UMKM'
                    : 'Daftar sebagai Pemilik Alat'}
                </span>
                <ArrowRight className="w-[15px] h-[15px]" strokeWidth={2.4} />
              </button>
            </form>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[11px] text-[#94A3B8]">
        © 2026 MyRent. Platform Sewa Alat Terverifikasi untuk UMKM Indonesia.
      </footer>
    </div>
  )
}
