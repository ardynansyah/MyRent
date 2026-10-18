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

export default function Step5ReviewKirim({ onBack, onNext, onSaveDraft }) {
  return (
    <RegisterFormCard
      step={5}
      title="Review & kirim verifikasi"
      subtitle="Periksa kembali seluruh data sebelum dikirim ke Admin."
      backLabel="Kembali"
      nextLabel="Kirim Data Verifikasi"
      onBack={onBack}
      onNext={onNext}
      onSaveDraft={onSaveDraft}
    >
      <div className="w-full flex flex-col gap-3.5">
        <ReviewSection label="Akun & identitas">
          <ReviewRow>
            Kopi Senja Roastery · Budi Santoso · halo@kopisenja.id · +62 812 8899 0011
          </ReviewRow>
          <ReviewRow>NIK 3174 0921 8845 0003 · Perorangan · NPWP 09.254.294.3-407.000</ReviewRow>
        </ReviewSection>

        <ReviewSection label="Gudang & operasional">
          <ReviewRow>
            Gudang Cilandak · Jl. Cilandak Tengah No. 24, Jakarta Selatan 12430
          </ReviewRow>
          <ReviewRow>Senin–Jumat 08:00–18:00 · titik GPS terambil</ReviewRow>
        </ReviewSection>

        <ReviewSection label="Rekening pencairan">
          <ReviewRow>BCA 4471 8890 221 · a.n. Budi Santoso · Kopi Senja Roastery</ReviewRow>
        </ReviewSection>

        <ReviewSection label="Ringkasan kewajiban pemilik">
          <ReviewRow>
            Menjaga alat dalam kondisi layak pakai & melakukan perawatan berkala.
          </ReviewRow>
          <ReviewRow>Menyetujui inspeksi BAST digital bersama penyewa.</ReviewRow>
          <ReviewRow>Bersedia menyelesaikan sengketa melalui mediasi Admin.</ReviewRow>
        </ReviewSection>

        <ReviewSection label="Persetujuan akhir">
          <ReviewRow>Saya menyatakan seluruh data benar dan bersedia diverifikasi Admin.</ReviewRow>
        </ReviewSection>
      </div>
    </RegisterFormCard>
  )
}
