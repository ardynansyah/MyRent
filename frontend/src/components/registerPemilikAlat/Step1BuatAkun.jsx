import { useState } from 'react'
import { Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react'
import RegisterFormCard from './RegisterFormCard'
import { TextField, CheckItem } from './FormControls'

export default function Step1BuatAkun({
  formData = {},
  onChange,
  onBack,
  onNext,
  onSaveDraft
}) {
  const [email, setEmail] = useState(formData.email ?? 'halo@kopisenja.id')
  const [whatsapp, setWhatsapp] = useState(formData.whatsapp ?? '+62 812 8899 0011')
  const [password, setPassword] = useState(formData.password ?? '')
  const [konfirmasi, setKonfirmasi] = useState(formData.konfirmasi ?? '')
  const [showPassword, setShowPassword] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(formData.agreeTerms ?? true)
  const [agreeEscrow, setAgreeEscrow] = useState(formData.agreeEscrow ?? true)
  const [errors, setErrors] = useState({})

  const handleFieldChange = (field, value, setter) => {
    setter(value)
    onChange?.(field, value)
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateAndProceed = () => {
    const newErrors = {}

    const cleanEmail = email ? email.trim() : ''
    if (!cleanEmail) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = 'Format email tidak valid (nama@domain.com)'
    }

    const cleanWhatsapp = whatsapp ? whatsapp.replace(/\D/g, '') : ''
    if (!cleanWhatsapp) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi'
    } else if (cleanWhatsapp.length < 9) {
      newErrors.whatsapp = 'Nomor WhatsApp minimal 9 digit'
    }

    if (!password) {
      newErrors.password = 'Kata sandi wajib diisi'
    } else if (password.length < 6) {
      newErrors.password = 'Kata sandi minimal 6 karakter'
    }

    if (!konfirmasi) {
      newErrors.konfirmasi = 'Konfirmasi kata sandi wajib diisi'
    } else if (password !== konfirmasi) {
      newErrors.konfirmasi = 'Konfirmasi kata sandi tidak cocok'
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'Anda harus menyetujui Syarat & Ketentuan'
    }
    if (!agreeEscrow) {
      newErrors.agreeEscrow = 'Anda harus menyetujui kebijakan escrow'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert('Harap lengkapi semua kolom wajib di Langkah 1 dengan benar.')
      return
    }

    setErrors({})
    onNext?.({
      email: cleanEmail,
      whatsapp,
      password,
      konfirmasi,
      agreeTerms,
      agreeEscrow
    })
  }

  const passwordToggle = (isVisible, onToggle, label) => (
    <button
      type="button"
      onClick={onToggle}
      className="text-[#94A3B8] hover:text-[#475569] p-0.5 cursor-pointer transition-colors"
      title={isVisible ? `Sembunyikan ${label}` : `Tampilkan ${label}`}
    >
      {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  )

  return (
    <RegisterFormCard
      step={1}
      title="Buat akun MyRent"
      subtitle="Lengkapi informasi kontak dan kata sandi akun Anda."
      backLabel="Batal & kembali ke masuk"
      nextLabel="Lanjut ke Identitas"
      onBack={onBack}
      onNext={validateAndProceed}
      onSaveDraft={onSaveDraft}
    >
      {/* Fields */}
      <div className="w-full flex flex-col gap-3.5">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextField
            label="Email *"
            icon={Mail}
            value={email}
            onChange={(val) => handleFieldChange('email', val, setEmail)}
            error={errors.email}
            placeholder="nama@domain.com"
          />
          <TextField
            label="No. WhatsApp *"
            icon={Phone}
            value={whatsapp}
            onChange={(val) => handleFieldChange('whatsapp', val, setWhatsapp)}
            error={errors.whatsapp}
            placeholder="+62 812 8899 0011"
          />
          <TextField
            label="Kata Sandi *"
            icon={Lock}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(val) => handleFieldChange('password', val, setPassword)}
            error={errors.password}
            placeholder="••••••••"
            trailing={passwordToggle(showPassword, () => setShowPassword((v) => !v), 'kata sandi')}
          />
          <TextField
            label="Konfirmasi Kata Sandi *"
            icon={Lock}
            type={showKonfirmasi ? 'text' : 'password'}
            value={konfirmasi}
            onChange={(val) => handleFieldChange('konfirmasi', val, setKonfirmasi)}
            error={errors.konfirmasi}
            placeholder="••••••••"
            trailing={passwordToggle(showKonfirmasi, () => setShowKonfirmasi((v) => !v), 'konfirmasi')}
          />
        </div>

        {/* Persetujuan */}
        <div className="w-full flex flex-col gap-1.5 pt-1">
          <div className="text-[12px] font-semibold text-[#475569]">Persetujuan</div>
          <div className="w-full flex flex-col gap-2">
            <CheckItem
              checked={agreeTerms}
              onToggle={() => {
                const nextVal = !agreeTerms
                setAgreeTerms(nextVal)
                onChange?.('agreeTerms', nextVal)
                if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: '' }))
              }}
            >
              Saya menyetujui Syarat &amp; Ketentuan serta Kebijakan Privasi MyRent.
            </CheckItem>
            {errors.agreeTerms && <span className="text-[10px] text-red-500">{errors.agreeTerms}</span>}

            <CheckItem
              checked={agreeEscrow}
              onToggle={() => {
                const nextVal = !agreeEscrow
                setAgreeEscrow(nextVal)
                onChange?.('agreeEscrow', nextVal)
                if (errors.agreeEscrow) setErrors((prev) => ({ ...prev, agreeEscrow: '' }))
              }}
            >
              Saya menyetujui kebijakan escrow &amp; mediasi klaim kerusakan.
            </CheckItem>
            {errors.agreeEscrow && <span className="text-[10px] text-red-500">{errors.agreeEscrow}</span>}
          </div>
        </div>
      </div>
    </RegisterFormCard>
  )
}
