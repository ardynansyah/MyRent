import { useState } from 'react'
import { User, CreditCard } from 'lucide-react'
import RegisterFormCard from './RegisterFormCard'
import { TextField, FieldRow, SelectField, CheckItem } from './FormControls'

const BANK_OPTIONS = [
  'BCA — Bank Central Asia',
  'Mandiri — Bank Mandiri',
  'BNI — Bank Negara Indonesia',
  'BRI — Bank Rakyat Indonesia'
]

export default function Step4RekeningPencairan({
  formData = {},
  onChange,
  onBack,
  onNext,
  onSaveDraft
}) {
  const [bank, setBank] = useState(formData.bank ?? BANK_OPTIONS[0])
  const [nomorRekening, setNomorRekening] = useState(formData.nomorRekening ?? '4471 8890 221')
  const [namaRekening, setNamaRekening] = useState(
    formData.namaRekening ?? formData.namaKtp ?? 'Budi Santoso'
  )
  const [konfirmasiKepemilikan, setKonfirmasiKepemilikan] = useState(
    formData.konfirmasiKepemilikan ?? true
  )
  const [konfirmasiKomisi, setKonfirmasiKomisi] = useState(formData.konfirmasiKomisi ?? true)
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

    const cleanRek = nomorRekening ? nomorRekening.replace(/\s+/g, '') : ''
    if (!cleanRek) {
      newErrors.nomorRekening = 'Nomor rekening wajib diisi'
    } else if (cleanRek.length < 5) {
      newErrors.nomorRekening = 'Nomor rekening minimal 5 digit'
    }

    if (!namaRekening || !namaRekening.trim()) {
      newErrors.namaRekening = 'Nama pemilik rekening wajib diisi'
    }

    if (!konfirmasiKepemilikan) {
      newErrors.konfirmasiKepemilikan = 'Konfirmasi kepemilikan rekening wajib dicentang'
    }

    if (!konfirmasiKomisi) {
      newErrors.konfirmasiKomisi = 'Persetujuan potongan komisi wajib dicentang'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert('Harap lengkapi nomor rekening dan setujui ketentuan pencairan.')
      return
    }

    setErrors({})
    onNext?.({
      bank,
      nomorRekening: cleanRek,
      namaRekening: namaRekening.trim(),
      konfirmasiKepemilikan,
      konfirmasiKomisi
    })
  }

  return (
    <RegisterFormCard
      step={4}
      title="Rekening pencairan dana"
      subtitle="Nama pemilik rekening wajib sama dengan nama sesuai KTP."
      backLabel="Kembali"
      nextLabel="Lanjut ke Review"
      onBack={onBack}
      onNext={validateAndProceed}
      onSaveDraft={onSaveDraft}
    >
      <div className="w-full flex flex-col gap-3.5">
        <SelectField
          label="Bank tujuan pencairan *"
          value={bank}
          onChange={(val) => handleFieldChange('bank', val, setBank)}
          options={BANK_OPTIONS}
        />

        <FieldRow>
          <TextField
            label="Nomor Rekening *"
            icon={CreditCard}
            value={nomorRekening}
            onChange={(val) => handleFieldChange('nomorRekening', val, setNomorRekening)}
            error={errors.nomorRekening}
            placeholder="Contoh: 4471 8890 221"
          />
          <TextField
            label="Nama Pemilik Rekening *"
            icon={User}
            value={namaRekening}
            onChange={(val) => handleFieldChange('namaRekening', val, setNamaRekening)}
            error={errors.namaRekening}
            placeholder="Nama lengkap sesuai buku tabungan"
          />
        </FieldRow>

        {/* Konfirmasi */}
        <div className="w-full flex flex-col gap-1.5 pt-1">
          <div className="text-xs font-semibold text-slate-600">Konfirmasi</div>
          <div className="w-full flex flex-col gap-2">
            <CheckItem
              checked={konfirmasiKepemilikan}
              onToggle={() => {
                const nextVal = !konfirmasiKepemilikan
                setKonfirmasiKepemilikan(nextVal)
                onChange?.('konfirmasiKepemilikan', nextVal)
                if (errors.konfirmasiKepemilikan) {
                  setErrors((prev) => ({ ...prev, konfirmasiKepemilikan: '' }))
                }
              }}
            >
              Rekening atas nama saya sendiri dan aktif.
            </CheckItem>
            {errors.konfirmasiKepemilikan && (
              <span className="text-[10px] text-red-500">{errors.konfirmasiKepemilikan}</span>
            )}

            <CheckItem
              checked={konfirmasiKomisi}
              onToggle={() => {
                const nextVal = !konfirmasiKomisi
                setKonfirmasiKomisi(nextVal)
                onChange?.('konfirmasiKomisi', nextVal)
                if (errors.konfirmasiKomisi) {
                  setErrors((prev) => ({ ...prev, konfirmasiKomisi: '' }))
                }
              }}
            >
              Saya menyetujui pencairan dana sewa dipotong komisi platform 5%.
            </CheckItem>
            {errors.konfirmasiKomisi && (
              <span className="text-[10px] text-red-500">{errors.konfirmasiKomisi}</span>
            )}
          </div>
        </div>
      </div>
    </RegisterFormCard>
  )
}
