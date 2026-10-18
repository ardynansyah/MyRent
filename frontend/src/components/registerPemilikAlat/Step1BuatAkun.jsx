import { useState } from 'react'
import { Store, KeyRound, Check, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react'
import RegisterFormCard from './RegisterFormCard'
import { TextField, FieldRow, CheckItem } from './FormControls'

export default function Step1BuatAkun({ onBack, onNext, onSaveDraft, onSwitchToPenyewa }) {
  const [role, setRole] = useState('pemilik') // 'penyewa' | 'pemilik'
  const [namaToko, setNamaToko] = useState('Kopi Senja Roastery')
  const [namaPemilik, setNamaPemilik] = useState('Budi Santoso')
  const [email, setEmail] = useState('halo@kopisenja.id')
  const [whatsapp, setWhatsapp] = useState('+62 812 8899 0011')
  const [password, setPassword] = useState('')
  const [konfirmasi, setKonfirmasi] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [agreeEscrow, setAgreeEscrow] = useState(true)

  const isPemilik = role === 'pemilik'

  const handlePilihPenyewa = () => {
    setRole('penyewa')
    onSwitchToPenyewa?.()
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
      subtitle="Pilih tipe akun, lalu lengkapi data diri dan kata sandi."
      backLabel="Batal & kembali ke masuk"
      nextLabel="Lanjut ke Identitas"
      onBack={onBack}
      onNext={onNext}
      onSaveDraft={onSaveDraft}
    >
      {/* Pemilih tipe akun */}
      <div className="w-full flex flex-col gap-[7px]">
        <div className="text-[9px] font-bold tracking-[0.9px] text-[#94A3B8]">DAFTAR SEBAGAI</div>

        <div className="w-full flex flex-row gap-2">
          <button
            type="button"
            onClick={handlePilihPenyewa}
            className={`flex-1 min-w-0 flex flex-row items-center gap-[9px] p-[10px_11px] rounded-[10px] text-left transition-all cursor-pointer ${
              !isPemilik
                ? 'bg-[#EFF6FF] border border-[#2563EB] ring-1 ring-[#2563EB]/20'
                : 'bg-white border border-[#E2E8F0] hover:border-slate-300'
            }`}
          >
            <div
              className={`w-[26px] h-[26px] shrink-0 rounded-[7px] flex items-center justify-center transition-colors ${
                !isPemilik ? 'bg-[#2563EB]' : 'bg-[#F8FAFC]'
              }`}
            >
              <Store
                className={`w-[14px] h-[14px] ${!isPemilik ? 'text-white' : 'text-[#94A3B8]'}`}
                strokeWidth={2}
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <span
                className={`text-[11px] truncate ${
                  !isPemilik ? 'font-bold text-[#1D4ED8]' : 'font-semibold text-[#0F172A]'
                }`}
              >
                Penyewa UMKM
              </span>
              <span className={`text-[9px] truncate ${!isPemilik ? 'text-[#1D4ED8]' : 'text-[#94A3B8]'}`}>
                Sewa alat produksi
              </span>
            </div>
            {!isPemilik && (
              <div className="w-4 h-4 shrink-0 rounded-full bg-[#2563EB] flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setRole('pemilik')}
            className={`flex-1 min-w-0 flex flex-row items-center gap-[9px] p-[10px_11px] rounded-[10px] text-left transition-all cursor-pointer ${
              isPemilik
                ? 'bg-[#EFF6FF] border border-[#2563EB] ring-1 ring-[#2563EB]/20'
                : 'bg-white border border-[#E2E8F0] hover:border-slate-300'
            }`}
          >
            <div
              className={`w-[26px] h-[26px] shrink-0 rounded-[7px] flex items-center justify-center transition-colors ${
                isPemilik ? 'bg-[#2563EB]' : 'bg-[#F8FAFC]'
              }`}
            >
              <KeyRound
                className={`w-[14px] h-[14px] ${isPemilik ? 'text-white' : 'text-[#94A3B8]'}`}
                strokeWidth={2}
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <span
                className={`text-[11px] truncate ${
                  isPemilik ? 'font-bold text-[#1D4ED8]' : 'font-semibold text-[#0F172A]'
                }`}
              >
                Pemilik Alat
              </span>
              <span className={`text-[9px] truncate ${isPemilik ? 'text-[#1D4ED8]' : 'text-[#94A3B8]'}`}>
                Sewakan alat Anda
              </span>
            </div>
            {isPemilik && (
              <div className="w-4 h-4 shrink-0 rounded-full bg-[#2563EB] flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="w-full flex flex-col gap-3.5">
        <TextField
          label="Nama Penyedia / Toko *"
          icon={Store}
          value={namaToko}
          onChange={setNamaToko}
        />

        <TextField
          label="Nama Lengkap Pemilik *"
          icon={User}
          value={namaPemilik}
          onChange={setNamaPemilik}
        />

        <FieldRow>
          <TextField label="Email *" icon={Mail} value={email} onChange={setEmail} />
          <TextField label="No. WhatsApp *" icon={Phone} value={whatsapp} onChange={setWhatsapp} />
        </FieldRow>

        <FieldRow>
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
        </FieldRow>

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
