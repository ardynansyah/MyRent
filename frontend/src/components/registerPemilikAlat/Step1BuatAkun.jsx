import { useState } from 'react'
import { Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react'
import RegisterFormCard from './RegisterFormCard'
import { TextField, CheckItem } from './FormControls'

export default function Step1BuatAkun({ onBack, onNext, onSaveDraft }) {
  const [email, setEmail] = useState('halo@kopisenja.id')
  const [whatsapp, setWhatsapp] = useState('+62 812 8899 0011')
  const [password, setPassword] = useState('')
  const [konfirmasi, setKonfirmasi] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [agreeEscrow, setAgreeEscrow] = useState(true)

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
      onNext={onNext}
      onSaveDraft={onSaveDraft}
    >
      {/* Fields */}
      <div className="w-full flex flex-col gap-3.5">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <TextField label="Email *" icon={Mail} value={email} onChange={setEmail} />
          <TextField label="No. WhatsApp *" icon={Phone} value={whatsapp} onChange={setWhatsapp} />
          <TextField
            label="Kata Sandi *"
            icon={Lock}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            trailing={passwordToggle(showPassword, () => setShowPassword((v) => !v), 'kata sandi')}
          />
          <TextField
            label="Konfirmasi Kata Sandi *"
            icon={Lock}
            type={showKonfirmasi ? 'text' : 'password'}
            value={konfirmasi}
            onChange={setKonfirmasi}
            placeholder="••••••••"
            trailing={passwordToggle(showKonfirmasi, () => setShowKonfirmasi((v) => !v), 'konfirmasi')}
          />
        </div>

        {/* Persetujuan */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">Persetujuan</div>
          <div className="w-full flex flex-col gap-2">
            <CheckItem checked={agreeTerms} onToggle={() => setAgreeTerms((v) => !v)}>
              Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi MyRent.
            </CheckItem>
            <CheckItem checked={agreeEscrow} onToggle={() => setAgreeEscrow((v) => !v)}>
              Saya menyetujui kebijakan escrow & mediasi klaim kerusakan.
            </CheckItem>
          </div>
        </div>
      </div>
    </RegisterFormCard>
  )
}
