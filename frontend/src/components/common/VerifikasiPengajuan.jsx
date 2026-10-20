import { useState } from 'react'
import {
  Check,
  CheckCircle2,
  AlertCircle,
  Bell,
  ArrowRight,
  Edit3
} from 'lucide-react'
import RegisterTopBar from '../RegisterTopBar'

/**
 * Komponen Halaman Verifikasi Pendaftaran Admin
 * Konversi terpadu dari sourceHTML/verifikasiPenyewa-export.html & sourceHTML/VerifikasiPemilik-export.html
 *
 * @param {'penyewa'|'pemilik'} role - Peran registrasi
 * @param {object} formData - Data input registrasi
 * @param {function} onFinish - Aksi "Lihat Status Pengajuan" (navigasi ke dashboard/finish)
 * @param {function} onEditData - Aksi "Ubah Data yang Dikirim" (kembali ke step awal)
 * @param {function} onBackToHome - Navigasi ke beranda
 * @param {function} onBackToLogin - Navigasi ke login
 */
export default function VerifikasiPengajuan({
  role = 'penyewa',
  formData = {},
  onFinish,
  onEditData,
  onBackToHome,
  onBackToLogin
}) {
  const [toastMessage, setToastMessage] = useState('')

  const isPenyewa = role === 'penyewa'
  const roleTitle = isPenyewa
    ? 'Status verifikasi · Penyewa UMKM'
    : 'Status verifikasi · Pemilik Alat'

  const displayName = isPenyewa
    ? formData.fullName || formData.ktpName || formData.businessName || 'Budi'
    : formData.fullName || formData.nama || 'Budi Santoso'

  const powerText = formData.powerCapacity
    ? `${formData.powerCapacity} W`
    : '1300 W'

  const regCode = isPenyewa ? 'REG-RENTER-2406-0091' : 'REG-LENDER-2406-0044'

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  const handleContactAdmin = () => {
    showToast('Layanan Bantuan Admin MyRent: WhatsApp +62 812-9988-7766 (Senin–Jumat 08:00–18:00 WIB)')
  }

  // Header kanan: ikon lonceng + tautan pusat bantuan
  const rightNavbarContent = (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Bell className="w-3.5 h-3.5 text-slate-400" />
      <button
        type="button"
        onClick={handleContactAdmin}
        className="text-[11px] sm:text-xs text-blue-600 font-bold hover:underline cursor-pointer transition-colors"
      >
        Pusat bantuan
      </button>
    </div>
  )

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-between items-center text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Toast Notifikasi */}
      {toastMessage && (
        <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-medium border border-slate-700/60 animate-in fade-in slide-in-from-top-4 duration-300 max-w-[90vw]">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar Konsisten MyRent */}
      <RegisterTopBar
        roleTitle={roleTitle}
        onBackToHome={onBackToHome}
        onBackToLogin={onBackToLogin}
        rightContent={rightNavbarContent}
      />

      {/* Konten Utama: 2 Kolom Responsif (Pitch + Status Card) */}
      <main className="w-full max-w-[1080px] flex-1 flex flex-col lg:flex-row gap-8 lg:gap-11 px-4 sm:px-8 py-8 sm:py-12 justify-center items-center lg:items-start">
        {/* Kolom Kiri: Pitch & Status Stepper */}
        <div className="w-full max-w-[440px] flex flex-col gap-3.5 text-left shrink-0">
          {/* Badge Menunggu Verifikasi */}
          <div className="w-fit inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/90 rounded-[5px] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[9px] font-extrabold tracking-[0.8px] text-amber-700 uppercase">
              MENUNGGU VERIFIKASI ADMIN
            </span>
          </div>

          {/* Judul Utama */}
          <h1 className="text-[26px] sm:text-3xl leading-8 sm:leading-9 text-slate-900 font-extrabold tracking-[-0.8px]">
            {isPenyewa ? (
              <>
                Pengajuan verifikasi
                <br />
                berhasil dikirim.
              </>
            ) : (
              <>
                Pengajuan KYC
                <br />
                sedang ditinjau.
              </>
            )}
          </h1>

          {/* Subtitle Penjelasan */}
          <p className="text-[13px] leading-[21px] text-slate-600">
            {isPenyewa
              ? `Terima kasih, ${displayName}. Data usaha Anda sedang ditinjau Admin. Kami kabari lewat WhatsApp dan email setelah selesai.`
              : 'Data toko dan rekening Anda sudah kami terima. Setelah disetujui, Anda bisa langsung memasang alat pertama.'}
          </p>

          {/* Timeline 4 Tahap */}
          <div className="w-full flex flex-col pt-3">
            {/* Step 1: Akun & Identitas Dikirim (Selesai) */}
            <div className="w-full flex flex-row gap-3 items-start pb-1">
              <div className="w-[22px] flex flex-col items-center shrink-0">
                <div className="w-[22px] h-[22px] rounded-full bg-green-50 border border-emerald-200 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-700" strokeWidth={2.8} />
                </div>
                <div className="w-[1.5px] h-7 bg-green-700" />
              </div>
              <div className="flex flex-col gap-0.5 pt-0.5">
                <span className="text-xs font-bold text-slate-900">
                  Akun &amp; identitas dikirim
                </span>
                <span className="text-[10px] text-slate-400">
                  Hari ini · Data terkirim
                </span>
              </div>
            </div>

            {/* Step 2: Profil & Rekening Lengkap (Selesai) */}
            <div className="w-full flex flex-row gap-3 items-start pb-1">
              <div className="w-[22px] flex flex-col items-center shrink-0">
                <div className="w-[22px] h-[22px] rounded-full bg-green-50 border border-emerald-200 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-700" strokeWidth={2.8} />
                </div>
                <div className="w-[1.5px] h-7 bg-green-700" />
              </div>
              <div className="flex flex-col gap-0.5 pt-0.5">
                <span className="text-xs font-bold text-slate-900">
                  {isPenyewa ? 'Profil & rekening lengkap' : 'Gudang & rekening lengkap'}
                </span>
                <span className="text-[10px] text-slate-400">
                  Hari ini · Terverifikasi sistem
                </span>
              </div>
            </div>

            {/* Step 3: Peninjauan Admin (Sedang Berjalan) */}
            <div className="w-full flex flex-row gap-3 items-start pb-1">
              <div className="w-[22px] flex flex-col items-center shrink-0">
                <div className="w-[22px] h-[22px] rounded-full bg-blue-600 flex items-center justify-center shadow-xs">
                  <span className="text-[10px] font-bold text-white">3</span>
                </div>
                <div className="w-[1.5px] h-7 bg-slate-200" />
              </div>
              <div className="flex flex-col gap-0.5 pt-0.5">
                <span className="text-xs font-bold text-slate-900">
                  Peninjauan Admin
                </span>
                <span className="text-[10px] font-semibold text-blue-600">
                  Sedang berjalan · ± 24 jam kerja
                </span>
              </div>
            </div>

            {/* Step 4: Akun/Toko Aktif (Menunggu Keputusan) */}
            <div className="w-full flex flex-row gap-3 items-start">
              <div className="w-[22px] flex flex-col items-center shrink-0">
                <div className="w-[22px] h-[22px] rounded-full bg-white border border-slate-300 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400">4</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 pt-0.5">
                <span className="text-xs font-medium text-slate-600">
                  {isPenyewa ? 'Akun aktif & bisa menyewa' : 'Toko aktif & bisa posting alat'}
                </span>
                <span className="text-[10px] text-slate-400">
                  Menunggu keputusan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Card Status Pemeriksaan */}
        <div className="w-full max-w-[460px] bg-white border border-slate-200 rounded-[18px] p-6 sm:p-7 shadow-sm flex flex-col gap-4 text-left">
          {/* Card Title & Sub */}
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-bold text-slate-900">
              Yang sedang diperiksa Admin
            </h2>
            <p className="text-[11px] leading-[17px] text-slate-600">
              Estimasi 1 × 24 jam kerja. Anda akan dihubungi via WhatsApp bila ada data kurang.
            </p>
          </div>

          {/* Checklist Items */}
          <div className="w-full flex flex-col gap-2.5">
            {isPenyewa ? (
              <>
                <div className="w-full flex flex-row items-center gap-2.5 p-2.5 bg-slate-50 rounded-[9px] border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                  <span className="text-[11px] text-slate-600">Data akun &amp; email terverifikasi</span>
                </div>
                <div className="w-full flex flex-row items-center gap-2.5 p-2.5 bg-slate-50 rounded-[9px] border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                  <span className="text-[11px] text-slate-600">Foto KTP &amp; selfie terbaca jelas</span>
                </div>
                <div className="w-full flex flex-row items-center gap-2.5 p-2.5 bg-slate-50 rounded-[9px] border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                  <span className="text-[11px] text-slate-600">Daya listrik usaha {powerText} tercatat</span>
                </div>
                <div className="w-full flex flex-row items-center gap-2.5 p-2.5 bg-amber-50 rounded-[9px] border border-amber-200/60">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-[11px] font-medium text-amber-700">Foto area produksi perlu diperjelas</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-full flex flex-row items-center gap-2.5 p-2.5 bg-slate-50 rounded-[9px] border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                  <span className="text-[11px] text-slate-600">Identitas &amp; NIK sesuai KTP</span>
                </div>
                <div className="w-full flex flex-row items-center gap-2.5 p-2.5 bg-slate-50 rounded-[9px] border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                  <span className="text-[11px] text-slate-600">Titik GPS gudang terverifikasi</span>
                </div>
                <div className="w-full flex flex-row items-center gap-2.5 p-2.5 bg-slate-50 rounded-[9px] border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                  <span className="text-[11px] text-slate-600">Rekening pencairan atas nama sendiri</span>
                </div>
                <div className="w-full flex flex-row items-center gap-2.5 p-2.5 bg-amber-50 rounded-[9px] border border-amber-200/60">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-[11px] font-medium text-amber-700">Foto rak/etalase gudang belum diunggah</span>
                </div>
              </>
            )}
          </div>

          {/* Kotak Informasi Nomor Pengajuan */}
          <div className="w-full p-3 bg-blue-50 border border-blue-100/80 rounded-[10px] flex flex-col gap-1">
            <span className="text-[9px] font-bold text-blue-700 tracking-[0.8px] uppercase">
              NOMOR PENGAJUAN
            </span>
            <span className="text-[13px] font-extrabold text-blue-600 tracking-wide">
              {regCode}
            </span>
            <span className="text-[10px] text-slate-400">
              Dikirim hari ini · Terdaftar di sistem MyRent
            </span>
          </div>

          {/* Tombol Aksi */}
          <div className="w-full flex flex-col gap-2.5 pt-1">
            <button
              type="button"
              onClick={onFinish}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-semibold rounded-[10px] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Lihat Status Pengajuan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onEditData}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-900 border border-slate-200 text-xs font-semibold rounded-[10px] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Ubah Data yang Dikirim</span>
            </button>
          </div>

          {/* Footer Card */}
          <div className="w-full flex flex-row gap-1.5 justify-center items-center pt-1 text-[11px]">
            <span className="text-slate-400">Butuh dipercepat?</span>
            <button
              type="button"
              onClick={handleContactAdmin}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Hubungi Admin
            </button>
          </div>
        </div>
      </main>

      {/* Footer Bawah */}
      <footer className="w-full py-4 text-center text-[11px] text-slate-400">
        © 2026 MyRent. Platform Sewa Alat Terverifikasi untuk UMKM Indonesia.
      </footer>
    </div>
  )
}
