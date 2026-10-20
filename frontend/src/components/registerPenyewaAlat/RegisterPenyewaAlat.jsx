import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react'
import { INITIAL_FORM, getStoredDraft } from './constants'
import RegisterTopBar from './RegisterTopBar'
import VerifikasiPenyewa from './VerifikasiPenyewa'
import StepIndicator from './StepIndicator'
import Step1BuatAkun from './Step1BuatAkun'
import Step2IdentitasKTP from './Step2IdentitasKTP'
import Step3ProfilUMKM from './Step3ProfilUMKM'
import Step4AlamatRekening from './Step4AlamatRekening'
import Step5ReviewKirim from './Step5ReviewKirim'

const STORAGE_KEY_STEP = 'myrent_register_penyewa_step'
const STORAGE_KEY_FORM = 'myrent_register_penyewa_form'

const STEP_HEADER_TITLES = {
  1: {
    title: 'Identitas Akun & Kredensial',
    desc: 'Lengkapi informasi kontak dan kata sandi penanggung jawab usaha.'
  },
  2: {
    title: 'Identitas sesuai KTP',
    desc: 'Pastikan NIK dan nama persis seperti di KTP Anda.'
  },
  3: {
    title: 'Profil UMKM & Kapasitas Daya',
    desc: 'Informasi ini tampil di profil penyewa saat pemilik alat meninjau pengajuan.'
  },
  4: {
    title: 'Alamat Operasional & Rekening Refund',
    desc: 'Deposit dikembalikan ke rekening ini, bukan ke saldo aplikasi.'
  },
  5: {
    title: 'Review Data & Kirim Pendaftaran',
    desc: 'Periksa kembali seluruh data sebelum dikirim ke Admin MyRent.'
  }
}

