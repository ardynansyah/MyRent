import { ShieldCheck, Camera, MapPin, Wallet, AlarmClock, Check } from 'lucide-react'

const STEPS = [
  { id: 1, name: 'Buat Akun' },
  { id: 2, name: 'Identitas & KTP' },
  { id: 3, name: 'Lokasi Operasional' },
  { id: 4, name: 'Rekening Pencairan' },
  { id: 5, name: 'Review & Kirim' }
]

const STEP_META = {
  1: {
    title: ['Sewakan alat,', 'tambah penghasilan.'],
    desc: 'Daftarkan toko atau lokasi usaha Anda dan terima permintaan sewa dari UMKM terverifikasi di sekitar lokasi Anda.'
  },
  2: {
    title: ['Verifikasi identitas pemilik alat.'],
    desc: 'Identitas pemilik dipakai pada kontrak sewa dan pencairan dana ke rekening bank Anda.'
  },
  3: {
    title: ['Lokasi operasional & jam pengambilan.'],
    desc: 'Penyewa akan melihat alamat lokasi operasional dan estimasi jarak, jadi pastikan titik lokasi tepat.'
  },
  4: {
    title: ['Rekening untuk mencairkan dana.'],
    desc: 'Dana sewa yang sudah lepas dari escrow akan ditransfer ke rekening ini maksimal 1 × 24 jam kerja.'
  },
  5: {
    title: ['Review data, lalu kirim verifikasi.'],
    desc: 'Admin meninjau pengajuan Anda dalam 1 × 24 jam. Setelah disetujui, Anda bisa langsung memasang alat pertama.'
  }
}

const STEP_TIPS = {
  1: {
    icon: ShieldCheck,
    title: 'Kenapa penyewa harus KYC?',
    body: 'Kami memverifikasi penyewa lebih dulu sehingga risiko alat tidak kembali atau rusak jauh lebih kecil.'
  },
  2: {
    icon: Camera,
    title: 'Foto yang diterima',
    body: 'KTP terlihat utuh & tidak terpotong. Selfie memegang KTP dengan wajah jelas dan pencahayaan cukup.'
  },
  3: {
    icon: MapPin,
    title: 'Tips titik lokasi',
    body: 'Ambil GPS saat berada di lokasi usaha agar estimasi jarak dan tarif kurir akurat untuk penyewa.'
  },
  4: {
    icon: Wallet,
    title: 'Tanpa biaya transfer',
    body: 'Pencairan ke rekening bank tidak dikenakan biaya. Minimal penarikan Rp 100.000.'
  },
  5: {
    icon: AlarmClock,
    title: 'Setelah ini apa?',
    body: 'Setelah KYC disetujui, Anda diarahkan ke form Tambah Alat untuk memasang alat pertama.'
  }
}

const STATUS_LABELS = { done: 'Selesai', active: 'Sedang diisi', todo: 'Belum dimulai' }

export default function RegisterStepper({ currentStep }) {
  const meta = STEP_META[currentStep]
  const tip = STEP_TIPS[currentStep]
  const TipIcon = tip.icon

  return (
    <aside className="hidden lg:flex w-[300px] shrink-0 flex-col gap-4 pt-1">
      <div className="text-[10px] font-bold tracking-[1.1px] text-blue-600 whitespace-nowrap">
        PENDAFTARAN PEMILIK ALAT
      </div>

      <div className="text-2xl leading-[30px] font-extrabold tracking-[-0.6px] text-slate-900">
        {meta.title.map((line, index) => (
          <span key={line}>
            {line}
            {index < meta.title.length - 1 && <br />}
          </span>
        ))}
      </div>

      <p className="text-xs leading-[19px] text-slate-600">{meta.desc}</p>

      {/* Daftar langkah dengan status dinamis */}
      <div className="w-full flex flex-col pt-2">
        {STEPS.map((step, index) => {
          const status =
            step.id < currentStep ? 'done' : step.id === currentStep ? 'active' : 'todo'

          return (
            <div key={step.id} className="w-full flex flex-row gap-[11px] items-start">
              {/* Marker: dot + garis penghubung */}
              <div className="w-6 shrink-0 flex flex-col items-center gap-1">
                {status === 'done' ? (
                  <div className="w-6 h-6 shrink-0 rounded-full bg-green-50 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-700" strokeWidth={2.6} />
                  </div>
                ) : (
                  <div
                    className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center ${
                      status === 'active' ? 'bg-blue-600' : 'bg-white border border-slate-200'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-bold ${
                        status === 'active' ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {step.id}
                    </span>
                  </div>
                )}

                {index < STEPS.length - 1 && (
                  <div
                    className={`w-px h-7 shrink-0 ${
                      status === 'done' ? 'bg-green-700' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>

              {/* Nama langkah + status */}
              <div className="flex flex-col gap-px pt-0.5 pb-4">
                <span
                  className={`text-xs whitespace-nowrap ${
                    status === 'todo'
                      ? 'font-medium text-slate-600'
                      : 'font-bold text-slate-900'
                  }`}
                >
                  {step.name}
                </span>
                <span
                  className={`text-[10px] whitespace-nowrap ${
                    status === 'active' ? 'text-blue-600' : 'text-slate-400'
                  }`}
                >
                  {STATUS_LABELS[status]}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Kotak tips kontekstual per langkah */}
      <div className="w-full flex flex-col gap-[7px] p-3.5 bg-blue-50 rounded-xl">
        <div className="flex flex-row items-center gap-[7px]">
          <TipIcon className="w-[13px] h-[13px] text-blue-700 shrink-0" strokeWidth={2.2} />
          <span className="text-[11px] font-bold text-blue-700 whitespace-nowrap">{tip.title}</span>
        </div>
        <p className="text-[10px] leading-4 text-blue-700">{tip.body}</p>
      </div>
    </aside>
  )
}
