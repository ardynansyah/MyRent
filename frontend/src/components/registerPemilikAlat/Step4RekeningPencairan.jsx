import { useState } from 'react'
import { User, CreditCard, CircleCheck, ImagePlus } from 'lucide-react'
import RegisterFormCard from './RegisterFormCard'
import { TextField, FieldRow, SelectField, PillGroup, UploadBox, CheckItem } from './FormControls'

const BANK_OPTIONS = [
  'BCA — Bank Central Asia',
  'Mandiri — Bank Mandiri',
  'BNI — Bank Negara Indonesia',
  'BRI — Bank Rakyat Indonesia'
]

export default function Step4RekeningPencairan({ onBack, onNext, onSaveDraft }) {
  const [bank, setBank] = useState(BANK_OPTIONS[0])
  const [nomorRekening, setNomorRekening] = useState('4471 8890 221')
  const [namaRekening, setNamaRekening] = useState('Budi Santoso')
  const [namaCabang, setNamaCabang] = useState('KCP Cilandak')
  const [namaUsaha, setNamaUsaha] = useState('Kopi Senja Roastery')
  const [metode, setMetode] = useState('Transfer bank')
  const [konfirmasiKepemilikan, setKonfirmasiKepemilikan] = useState(true)
  const [konfirmasiKomisi, setKonfirmasiKomisi] = useState(true)

  return (
    <RegisterFormCard
      step={4}
      title="Rekening pencairan dana"
      subtitle="Nama pemilik rekening wajib sama dengan nama sesuai KTP."
      backLabel="Kembali"
      nextLabel="Lanjut ke Review"
      onBack={onBack}
      onNext={onNext}
      onSaveDraft={onSaveDraft}
    >
      <div className="w-full flex flex-col gap-3.5">
        <SelectField
          label="Bank tujuan pencairan *"
          value={bank}
          onChange={setBank}
          options={BANK_OPTIONS}
        />

        <FieldRow>
          <TextField
            label="Nomor Rekening *"
            icon={CreditCard}
            value={nomorRekening}
            onChange={setNomorRekening}
          />
          <TextField
            label="Nama Pemilik Rekening *"
            icon={User}
            value={namaRekening}
            onChange={setNamaRekening}
          />
        </FieldRow>

        <FieldRow>
          <TextField
            label="Nama Cabang (opsional)"
            value={namaCabang}
            onChange={setNamaCabang}
          />
          <TextField
            label="Nama Usaha di Rekening"
            value={namaUsaha}
            onChange={setNamaUsaha}
          />
        </FieldRow>

        {/* Metode pencairan */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">Metode pencairan</div>
          <PillGroup
            options={['Transfer bank', 'E-wallet']}
            value={metode}
            onChange={setMetode}
          />
        </div>

        {/* Unggah buku tabungan */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">
            Unggah buku tabungan / e-statement *
          </div>
          <div className="w-full flex flex-row gap-2.5">
            <UploadBox
              icon={CircleCheck}
              title="Halaman Depan Buku"
              subtitle="Nama & nomor terlihat"
              uploaded
            />
            <UploadBox icon={ImagePlus} title="E-statement" subtitle="3 bulan terakhir" />
          </div>
        </div>

        {/* Konfirmasi */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">Konfirmasi</div>
          <div className="w-full flex flex-col gap-2">
            <CheckItem
              checked={konfirmasiKepemilikan}
              onToggle={() => setKonfirmasiKepemilikan((v) => !v)}
            >
              Rekening atas nama saya sendiri dan aktif.
            </CheckItem>
            <CheckItem
              checked={konfirmasiKomisi}
              onToggle={() => setKonfirmasiKomisi((v) => !v)}
            >
              Saya menyetujui pencairan dana sewa dipotong komisi platform 5%.
            </CheckItem>
          </div>
        </div>
      </div>
    </RegisterFormCard>
  )
}
