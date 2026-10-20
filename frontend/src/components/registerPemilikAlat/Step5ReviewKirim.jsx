import { useState } from 'react'
import { Check } from 'lucide-react'
import RegisterFormCard from './RegisterFormCard'

function ReviewSection({ label, children }) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="text-[12px] font-semibold text-[#475569]">{label}</div>
      <div className="w-full flex flex-col gap-2">{children}</div>
    </div>
  )
}

function ReviewRow({ children }) {
  return (
    <div className="w-full flex flex-row gap-2 items-start">
      <div className="w-4 h-4 shrink-0 rounded-[4px] bg-[#2563EB] flex items-center justify-center">
        <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />
      </div>
      <span className="flex-1 text-left text-[11px] leading-[17px] text-[#475569]">{children}</span>
    </div>
  )
}

export default function Step5ReviewKirim({
  formData = {},
  onChange,
  onBack,
  onNext,
  onSaveDraft,
  isSubmitting = false
}) {
  const [agreeTruth, setAgreeTruth] = useState(formData.agreeTruth ?? true)
  const [error, setError] = useState('')

  const handleValidate = () => {
    if (!agreeTruth) {
      setError('Harap centang konfirmasi kebenaran data Anda')
      alert('Harap centang pernyataan persetujuan bahwa data yang Anda berikan adalah benar.')
      return
    }
    setError('')
    onNext?.({ agreeTruth })
  }

  const displayName = formData.namaKtp || formData.namaRekening || 'Budi Santoso'
  const displayEmail = formData.email || 'halo@kopisenja.id'
  const displayPhone = formData.whatsapp || '+62 812 8899 0011'
  const displayNik = formData.nik || '3174 0921 8845 0003'
  const displayBadan = formData.badanUsaha || 'Perorangan'
  const displayNpwp = formData.npwp || '09.254.294.3-407.000'
  const displayLokasi = formData.namaLokasi || 'Lokasi Cilandak'
  const displayAlamat =
    formData.alamat ||
    'Jl. Cilandak Tengah No. 24, RT 04/RW 06, Cilandak Barat, Jakarta Selatan 12430'
  const displayBank = formData.bank || 'BCA — Bank Central Asia'
  const displayRek = formData.nomorRekening || '4471 8890 221'
  const displayRekName = formData.namaRekening || displayName

  return (
    <RegisterFormCard
      step={5}
      title="Review & kirim verifikasi"
      subtitle="Periksa kembali seluruh data sebelum dikirim ke Admin."
      backLabel="Kembali"
      nextLabel={isSubmitting ? 'Mengirim Data...' : 'Kirim Data Verifikasi'}
      onBack={onBack}
      onNext={handleValidate}
      onSaveDraft={onSaveDraft}
    >
      <div className="w-full flex flex-col gap-3.5">
        <ReviewSection label="Akun & identitas">
          <ReviewRow>
            {displayName} · {displayEmail} · {displayPhone}
          </ReviewRow>
          <ReviewRow>
            NIK {displayNik} · {displayBadan} · NPWP {displayNpwp}
          </ReviewRow>
        </ReviewSection>

        <ReviewSection label="Lokasi operasional">
          <ReviewRow>
            {displayLokasi} · {displayAlamat}
          </ReviewRow>
          <ReviewRow>
            {formData.hariOperasional || 'Senin–Sabtu'} ({formData.jamBuka || '08:00'}–{formData.jamTutup || '18:00'}) · titik GPS terambil
          </ReviewRow>
        </ReviewSection>

        <ReviewSection label="Rekening pencairan">
          <ReviewRow>
            {displayBank} · {displayRek} · a.n. {displayRekName}
          </ReviewRow>
        </ReviewSection>

        <ReviewSection label="Ringkasan kewajiban pemilik">
          <ReviewRow>
            Menjaga alat dalam kondisi layak pakai &amp; melakukan perawatan berkala.
          </ReviewRow>
          <ReviewRow>Menyetujui inspeksi BAST digital bersama penyewa.</ReviewRow>
          <ReviewRow>Bersedia menyelesaikan sengketa melalui mediasi Admin.</ReviewRow>
        </ReviewSection>

        <ReviewSection label="Persetujuan akhir">
          <button
            type="button"
            onClick={() => {
              const nextVal = !agreeTruth
              setAgreeTruth(nextVal)
              onChange?.('agreeTruth', nextVal)
              if (error) setError('')
            }}
            className="w-full flex flex-row gap-2 items-start text-left cursor-pointer"
          >
            <div
              className={`w-4 h-4 shrink-0 rounded-[4px] flex items-center justify-center transition-colors ${
                agreeTruth ? 'bg-[#2563EB]' : 'border border-[#CBD5E1] bg-white'
              }`}
            >
              {agreeTruth && <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />}
            </div>
            <span className="flex-1 text-left text-[11px] leading-[17px] text-[#475569]">
              Saya menyatakan seluruh data benar dan bersedia diverifikasi Admin.
            </span>
          </button>
          {error && <span className="text-[10px] text-red-500">{error}</span>}
        </ReviewSection>
      </div>
    </RegisterFormCard>
  )
}
