import { useState } from 'react'
import { IdCard, User, Calendar, CircleCheck, Receipt } from 'lucide-react'
import RegisterFormCard from './RegisterFormCard'
import { TextField, FieldRow, PillGroup, UploadBox } from './FormControls'

export default function Step2IdentitasKTP({
  formData = {},
  onChange,
  onBack,
  onNext,
  onSaveDraft
}) {
  const [nik, setNik] = useState(formData.nik ?? '3174 0921 8845 0003')
  const [namaKtp, setNamaKtp] = useState(formData.namaKtp ?? 'Budi Santoso')
  const [tempatLahir, setTempatLahir] = useState(formData.tempatLahir ?? 'Jakarta')
  const [tanggalLahir, setTanggalLahir] = useState(formData.tanggalLahir ?? '1991-04-12')
  const [badanUsaha, setBadanUsaha] = useState(formData.badanUsaha ?? 'Perorangan')
  const [npwp, setNpwp] = useState(formData.npwp ?? '09.254.294.3-407.000')
  const [ktpUploaded, setKtpUploaded] = useState(true)
  const [selfieUploaded, setSelfieUploaded] = useState(true)
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

    const cleanNik = nik ? nik.replace(/\D/g, '') : ''
    if (!cleanNik) {
      newErrors.nik = 'NIK wajib diisi'
    } else if (cleanNik.length !== 16) {
      newErrors.nik = 'NIK harus tepat 16 digit angka'
    }

    if (!namaKtp || !namaKtp.trim()) {
      newErrors.namaKtp = 'Nama sesuai KTP wajib diisi'
    }

    if (!tempatLahir || !tempatLahir.trim()) {
      newErrors.tempatLahir = 'Tempat lahir wajib diisi'
    }

    if (!tanggalLahir || !tanggalLahir.trim()) {
      newErrors.tanggalLahir = 'Tanggal lahir wajib diisi'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert('Harap lengkapi seluruh kolom identitas KTP yang wajib diisi.')
      return
    }

    setErrors({})
    onNext?.({
      nik: cleanNik,
      namaKtp: namaKtp.trim(),
      tempatLahir: tempatLahir.trim(),
      tanggalLahir,
      badanUsaha,
      npwp: npwp.trim(),
      ktpFile: ktpUploaded ? 'ktp_pemilik.jpg' : null,
      selfieFile: selfieUploaded ? 'selfie_pemilik.jpg' : null
    })
  }

  return (
    <RegisterFormCard
      step={2}
      title="Identitas sesuai KTP"
      subtitle="Pastikan NIK dan nama persis seperti di KTP Anda."
      backLabel="Kembali"
      nextLabel="Lanjut ke Lokasi Operasional"
      onBack={onBack}
      onNext={validateAndProceed}
      onSaveDraft={onSaveDraft}
    >
      <div className="w-full flex flex-col gap-3.5">
        <FieldRow>
          <TextField
            label="NIK *"
            icon={IdCard}
            value={nik}
            onChange={(val) => handleFieldChange('nik', val, setNik)}
            error={errors.nik}
            placeholder="3174 0921 8845 0003"
            inputClassName="font-mono tabular-nums tracking-wide"
          />
          <TextField
            label="Nama sesuai KTP *"
            icon={User}
            value={namaKtp}
            onChange={(val) => handleFieldChange('namaKtp', val, setNamaKtp)}
            error={errors.namaKtp}
            placeholder="Budi Santoso"
          />
        </FieldRow>

        <FieldRow>
          <TextField
            label="Tempat Lahir *"
            value={tempatLahir}
            onChange={(val) => handleFieldChange('tempatLahir', val, setTempatLahir)}
            error={errors.tempatLahir}
            placeholder="Jakarta"
          />
          <TextField
            label="Tanggal Lahir *"
            icon={Calendar}
            type="text"
            value={tanggalLahir}
            onChange={(val) => handleFieldChange('tanggalLahir', val, setTanggalLahir)}
            error={errors.tanggalLahir}
            placeholder="YYYY-MM-DD atau DD Bulan YYYY"
          />
        </FieldRow>

        {/* Foto KTP & selfie */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">Foto KTP &amp; Selfie *</div>
          <div className="w-full flex flex-row gap-2.5">
            <UploadBox
              icon={CircleCheck}
              title="Foto KTP"
              subtitle={ktpUploaded ? 'Sudah diunggah' : 'Klik untuk unggah'}
              uploaded={ktpUploaded}
              onClick={() => setKtpUploaded((prev) => !prev)}
            />
            <UploadBox
              icon={CircleCheck}
              title="Selfie + KTP"
              subtitle={selfieUploaded ? 'Sudah diunggah' : 'Klik untuk unggah'}
              uploaded={selfieUploaded}
              onClick={() => setSelfieUploaded((prev) => !prev)}
            />
          </div>
        </div>

        {/* Status badan usaha */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">Status badan usaha</div>
          <PillGroup
            options={['Perorangan', 'CV', 'PT']}
            value={badanUsaha}
            onChange={(val) => handleFieldChange('badanUsaha', val, setBadanUsaha)}
          />
        </div>

        <TextField
          label="NPWP (opsional)"
          icon={Receipt}
          value={npwp}
          onChange={(val) => handleFieldChange('npwp', val, setNpwp)}
          placeholder="09.254.294.3-407.000"
          inputClassName="font-mono tabular-nums tracking-wide"
        />
      </div>
    </RegisterFormCard>
  )
}
