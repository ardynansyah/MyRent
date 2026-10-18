import { useState } from 'react'
import {
  Check,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock,
  UploadCloud,
  ShieldCheck,
  MapPin,
  RotateCw,
  Edit3,
  Sparkles,
  Info
} from 'lucide-react'

const SECTORS = [
  'Kuliner & Kopi',
  'Konveksi & Garmen',
  'Packaging & Percetakan',
  'Pertanian & Pengolahan Pangan',
  'Pertukangan & Kayu',
  'Elektronik & Perbaikan',
  'Lainnya'
]

const POWER_CAPACITIES = ['900 W', '1300 W', '2200 W', '> 3500 W']

const BANKS = [
  'BCA — Bank Central Asia',
  'Mandiri — Bank Mandiri',
  'BRI — Bank Rakyat Indonesia',
  'BNI — Bank Negara Indonesia',
  'BSI — Bank Syariah Indonesia',
  'CIMB Niaga',
  'Permata Bank'
]

const INITIAL_FORM = {
  // Step 1: Buat Akun
  fullName: '',
  businessName: '',
  businessSector: 'Kuliner & Kopi',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',

  // Step 2: Identitas & KTP
  nik: '',
  ktpName: '',
  birthPlace: '',
  birthDate: '',
  ktpFile: null,
  selfieFile: null,

  // Step 3: Profil UMKM
  startYear: '',
  nib: '',
  powerCapacity: '1300 W',
  frontPhoto: null,
  productionPhoto: null,
  businessDesc: '',

  // Step 4: Alamat & Rekening
  address: '',
  city: '',
  district: '',
  postalCode: '',
  landmark: '',
  gpsCoords: '-6.2601, 106.8135',
  bankName: 'BCA — Bank Central Asia',
  bankAccount: '',
  bankAccountHolder: '',
  confirmAccountOwner: false,
  confirmDeduction: false,

  // Step 5: Persetujuan akhir
  agreeTruth: false,
  agreeTerms: false
}

function getStoredDraft() {
  try {
    const saved = localStorage.getItem('myrent_register_penyewa_draft')
    if (saved) return JSON.parse(saved)
  } catch {
    // Abaikan jika localStorage tidak tersedia
  }
  return null
}

