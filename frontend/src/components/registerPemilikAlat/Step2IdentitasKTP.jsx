import { useState } from 'react'
import { IdCard, User, Calendar, CircleCheck, Receipt } from 'lucide-react'
import RegisterFormCard from './RegisterFormCard'
import { TextField, FieldRow, PillGroup, UploadBox } from './FormControls'
import { fileToPreviewDataUrl, formatFileSize, checkUniqueness } from '../../lib/registration'

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
  const [ktpFile, setKtpFile] = useState(formData.ktpFile ?? null)
  const [selfieFile, setSelfieFile] = useState(formData.selfieFile ?? null)
  const [errors, setErrors] = useState({})

  const handleFile = async (field, setter, file) => {
    const preview = await fileToPreviewDataUrl(file)
    const value = {
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      preview: preview || null,
      lastModified: file.lastModified
    }
    setter(value)
    onChange?.(field, value)
  }

  const handleFieldChange = (field, value, setter) => {
    setter(value)
    onChange?.(field, value)
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateAndProceed = async () => {
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

    try {
      const check = await checkUniqueness({ nik: cleanNik })
      if (!check.available && check.errors?.nik) {
        setErrors((prev) => ({ ...prev, nik: check.errors.nik }))
        alert(check.errors.nik)
        return
      }
    } catch (e) {
      console.warn('Pengecekan NIK gagal:', e)
    }

    setErrors({})
    onNext?.({
      nik: cleanNik,
      namaKtp: namaKtp.trim(),
      tempatLahir: tempatLahir.trim(),
      tanggalLahir: tanggalLahir.trim(),
      badanUsaha,
      npwp: npwp.trim(),
      ktpFile,
      selfieFile
    })
  }

  const handleBlurNik = async () => {
    const cleanNik = nik ? nik.replace(/\D/g, '') : ''
    if (cleanNik.length === 16) {
      try {
        const check = await checkUniqueness({ nik: cleanNik })
        if (check.errors?.nik) setErrors((prev) => ({ ...prev, nik: check.errors.nik }))
      } catch {
        // ignore
      }
    }
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
            onBlur={handleBlurNik}
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
          <div className="text-xs font-semibold text-slate-600">Foto KTP &amp; Selfie *</div>
          <div className="w-full flex flex-row gap-2.5">
            <UploadBox
              icon={CircleCheck}
              title="Foto KTP"
              subtitle={
                ktpFile ? `${ktpFile.name} · ${formatFileSize(ktpFile.size)}` : 'Klik untuk unggah'
              }
              uploaded={Boolean(ktpFile)}
              onFileSelect={(file) => handleFile('ktpFile', setKtpFile, file)}
            />
            <UploadBox
              icon={CircleCheck}
              title="Selfie + KTP"
              subtitle={
                selfieFile
                  ? `${selfieFile.name} · ${formatFileSize(selfieFile.size)}`
                  : 'Klik untuk unggah'
              }
              uploaded={Boolean(selfieFile)}
              onFileSelect={(file) => handleFile('selfieFile', setSelfieFile, file)}
            />
          </div>
        </div>

        {/* Status badan usaha */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-xs font-semibold text-slate-600">Status badan usaha</div>
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
