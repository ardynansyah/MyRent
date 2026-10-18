import { useState } from 'react'
import { IdCard, User, Calendar, CircleCheck, Receipt } from 'lucide-react'
import RegisterFormCard from './RegisterFormCard'
import { TextField, FieldRow, PillGroup, UploadBox } from './FormControls'

export default function Step2IdentitasKTP({ onBack, onNext, onSaveDraft }) {
  const [nik, setNik] = useState('3174 0921 8845 0003')
  const [namaKtp, setNamaKtp] = useState('Budi Santoso')
  const [tempatLahir, setTempatLahir] = useState('Jakarta')
  const [tanggalLahir, setTanggalLahir] = useState('12 April 1991')
  const [badanUsaha, setBadanUsaha] = useState('Perorangan')
  const [npwp, setNpwp] = useState('09.254.294.3-407.000')

  return (
    <RegisterFormCard
      step={2}
      title="Identitas sesuai KTP"
      subtitle="Pastikan NIK dan nama persis seperti di KTP Anda."
      backLabel="Kembali"
      nextLabel="Lanjut ke Gudang"
      onBack={onBack}
      onNext={onNext}
      onSaveDraft={onSaveDraft}
    >
      <div className="w-full flex flex-col gap-3.5">
        <FieldRow>
          <TextField label="NIK *" icon={IdCard} value={nik} onChange={setNik} />
          <TextField label="Nama sesuai KTP *" icon={User} value={namaKtp} onChange={setNamaKtp} />
        </FieldRow>

        <FieldRow>
          <TextField label="Tempat Lahir *" value={tempatLahir} onChange={setTempatLahir} />
          <TextField
            label="Tanggal Lahir *"
            icon={Calendar}
            value={tanggalLahir}
            onChange={setTanggalLahir}
          />
        </FieldRow>

        {/* Foto KTP & selfie */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">Foto KTP *</div>
          <div className="w-full flex flex-row gap-2.5">
            <UploadBox
              icon={CircleCheck}
              title="Foto KTP"
              subtitle="JPG/PNG maks 5 MB"
              uploaded
            />
            <UploadBox
              icon={CircleCheck}
              title="Selfie + KTP"
              subtitle="Wajah & KTP terlihat"
              uploaded
            />
          </div>
        </div>

        {/* Status badan usaha */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">Status badan usaha</div>
          <PillGroup
            options={['Perorangan', 'CV', 'PT']}
            value={badanUsaha}
            onChange={setBadanUsaha}
          />
        </div>

        <TextField label="NPWP (opsional)" icon={Receipt} value={npwp} onChange={setNpwp} />
      </div>
    </RegisterFormCard>
  )
}