export default function RegisterPenyewaAlat({ onNavigateLogin, onRegisterSuccess }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(() => {
    const draft = getStoredDraft()
    return draft ? { ...INITIAL_FORM, ...draft } : INITIAL_FORM
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState('')
  const [draftSavedAt, setDraftSavedAt] = useState(() => {
    return getStoredDraft() ? 'Draf tersimpan' : 'Baru saja'
  })
  const [isGpsLoading, setIsGpsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const showToast = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3500)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      // Otomatis isi nama KTP / Nama Pemilik Rekening jika masih kosong saat nama penanggung jawab diketik
      if (field === 'fullName') {
        if (!prev.ktpName) updated.ktpName = value
        if (!prev.bankAccountHolder) updated.bankAccountHolder = value
      }
      return updated
    })

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSaveDraft = () => {
    try {
      // Simpan selain file objek dan password sensitif
      const {
        password: _password,
        confirmPassword: _confirmPassword,
        ktpFile: _ktpFile,
        selfieFile: _selfieFile,
        frontPhoto: _frontPhoto,
        productionPhoto: _productionPhoto,
        ...cleanData
      } = formData
      localStorage.setItem('myrent_register_penyewa_draft', JSON.stringify(cleanData))
      const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      setDraftSavedAt(`Disimpan pukul ${timeStr}`)
      showToast('Draf pendaftaran Anda berhasil disimpan.')
    } catch {
      showToast('Gagal menyimpan draf secara lokal.')
    }
  }

  const handleMockUpload = (field, defaultName) => {
    // Memberikan feedback visual upload instan
    if (formData[field]) {
      // Toggle hapus jika sudah ada
      handleInputChange(field, null)
      showToast(`Berkas ${defaultName} dihapus.`)
    } else {
      handleInputChange(field, {
        name: `${defaultName.toLowerCase().replace(/\s+/g, '_')}_terverifikasi.jpg`,
        size: '1.4 MB'
      })
      showToast(`Berkas ${defaultName} berhasil diunggah!`)
    }
  }

  const handleRefreshGps = () => {
    setIsGpsLoading(true)
    setTimeout(() => {
      // Simulasi koordinat baru yang realistis
      const lat = (-6.2000 - Math.random() * 0.1).toFixed(4)
      const lng = (106.8000 + Math.random() * 0.05).toFixed(4)
      handleInputChange('gpsCoords', `${lat}, ${lng}`)
      setIsGpsLoading(false)
      showToast('Koordinat GPS berhasil diperbarui!')
    }, 700)
  }

  // Isi data demo cepat agar pengguna / reviewer mudah menguji 5 tahap
  const handleFillDemoData = () => {
    setFormData({
      fullName: 'Budi Santoso',
      businessName: 'Kopi Senja Roastery',
      businessSector: 'Kuliner & Kopi',
      email: 'budi@kopisenja.id',
      phone: '081288990011',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      nik: '3174092188450003',
      ktpName: 'Budi Santoso',
      birthPlace: 'Jakarta',
      birthDate: '1991-04-12',
      ktpFile: { name: 'ktp_budi_santoso.jpg', size: '2.1 MB' },
      selfieFile: { name: 'selfie_ktp_budi.jpg', size: '1.8 MB' },
      startYear: '2019',
      nib: '812044579921',
      powerCapacity: '1300 W',
      frontPhoto: { name: 'tampak_depan_toko.jpg', size: '3.2 MB' },
      productionPhoto: { name: 'area_roasting_kopi.jpg', size: '2.7 MB' },
      businessDesc: 'Roastery kopi kecil dengan 2 barista, produksi 40 kg green bean per minggu dan melayani 60 cangkir/hari.',
      address: 'Jl. Kemang Selatan VIII No. 12, RT 03/RW 05, Bangka, Mampang Prapatan',
      city: 'Jakarta Selatan',
      district: 'Mampang Prapatan',
      postalCode: '12730',
      landmark: 'Sebelah minimarket 24 jam',
      gpsCoords: '-6.2601, 106.8135',
      bankName: 'BCA — Bank Central Asia',
      bankAccount: '44718890221',
      bankAccountHolder: 'Budi Santoso',
      confirmAccountOwner: true,
      confirmDeduction: true,
      agreeTruth: true,
      agreeTerms: true
    })
    setErrors({})
    showToast('Data simulasi berhasil dimuat ke seluruh langkah!')
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap penanggung jawab wajib diisi'
      if (!formData.businessName.trim()) newErrors.businessName = 'Nama usaha / UMKM wajib diisi'
      if (!formData.email.trim()) {
        newErrors.email = 'Alamat email wajib diisi'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = 'Format email tidak valid (nama@domain.com)'
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Nomor WhatsApp wajib diisi'
      } else if (formData.phone.replace(/\D/g, '').length < 9) {
        newErrors.phone = 'Nomor WhatsApp minimal 9 digit'
      }
      if (!formData.password) {
        newErrors.password = 'Kata sandi wajib diisi'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Kata sandi minimal 6 karakter'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Konfirmasi kata sandi tidak cocok'
      }
    } else if (step === 2) {
      if (!formData.nik.trim()) {
        newErrors.nik = 'NIK wajib diisi'
      } else if (formData.nik.replace(/\D/g, '').length !== 16) {
        newErrors.nik = 'NIK harus tepat 16 digit angka'
      }
      if (!formData.ktpName.trim()) newErrors.ktpName = 'Nama sesuai KTP wajib diisi'
      if (!formData.birthPlace.trim()) newErrors.birthPlace = 'Tempat lahir wajib diisi'
      if (!formData.birthDate) newErrors.birthDate = 'Tanggal lahir wajib diisi'
      if (!formData.ktpFile) newErrors.ktpFile = 'Foto KTP wajib diunggah'
      if (!formData.selfieFile) newErrors.selfieFile = 'Foto selfie bersama KTP wajib diunggah'
    } else if (step === 3) {
      if (!formData.businessName.trim()) newErrors.businessName = 'Nama UMKM wajib diisi'
      if (!formData.powerCapacity) newErrors.powerCapacity = 'Pilih daya listrik usaha'
      if (!formData.frontPhoto) newErrors.frontPhoto = 'Foto tampak depan tempat usaha wajib diunggah'
    } else if (step === 4) {
      if (!formData.address.trim()) newErrors.address = 'Alamat lengkap usaha wajib diisi'
      if (!formData.city.trim()) newErrors.city = 'Kota / Kabupaten wajib diisi'
      if (!formData.district.trim()) newErrors.district = 'Kecamatan wajib diisi'
      if (!formData.postalCode.trim()) newErrors.postalCode = 'Kode pos wajib diisi'
      if (!formData.bankAccount.trim()) newErrors.bankAccount = 'Nomor rekening refund wajib diisi'
      if (!formData.bankAccountHolder.trim()) newErrors.bankAccountHolder = 'Nama pemilik rekening wajib diisi'
      if (!formData.confirmAccountOwner) {
        newErrors.confirmAccountOwner = 'Anda wajib menyatakan bahwa rekening adalah milik sendiri'
      }
      if (!formData.confirmDeduction) {
        newErrors.confirmDeduction = 'Persetujuan kebijakan deposit wajib dicentang'
      }
    } else if (step === 5) {
      if (!formData.agreeTruth) {
        newErrors.agreeTruth = 'Harap konfirmasi kebenaran data Anda'
      }
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'Harap setujui Syarat & Ketentuan Layanan MyRent'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        handleSubmitFinal()
      }
    } else {
      showToast('Harap periksa kolom formulir yang masih belum terisi dengan benar.')
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (onNavigateLogin) {
      onNavigateLogin()
    }
  }

  const handleSubmitFinal = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      try {
        localStorage.removeItem('myrent_register_penyewa_draft')
      } catch {
        // Abaikan
      }
      if (onRegisterSuccess) {
        onRegisterSuccess({
          email: formData.email,
          fullName: formData.fullName,
          businessName: formData.businessName,
          role: 'penyewa'
        })
      }
    }, 1200)
  }

  // Tampilan Sukses Pendaftaran
  if (isSubmitted) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-between items-center text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-700">
        <header className="w-full max-w-[1440px] px-5 sm:px-10 py-5 sm:py-6 flex items-center justify-between border-b border-[#E2E8F0] bg-white">
          <div
            onClick={onNavigateLogin}
            className="text-[20px] text-[#2563EB] font-extrabold tracking-[-0.3px] select-none cursor-pointer flex items-center gap-2"
          >
            MyRent
          </div>
        </header>

        <main className="w-full max-w-[640px] px-4 py-12 flex-1 flex items-center justify-center">
          <div className="w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-8 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-9 h-9" strokeWidth={2.5} />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Pendaftaran Berhasil Dikirim
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight pt-2">
                Selamat Datang di MyRent, {formData.fullName || 'Penyewa UMKM'}!
              </h1>
              <p className="text-sm text-[#475569] leading-relaxed max-w-md mx-auto">
                Data pendaftaran dan verifikasi identitas Anda untuk <strong className="text-slate-800">{formData.businessName || 'Usaha Anda'}</strong> telah masuk ke antrean verifikasi Admin.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center text-slate-500 pb-2 border-b border-slate-200">
                <span>Estimasi Review Admin</span>
                <span className="font-bold text-slate-800">1 × 24 Jam Kerja</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 pb-2 border-b border-slate-200">
                <span>Notifikasi Status</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  WhatsApp (+62 {formData.phone || '-'})
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Email Terdaftar</span>
                <span className="font-medium text-slate-800">{formData.email}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={onNavigateLogin}
                className="w-full sm:w-auto px-6 py-3 bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Masuk ke Halaman Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>

        <footer className="w-full py-4 text-center text-[11px] text-[#94A3B8]">
          © 2026 MyRent. Platform Sewa Alat Terverifikasi untuk UMKM Indonesia.
        </footer>
      </div>
    )
  }

  // Teks Stepper Col kiri yang adaptif sesuai langkah aktif
  const STEP_METAS = [
    {
      num: 1,
      title: 'Buat akun & kredensial usaha.',
      desc: 'Lengkapi informasi dasar penanggung jawab dan akun untuk mulai menyewa alat produksi.',
      name: 'Buat Akun'
    },
    {
      num: 2,
      title: 'Verifikasi identitas pemilik usaha.',
      desc: 'Data KTP dipakai untuk kontrak sewa digital dan proses klaim deposit bila terjadi sengketa.',
      name: 'Identitas & KTP'
    },
    {
      num: 3,
      title: 'Profil usaha & daya listrik.',
      desc: 'Daya listrik usaha dipakai untuk memfilter katalog agar Anda hanya melihat alat yang aman dipakai.',
      name: 'Profil UMKM'
    },
    {
      num: 4,
      title: 'Alamat usaha & rekening refund.',
      desc: 'Rekening ini dipakai untuk mengembalikan security deposit Anda setelah alat dikembalikan dengan aman.',
      name: 'Alamat & Rekening'
    },
    {
      num: 5,
      title: 'Cek sekali lagi, lalu kirim verifikasi.',
      desc: 'Setelah dikirim, Admin meninjau data Anda dalam 1 × 24 jam. Anda akan menerima notifikasi WhatsApp.',
      name: 'Review & Kirim'
    }
  ]

  const currentMeta = STEP_METAS[currentStep - 1]

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-between items-center text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Toast Notifikasi */}
      {notification && (
        <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-medium border border-slate-700/60 animate-in fade-in slide-in-from-top-4 duration-300 max-w-[90vw]">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* TopBar Konsisten dengan Figma / Mentah */}
      <header className="w-full border-b border-[#E2E8F0] bg-white sticky top-0 z-30">
        <div className="max-w-[1240px] mx-auto h-[64px] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-[18px] text-[#2563EB] font-extrabold tracking-[-0.3px] select-none hover:opacity-90 cursor-pointer"
            >
              MyRent
            </button>
            <div className="w-[1px] h-[16px] bg-[#E2E8F0] hidden xs:block" />
            <span className="text-[12px] text-[#475569] font-semibold hidden xs:inline-block">
              Daftar sebagai Penyewa UMKM
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Demo Fill Button */}
            <button
              type="button"
              onClick={handleFillDemoData}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
              title="Isi form otomatis untuk peninjauan cepat"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Isi Data Demo</span>
            </button>

            <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px]">
              <span className="text-[#475569] hidden sm:inline">Sudah punya akun?</span>
              <button
                type="button"
                onClick={onNavigateLogin}
                className="text-[#2563EB] font-bold hover:underline cursor-pointer"
              >
                Masuk di sini
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Body: 2 Kolom (Stepper Kiri + Form Kanan) */}
      <main className="w-full max-w-[1240px] flex-1 px-4 sm:px-8 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">

          {/* Kolom Kiri: Stepper & Konteks Langkah */}
          <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-4">
            <div className="text-[10px] text-[#2563EB] font-bold tracking-[1.1px] uppercase">
              PENDAFTARAN PENYEWA UMKM
            </div>

            <h1 className="text-[22px] sm:text-[24px] font-extrabold text-[#0F172A] tracking-[-0.6px] leading-[1.25]">
              {currentMeta.title}
            </h1>

            <p className="text-[12px] leading-[19px] text-[#475569]">
              {currentMeta.desc}
            </p>

            {/* Stepper Indikator Vertikal */}
            <div className="w-full flex flex-col gap-0 pt-2">
              {STEP_METAS.map((stepItem, idx) => {
                const isCompleted = currentStep > stepItem.num
                const isActive = currentStep === stepItem.num
                const isLast = idx === STEP_METAS.length - 1

                let statusLabel = 'Belum dimulai'
                if (isCompleted) statusLabel = 'Selesai'
                if (isActive) statusLabel = 'Sedang diisi'

                return (
                  <div
                    key={stepItem.num}
                    onClick={() => {
                      if (isCompleted) setCurrentStep(stepItem.num)
                    }}
                    className={`flex flex-row gap-3 items-start ${
                      isCompleted ? 'cursor-pointer group' : ''
                    }`}
                  >
                    {/* Marker Bulat & Garis Konektor */}
                    <div className="w-[24px] shrink-0 flex flex-col items-center">
                      <div
                        className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          isCompleted
                            ? 'bg-[#F0FDF4] text-[#15803D] border border-emerald-300'
                            : isActive
                            ? 'bg-[#2563EB] text-white shadow-xs'
                            : 'bg-white text-[#94A3B8] border border-[#CBD5E1]'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5 text-[#15803D]" strokeWidth={2.8} />
                        ) : (
                          stepItem.num
                        )}
                      </div>

                      {!isLast && (
                        <div
                          className={`w-[1px] h-[32px] sm:h-[36px] transition-colors ${
                            isCompleted ? 'bg-[#15803D]' : 'bg-[#E2E8F0]'
                          }`}
                        />
                      )}
                    </div>

                    {/* Deskripsi Step */}
                    <div className="flex flex-col pt-0.5 pb-2">
                      <div
                        className={`text-[12px] font-bold transition-colors ${
                          isActive
                            ? 'text-[#0F172A]'
                            : isCompleted
                            ? 'text-[#0F172A] group-hover:text-blue-600'
                            : 'text-[#64748B]'
                        }`}
                      >
                        {stepItem.name}
                      </div>
                      <div
                        className={`text-[10px] ${
                          isActive
                            ? 'text-blue-600 font-semibold'
                            : isCompleted
                            ? 'text-emerald-600'
                            : 'text-[#94A3B8]'
                        }`}
                      >
                        {statusLabel}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Box Bantuan / Keamanan */}
            <div className="mt-4 p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-[17px] text-[#475569]">
                Semua data Anda dilindungi enkripsi bank-grade dan hanya digunakan untuk kontrak sewa resmi MyRent.
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Card Form */}
          <div className="w-full flex-1 max-w-[760px] bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] shadow-xl p-5 sm:p-8 flex flex-col gap-6">

            {/* Card Header */}
            <div className="flex flex-row justify-between items-start gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold tracking-[0.9px] text-[#2563EB] uppercase">
                  LANGKAH {currentStep} DARI 5
                </span>
                <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0F172A]">
                  {currentStep === 1 && 'Identitas Akun & Kredensial'}
                  {currentStep === 2 && 'Identitas sesuai KTP'}
                  {currentStep === 3 && 'Profil UMKM & Kapasitas Daya'}
                  {currentStep === 4 && 'Alamat Operasional & Rekening Refund'}
                  {currentStep === 5 && 'Review Data & Kirim Pendaftaran'}
                </h2>
                <p className="text-[11px] sm:text-[12px] text-[#475569]">
                  {currentStep === 1 && 'Lengkapi informasi kontak dan kata sandi penanggung jawab usaha.'}
                  {currentStep === 2 && 'Pastikan NIK dan nama persis seperti di KTP Anda.'}
                  {currentStep === 3 && 'Informasi ini tampil di profil penyewa saat pemilik alat meninjau pengajuan.'}
                  {currentStep === 4 && 'Deposit dikembalikan ke rekening ini, bukan ke saldo aplikasi.'}
                  {currentStep === 5 && 'Periksa kembali seluruh data sebelum dikirim ke Admin MyRent.'}
                </p>
              </div>

              {/* Badge Status Draf */}
              <div className="shrink-0 bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#64748B] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{draftSavedAt}</span>
              </div>
            </div>

            {/* Segmented Progress Bar (5 Segmen) */}
            <div className="w-full flex flex-row gap-1.5">
              {[1, 2, 3, 4, 5].map((seg) => (
                <div
                  key={seg}
                  className={`flex-1 h-[5px] rounded-full transition-all duration-300 ${
                    seg <= currentStep ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
                  }`}
                />
              ))}
            </div>

            {/* FORM KONTEN PER LANGKAH */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleNext()
              }}
              className="flex flex-col gap-5 pt-1"
            >
              {/* ===================== LANGKAH 1: BUAT AKUN ===================== */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nama Lengkap */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Nama Lengkap Penanggung Jawab *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Budi Santoso"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                          errors.fullName ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                        } focus:outline-none focus:ring-2 transition-all`}
                      />
                      {errors.fullName && <span className="text-[10px] text-red-500">{errors.fullName}</span>}
                    </div>

                    {/* Nama Usaha / UMKM */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Nama Usaha / UMKM *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Kopi Senja Roastery"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                          errors.businessName ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                        } focus:outline-none focus:ring-2 transition-all`}
                      />
                      {errors.businessName && <span className="text-[10px] text-red-500">{errors.businessName}</span>}
                    </div>
                  </div>

                  {/* Sektor Usaha Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#475569]">
                      Sektor Usaha Utama *
                    </label>
                    <select
                      value={formData.businessSector}
                      onChange={(e) => handleInputChange('businessSector', e.target.value)}
                      className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer"
                    >
                      {SECTORS.map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email Aktif */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Email Aktif *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="nama@domain.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full bg-white text-[13px] rounded-[10px] pl-9 pr-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                            errors.email ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                          } focus:outline-none focus:ring-2 transition-all`}
                        />
                        <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.email && <span className="text-[10px] text-red-500">{errors.email}</span>}
                    </div>

                    {/* Nomor WhatsApp */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Nomor WhatsApp / Telepon *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          placeholder="0812 8899 0011"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full bg-white text-[13px] rounded-[10px] pl-9 pr-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                            errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                          } focus:outline-none focus:ring-2 transition-all`}
                        />
                        <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.phone && <span className="text-[10px] text-red-500">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Kata Sandi */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Kata Sandi *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Minimal 6 karakter"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`w-full bg-white text-[13px] rounded-[10px] pl-9 pr-9 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                            errors.password ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                          } focus:outline-none focus:ring-2 transition-all`}
                        />
                        <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <span className="text-[10px] text-red-500">{errors.password}</span>}
                    </div>

                    {/* Konfirmasi Kata Sandi */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Konfirmasi Kata Sandi *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Ulangi kata sandi"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`w-full bg-white text-[13px] rounded-[10px] pl-9 pr-9 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                            errors.confirmPassword ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                          } focus:outline-none focus:ring-2 transition-all`}
                        />
                        <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <span className="text-[10px] text-red-500">{errors.confirmPassword}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ===================== LANGKAH 2: IDENTITAS & KTP ===================== */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* NIK */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        NIK *
                      </label>
                      <input
                        type="text"
                        maxLength={16}
                        placeholder="3174 0921 8845 0003"
                        value={formData.nik}
                        onChange={(e) => handleInputChange('nik', e.target.value.replace(/\D/g, ''))}
                        className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                          errors.nik ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                        } focus:outline-none focus:ring-2 transition-all font-mono`}
                      />
                      {errors.nik && <span className="text-[10px] text-red-500">{errors.nik}</span>}
                    </div>

                    {/* Nama sesuai KTP */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Nama sesuai KTP *
                      </label>
                      <input
                        type="text"
                        placeholder="Budi Santoso"
                        value={formData.ktpName}
                        onChange={(e) => handleInputChange('ktpName', e.target.value)}
                        className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                          errors.ktpName ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                        } focus:outline-none focus:ring-2 transition-all`}
                      />
                      {errors.ktpName && <span className="text-[10px] text-red-500">{errors.ktpName}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Tempat Lahir */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Tempat Lahir *
                      </label>
                      <input
                        type="text"
                        placeholder="Jakarta"
                        value={formData.birthPlace}
                        onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                        className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                          errors.birthPlace ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                        } focus:outline-none focus:ring-2 transition-all`}
                      />
                      {errors.birthPlace && <span className="text-[10px] text-red-500">{errors.birthPlace}</span>}
                    </div>

                    {/* Tanggal Lahir */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Tanggal Lahir *
                      </label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                          errors.birthDate ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                        } focus:outline-none focus:ring-2 transition-all`}
                      />
                      {errors.birthDate && <span className="text-[10px] text-red-500">{errors.birthDate}</span>}
                    </div>
                  </div>

                  {/* Foto KTP & Selfie */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-semibold text-[#475569]">
                      Foto KTP &amp; Verifikasi Selfie *
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Box 1: Foto KTP */}
                      <div
                        onClick={() => handleMockUpload('ktpFile', 'KTP Penanggung Jawab')}
                        className={`h-[100px] rounded-[10px] border border-dashed flex flex-col items-center justify-center gap-1.5 p-3 cursor-pointer transition-all ${
                          formData.ktpFile
                            ? 'bg-blue-50/70 border-blue-400 text-blue-700'
                            : errors.ktpFile
                            ? 'bg-red-50/50 border-red-300 text-slate-600 hover:bg-slate-50'
                            : 'bg-[#F8FAFC] border-[#CBD5E1] text-slate-600 hover:bg-blue-50/40 hover:border-blue-300'
                        }`}
                      >
                        {formData.ktpFile ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-900 line-clamp-1">
                              {formData.ktpFile.name}
                            </span>
                            <span className="text-[9px] text-blue-600 font-semibold">
                              Klik untuk mengganti berkas
                            </span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-5 h-5 text-blue-600" />
                            <span className="text-[11px] font-bold text-slate-800">
                              Foto KTP Asli
                            </span>
                            <span className="text-[9px] text-[#94A3B8]">
                              JPG / PNG maks 5 MB
                            </span>
                          </>
                        )}
                      </div>

                      {/* Box 2: Selfie + KTP */}
                      <div
                        onClick={() => handleMockUpload('selfieFile', 'Selfie Bersama KTP')}
                        className={`h-[100px] rounded-[10px] border border-dashed flex flex-col items-center justify-center gap-1.5 p-3 cursor-pointer transition-all ${
                          formData.selfieFile
                            ? 'bg-blue-50/70 border-blue-400 text-blue-700'
                            : errors.selfieFile
                            ? 'bg-red-50/50 border-red-300 text-slate-600 hover:bg-slate-50'
                            : 'bg-[#F8FAFC] border-[#CBD5E1] text-slate-600 hover:bg-blue-50/40 hover:border-blue-300'
                        }`}
                      >
                        {formData.selfieFile ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-900 line-clamp-1">
                              {formData.selfieFile.name}
                            </span>
                            <span className="text-[9px] text-blue-600 font-semibold">
                              Klik untuk mengganti berkas
                            </span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-5 h-5 text-blue-600" />
                            <span className="text-[11px] font-bold text-slate-800">
                              Selfie + KTP
                            </span>
                            <span className="text-[9px] text-[#94A3B8]">
                              Wajah &amp; KTP terlihat jelas
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {(errors.ktpFile || errors.selfieFile) && (
                      <span className="text-[10px] text-red-500">
                        {errors.ktpFile || errors.selfieFile}
                      </span>
                    )}
                  </div>

                  {/* Catatan Privasi (Sesuai HTML mentah) */}
                  <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-[10px] flex items-center gap-2 text-[11px] text-[#475569]">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Data identitas akan dienkripsi dan tidak ditampilkan ke publik.</span>
                  </div>
                </div>
              )}

              {/* ===================== LANGKAH 3: PROFIL UMKM ===================== */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nama UMKM */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Nama UMKM *
                      </label>
                      <input
                        type="text"
                        placeholder="Kopi Senja Roastery"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                          errors.businessName ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                        } focus:outline-none focus:ring-2 transition-all`}
                      />
                      {errors.businessName && <span className="text-[10px] text-red-500">{errors.businessName}</span>}
                    </div>

                    {/* Kategori Usaha */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Kategori Usaha *
                      </label>
                      <select
                        value={formData.businessSector}
                        onChange={(e) => handleInputChange('businessSector', e.target.value)}
                        className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer"
                      >
                        {SECTORS.map((sec) => (
                          <option key={sec} value={sec}>
                            {sec}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Tahun Mulai Usaha */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Tahun Mulai Usaha
                      </label>
                      <input
                        type="number"
                        placeholder="2019"
                        value={formData.startYear}
                        onChange={(e) => handleInputChange('startYear', e.target.value)}
                        className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                      />
                    </div>

                    {/* NIB (opsional) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        NIB (Nomor Induk Berusaha - opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="8120 4457 9921"
                        value={formData.nib}
                        onChange={(e) => handleInputChange('nib', e.target.value)}
                        className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Daya Listrik Tempat Usaha (Pill selector sesuai HTML mentah) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-semibold text-[#475569]">
                      Daya Listrik Tempat Usaha *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {POWER_CAPACITIES.map((cap) => (
                        <button
                          key={cap}
                          type="button"
                          onClick={() => handleInputChange('powerCapacity', cap)}
                          className={`py-2 px-3 rounded-[10px] text-[12px] font-semibold border transition-all cursor-pointer text-center ${
                            formData.powerCapacity === cap
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white text-slate-700 border-[#CBD5E1] hover:border-blue-400 hover:bg-slate-50'
                          }`}
                        >
                          {cap}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-[#64748B]">
                      Daya listrik dipakai memfilter alat mesin agar sesuai kapasitas listrik toko/bengkel Anda.
                    </span>
                  </div>

                  {/* Foto Lokasi Usaha (1–2 foto) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-semibold text-[#475569]">
                      Foto Lokasi Usaha (1–2 foto) *
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Tampak Depan */}
                      <div
                        onClick={() => handleMockUpload('frontPhoto', 'Foto Tampak Depan')}
                        className={`h-[90px] rounded-[10px] border border-dashed flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-all ${
                          formData.frontPhoto
                            ? 'bg-blue-50/70 border-blue-400 text-blue-700'
                            : errors.frontPhoto
                            ? 'bg-red-50/50 border-red-300 text-slate-600'
                            : 'bg-[#F8FAFC] border-[#CBD5E1] text-slate-600 hover:bg-blue-50/40'
                        }`}
                      >
                        {formData.frontPhoto ? (
                          <>
                            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-900 line-clamp-1">
                              Tampak Depan (Diunggah)
                            </span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4 text-blue-600" />
                            <span className="text-[11px] font-bold text-slate-800">
                              Tampak Depan Toko
                            </span>
                            <span className="text-[9px] text-[#94A3B8]">Plang / etalase usaha</span>
                          </>
                        )}
                      </div>

                      {/* Area Produksi */}
                      <div
                        onClick={() => handleMockUpload('productionPhoto', 'Foto Area Produksi')}
                        className={`h-[90px] rounded-[10px] border border-dashed flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-all ${
                          formData.productionPhoto
                            ? 'bg-blue-50/70 border-blue-400 text-blue-700'
                            : 'bg-[#F8FAFC] border-[#CBD5E1] text-slate-600 hover:bg-blue-50/40'
                        }`}
                      >
                        {formData.productionPhoto ? (
                          <>
                            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-900 line-clamp-1">
                              Area Produksi (Diunggah)
                            </span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4 text-blue-600" />
                            <span className="text-[11px] font-bold text-slate-800">
                              Area Produksi (Opsional)
                            </span>
                            <span className="text-[9px] text-[#94A3B8]">Dapur / meja kerja</span>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.frontPhoto && <span className="text-[10px] text-red-500">{errors.frontPhoto}</span>}
                  </div>

                  {/* Deskripsi Singkat Usaha */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#475569]">
                      Deskripsi Singkat Usaha
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Contoh: Roastery kopi kecil dengan 2 barista, produksi 40 kg green bean per minggu dan melayani 60 cangkir/hari."
                      value={formData.businessDesc}
                      onChange={(e) => handleInputChange('businessDesc', e.target.value)}
                      className="w-full bg-white text-[13px] rounded-[10px] p-3 text-slate-800 placeholder-[#94A3B8] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ===================== LANGKAH 4: ALAMAT & REKENING ===================== */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Alamat Lengkap */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#475569]">
                      Alamat Lengkap Usaha *
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Jl. Kemang Selatan VIII No. 12, RT 03/RW 05, Bangka, Mampang Prapatan"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full bg-white text-[13px] rounded-[10px] p-3 text-slate-800 placeholder-[#94A3B8] border ${
                        errors.address ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                      } focus:outline-none focus:ring-2 transition-all resize-none`}
                    />
                    {errors.address && <span className="text-[10px] text-red-500">{errors.address}</span>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Kota / Kabupaten */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Kota / Kabupaten *
                      </label>
                      <input
                        type="text"
                        placeholder="Jakarta Selatan"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                          errors.city ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                        } focus:outline-none focus:ring-2 transition-all`}
                      />
                      {errors.city && <span className="text-[10px] text-red-500">{errors.city}</span>}
                    </div>

                    {/* Kecamatan */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Kecamatan *
                      </label>
                      <input
                        type="text"
                        placeholder="Mampang Prapatan"
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                          errors.district ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                        } focus:outline-none focus:ring-2 transition-all`}
                      />
                      {errors.district && <span className="text-[10px] text-red-500">{errors.district}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Kode Pos */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Kode Pos *
                      </label>
                      <input
                        type="text"
                        placeholder="12730"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                          errors.postalCode ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                        } focus:outline-none focus:ring-2 transition-all`}
                      />
                      {errors.postalCode && <span className="text-[10px] text-red-500">{errors.postalCode}</span>}
                    </div>

                    {/* Patokan Lokasi */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Patokan Lokasi
                      </label>
                      <input
                        type="text"
                        placeholder="Sebelah minimarket 24 jam"
                        value={formData.landmark}
                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                        className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Titik Lokasi GPS */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#475569]">
                      Titik Lokasi Usaha (GPS) *
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-[10px]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <div className="text-[12px] font-bold text-slate-900">
                            Titik terambil ({formData.gpsCoords})
                          </div>
                          <div className="text-[10px] text-[#64748B]">
                            Dipakai untuk estimasi jarak &amp; tarif kurir pengiriman alat
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRefreshGps}
                        disabled={isGpsLoading}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[11px] font-semibold text-slate-700 rounded-lg cursor-pointer transition-all shrink-0"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${isGpsLoading ? 'animate-spin' : ''}`} />
                        <span>{isGpsLoading ? 'Memindai...' : 'Perbarui GPS'}</span>
                      </button>
                    </div>
                  </div>

                  <hr className="border-slate-100 my-1" />

                  {/* Bank Refund Deposit */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#475569]">
                      Bank untuk Refund Deposit *
                    </label>
                    <select
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer"
                    >
                      {BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nomor Rekening */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Nomor Rekening *
                      </label>
                      <input
                        type="text"
                        placeholder="4471 8890 221"
                        value={formData.bankAccount}
                        onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                        className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                          errors.bankAccount ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                        } focus:outline-none focus:ring-2 transition-all font-mono`}
                      />
                      {errors.bankAccount && <span className="text-[10px] text-red-500">{errors.bankAccount}</span>}
                    </div>

                    {/* Nama Pemilik Rekening */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#475569]">
                        Nama Pemilik Rekening *
                      </label>
                      <input
                        type="text"
                        placeholder="Budi Santoso"
                        value={formData.bankAccountHolder}
                        onChange={(e) => handleInputChange('bankAccountHolder', e.target.value)}
                        className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
                          errors.bankAccountHolder ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                        } focus:outline-none focus:ring-2 transition-all`}
                      />
                      {errors.bankAccountHolder && (
                        <span className="text-[10px] text-red-500">{errors.bankAccountHolder}</span>
                      )}
                    </div>
                  </div>

                  {/* Checkbox Konfirmasi Rekening */}
                  <div className="space-y-2 pt-1">
                    <label
                      onClick={() => handleInputChange('confirmAccountOwner', !formData.confirmAccountOwner)}
                      className="flex items-start gap-2.5 cursor-pointer select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded-[4px] mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          formData.confirmAccountOwner ? 'bg-[#2563EB]' : 'border border-[#CBD5E1] bg-white'
                        }`}
                      >
                        {formData.confirmAccountOwner && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-[11px] text-[#475569] leading-tight">
                        Saya menyatakan rekening di atas milik saya sendiri dan aktif.
                      </span>
                    </label>

                    <label
                      onClick={() => handleInputChange('confirmDeduction', !formData.confirmDeduction)}
                      className="flex items-start gap-2.5 cursor-pointer select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded-[4px] mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          formData.confirmDeduction ? 'bg-[#2563EB]' : 'border border-[#CBD5E1] bg-white'
                        }`}
                      >
                        {formData.confirmDeduction && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-[11px] text-[#475569] leading-tight">
                        Saya bersedia menerima potongan denda/klaim yang disepakati dari deposit bila terjadi kerusakan unit.
                      </span>
                    </label>

                    {(errors.confirmAccountOwner || errors.confirmDeduction) && (
                      <span className="text-[10px] text-red-500 block">
                        Kedua pernyataan di atas wajib disetujui.
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* ===================== LANGKAH 5: REVIEW & KIRIM ===================== */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-2.5 text-xs text-blue-900">
                    <Info className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      Data akan langsung masuk antrean verifikasi Admin (1 × 24 jam). Klik tombol edit di tiap kartu jika ingin mengubah data.
                    </span>
                  </div>

                  {/* Ringkasan 1: Akun */}
                  <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">1. Akun &amp; Kontak</span>
                      <div className="text-[13px] font-bold text-slate-900">
                        {formData.fullName || '-'} · {formData.email || '-'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        WhatsApp: +62 {formData.phone || '-'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                      title="Edit Akun"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Ringkasan 2: Identitas KTP */}
                  <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">2. Identitas (KTP)</span>
                      <div className="text-[13px] font-bold text-slate-900">
                        NIK {formData.nik || '-'} · {formData.birthPlace || '-'}, {formData.birthDate || '-'}
                      </div>
                      <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                        <Check className="w-3 h-3" />
                        <span>Foto KTP &amp; Selfie terunggah</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                      title="Edit KTP"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Ringkasan 3: Profil UMKM */}
                  <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">3. Profil UMKM</span>
                      <div className="text-[13px] font-bold text-slate-900">
                        {formData.businessName || '-'} · {formData.businessSector}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Daya Listrik: <strong className="text-slate-800">{formData.powerCapacity}</strong> · NIB: {formData.nib || 'Tidak ada'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                      title="Edit Profil UMKM"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Ringkasan 4: Alamat & Rekening */}
                  <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">4. Alamat &amp; Rekening Refund</span>
                      <div className="text-[13px] font-bold text-slate-900">
                        {formData.address || '-'}, {formData.city || '-'} {formData.postalCode}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {formData.bankName}: <span className="font-mono font-medium text-slate-800">{formData.bankAccount}</span> (a.n. {formData.bankAccountHolder})
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                      title="Edit Alamat & Rekening"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Persetujuan Akhir */}
                  <div className="space-y-2.5 pt-2">
                    <label
                      onClick={() => handleInputChange('agreeTruth', !formData.agreeTruth)}
                      className="flex items-start gap-2.5 cursor-pointer select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded-[4px] mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          formData.agreeTruth ? 'bg-[#2563EB]' : 'border border-[#CBD5E1] bg-white'
                        }`}
                      >
                        {formData.agreeTruth && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-[11px] text-[#475569] leading-tight">
                        Saya menyatakan seluruh data dan dokumen yang dilampirkan adalah benar dan sah milik usaha saya.
                      </span>
                    </label>

                    <label
                      onClick={() => handleInputChange('agreeTerms', !formData.agreeTerms)}
                      className="flex items-start gap-2.5 cursor-pointer select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded-[4px] mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          formData.agreeTerms ? 'bg-[#2563EB]' : 'border border-[#CBD5E1] bg-white'
                        }`}
                      >
                        {formData.agreeTerms && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-[11px] text-[#475569] leading-tight">
                        Saya telah membaca serta menyetujui Ketentuan Layanan, Ketentuan Escrow Deposit, dan Kebijakan Privasi MyRent.
                      </span>
                    </label>

                    {(errors.agreeTruth || errors.agreeTerms) && (
                      <span className="text-[10px] text-red-500 block">
                        Kedua persetujuan di atas wajib dicentang sebelum mengirim pendaftaran.
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* FOOTER ACTIONS (Sesuai Tombol di Mentah) */}
              <div className="pt-4 border-t border-[#E2E8F0] flex flex-row items-center justify-between gap-3">
                {/* Tombol Kembali */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-[#475569] hover:text-[#0F172A] px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{currentStep === 1 ? 'Ke Halaman Login' : 'Kembali'}</span>
                </button>

                {/* Tombol Aksi Kanan: Simpan Draf & Lanjut */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="hidden sm:inline-flex items-center px-4 py-2.5 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[12px] font-semibold text-[#0F172A] rounded-[10px] transition-all cursor-pointer shadow-2xs"
                  >
                    Simpan Draf
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] text-white text-[12px] font-semibold rounded-[10px] transition-all shadow-xs cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengirim Data...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {currentStep === 1 && 'Lanjut ke Verifikasi KTP'}
                          {currentStep === 2 && 'Lanjut ke Profil UMKM'}
                          {currentStep === 3 && 'Lanjut ke Alamat'}
                          {currentStep === 4 && 'Lanjut ke Review'}
                          {currentStep === 5 && 'Kirim Data Verifikasi'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
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
