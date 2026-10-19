import { Sparkles } from 'lucide-react'

/**
 * Komponen Navbar atas terpadu untuk halaman registrasi (Penyewa UMKM & Pemilik Alat).
 *
 * Sesuai panduan:
 * - Menggunakan struktur isi dari navbar penyewa (Logo MyRent, divider, judul role pendaftaran,
 *   tombol cepat Isi Data Demo, serta teks 'Sudah punya akun? Masuk di sini').
 * - Menggunakan acuan layout dari pemilik alat (edge-to-edge w-full h-16 px-4 sm:px-8 tanpa batas max-width di navbar).
 */
export default function RegisterTopBar({
  roleTitle = 'Daftar sebagai Penyewa UMKM',
  onBackToLogin,
  onLoginClick,
  onBackToHome,
  onHomeClick,
  onFillDemoData,
  loginText = 'Masuk di sini'
}) {
  const handleHome = onBackToHome || onHomeClick || onBackToLogin || onLoginClick
  const handleLogin = onBackToLogin || onLoginClick

  return (
    <header className="w-full h-16 shrink-0 flex flex-row items-center justify-between px-4 sm:px-8 bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
      {/* Sisi Kiri: Logo + Garis Pemisah + Keterangan Role */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleHome}
          className="text-[18px] text-[#2563EB] font-extrabold tracking-[-0.3px] select-none hover:opacity-90 cursor-pointer transition-opacity"
        >
          MyRent
        </button>
        {roleTitle && (
          <>
            <div className="w-[1px] h-[16px] bg-[#E2E8F0] hidden sm:block" />
            <span className="text-[12px] text-[#475569] font-semibold hidden sm:inline-block">
              {roleTitle}
            </span>
          </>
        )}
      </div>

      {/* Sisi Kanan: Tombol Isi Data Demo (opsional) & Tautan Masuk */}
      <div className="flex items-center gap-2 sm:gap-4">
        {onFillDemoData && (
          <button
            type="button"
            onClick={onFillDemoData}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            title="Isi form otomatis untuk peninjauan cepat"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Isi Data Demo</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px]">
          <span className="text-[#475569] hidden sm:inline">Sudah punya akun?</span>
          <button
            type="button"
            onClick={handleLogin}
            className="text-[#2563EB] font-bold hover:underline cursor-pointer transition-colors"
          >
            {loginText}
          </button>
        </div>
      </div>
    </header>
  )
}