export default function RegisterPenyewaAlat({
  onNavigateLogin,
  onBackToLogin,
  onRegisterSuccess,
  onFinish
}) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const handleBack = onBackToLogin || onNavigateLogin || (() => navigate('/login'))
  const handleFinish = onFinish || onRegisterSuccess

  // 1. Lazy initialization currentStep dari URL (?step=X) atau sessionStorage (default: 1)
  const [currentStep, setCurrentStep] = useState(() => {
    const stepQuery = parseInt(searchParams.get('step'), 10)
    if (stepQuery >= 1 && stepQuery <= 5) {
      return stepQuery
    }
    try {
      const savedStep = sessionStorage.getItem(STORAGE_KEY_STEP)
      if (savedStep) {
        const parsed = parseInt(savedStep, 10)
        if (parsed >= 1 && parsed <= 5) return parsed
      }
    } catch (e) {
      console.warn('Gagal membaca step dari sessionStorage:', e)
    }
    return 1
  })

  // 2. Lazy initialization formData dari sessionStorage atau localStorage draft (default: INITIAL_FORM)
  const [formData, setFormData] = useState(() => {
    try {
      const savedForm = sessionStorage.getItem(STORAGE_KEY_FORM)
      if (savedForm) {
        return { ...INITIAL_FORM, ...JSON.parse(savedForm) }
      }
    } catch (e) {
      console.warn('Gagal membaca formData dari sessionStorage:', e)
    }
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

  // Membersihkan data sesi form saat submit berhasil atau pendaftaran dibatalkan
  const clearRegistrationSession = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY_STEP)
      sessionStorage.removeItem(STORAGE_KEY_FORM)
      localStorage.removeItem('myrent_register_penyewa_draft')
    } catch (e) {
      console.warn('Gagal menghapus session form:', e)
    }
  }

  // Sinkronisasi otomatis currentStep ke sessionStorage dan URL Search Params
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_STEP, String(currentStep))
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('step', String(currentStep))
          return next
        },
        { replace: true }
      )
    } catch (e) {
      console.warn('Gagal menyimpan step ke sessionStorage:', e)
    }
  }, [currentStep, setSearchParams])

  // Sinkronisasi otomatis formData ke sessionStorage setiap kali ada input berubah
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(formData))
    } catch (e) {
      console.warn('Gagal menyimpan formData ke sessionStorage:', e)
    }
  }, [formData])

  const showToast = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3500)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      // Otomatis isi Nama Pemilik Rekening & FullName jika masih kosong saat nama KTP diketik
      if (field === 'ktpName') {
        if (!prev.fullName) updated.fullName = value
        if (!prev.bankAccountHolder) updated.bankAccountHolder = value
      }
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
    if (formData[field]) {
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
      customSector: '',
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
      customPower: '',
      isManualPower: false,
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

  const handleSubmitFinal = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'PENYEWA',
          fullName: formData.fullName || formData.ktpName || formData.businessName || 'Penyewa UMKM',
          phone: formData.phone,
          businessName: formData.businessName,
          ktpName: formData.ktpName,
          nik: formData.nik,
          birthPlace: formData.birthPlace,
          birthDate: formData.birthDate,
          // Mock upload files
          ktpFile: formData.ktpFile?.name || 'ktp_penyewa.jpg',
          selfieFile: formData.selfieFile?.name || 'selfie_penyewa.jpg',
          frontPhoto: formData.frontPhoto?.name || 'toko_depan.jpg',
          productionPhoto: formData.productionPhoto?.name || 'area_produksi.jpg'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.error?.message || 'Pendaftaran gagal diproses oleh server'
        throw new Error(errorMsg)
      }

      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      showToast('Pendaftaran berhasil! Akun Anda siap diverifikasi.')
      setIsSubmitting(false)
      setIsSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setIsSubmitting(false)
      showToast(err.message || 'Gagal mengirim pendaftaran')
      alert(`Pendaftaran Gagal: ${err.message}`)
    }
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
    } else {
      // Bersihkan session storage pendaftaran saat user memilih batal & kembali
      clearRegistrationSession()
      if (handleBack) {
        handleBack()
      } else {
        navigate('/login')
      }
    }
  }

  // Tampilan Halaman Verifikasi Admin (Peninjauan Registrasi)
  if (isSubmitted) {
    return (
      <VerifikasiPenyewa
        formData={formData}
        onFinish={() => {
          clearRegistrationSession()
          if (handleFinish) {
            handleFinish({
              email: formData.email,
              fullName: formData.fullName || formData.ktpName || 'Penyewa UMKM',
              businessName: formData.businessName,
              role: 'penyewa'
            })
          } else {
            navigate('/dashboard')
          }
        }}
        onEditData={() => {
          setIsSubmitted(false)
          setCurrentStep(1)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onBackToHome={() => navigate('/')}
        onBackToLogin={handleBack}
      />
    )
  }

  const stepMeta = STEP_HEADER_TITLES[currentStep] || STEP_HEADER_TITLES[1]

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-between items-center text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Toast Notifikasi */}
      {notification && (
        <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-medium border border-slate-700/60 animate-in fade-in slide-in-from-top-4 duration-300 max-w-[90vw]">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <RegisterTopBar
        roleTitle="Daftar sebagai Penyewa UMKM"
        onBackToLogin={handleBack}
        onBackToHome={() => navigate('/')}
        onFillDemoData={handleFillDemoData}
      />

      {/* Body: 2 Kolom (Stepper Kiri + Form Kanan) */}
      <main className="w-full max-w-[1240px] flex-1 px-4 sm:px-8 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
          {/* Kolom Kiri: Sidebar Stepper (Disembunyikan di Mobile < lg, Muncul di Desktop >= lg) */}
          <StepIndicator currentStep={currentStep} onSelectStep={setCurrentStep} />

          {/* Kolom Kanan: Card Form */}
          <div className="w-full flex-1 max-w-[760px] bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-8 flex flex-col gap-6">
            {/* Card Header */}
            <div className="flex flex-row justify-between items-start gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold tracking-[0.9px] text-blue-600 uppercase">
                  LANGKAH {currentStep} DARI 5
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {stepMeta.title}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  {stepMeta.desc}
                </p>
              </div>

              {/* Badge Status Draf */}
              <div className="shrink-0 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-500 flex items-center gap-1.5">
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
                    seg <= currentStep ? 'bg-blue-600' : 'bg-slate-200'
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
              {currentStep === 1 && (
                <Step1BuatAkun
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                />
              )}

              {currentStep === 2 && (
                <Step2IdentitasKTP
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  handleMockUpload={handleMockUpload}
                />
              )}

              {currentStep === 3 && (
                <Step3ProfilUMKM
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  handleMockUpload={handleMockUpload}
                />
              )}

              {currentStep === 4 && (
                <Step4AlamatRekening
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  handleRefreshGps={handleRefreshGps}
                  isGpsLoading={isGpsLoading}
                />
              )}

              {currentStep === 5 && (
                <Step5ReviewKirim
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  onJumpToStep={setCurrentStep}
                />
              )}

              {/* FOOTER ACTIONS */}
              <div className="pt-4 border-t border-slate-200 flex flex-row items-center justify-between gap-3">
                {/* Tombol Kembali */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{currentStep === 1 ? 'Ke Halaman Login' : 'Kembali'}</span>
                </button>

                {/* Tombol Aksi Kanan: Simpan Draf & Lanjut */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="hidden sm:inline-flex items-center px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 rounded-[10px] transition-all cursor-pointer shadow-2xs"
                  >
                    Simpan Draf
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-semibold rounded-[10px] transition-all shadow-xs cursor-pointer"
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
      <footer className="w-full py-4 text-center text-[11px] text-slate-400">
        © 2026 MyRent. Platform Sewa Alat Terverifikasi untuk UMKM Indonesia.
      </footer>
    </div>
  )
}
