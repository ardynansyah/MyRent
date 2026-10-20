import React, { useEffect, useState } from 'react'
import { PencilLine, X, Check, Send, Info } from 'lucide-react'
import { ALASAN_PERBAIKAN, STEP_TEMPLATE_PENYEWA } from './adminDashboardData'

const BATAS_PESAN = 500

/**
 * Modal "Minta perbaikan" — alur revisi, bukan penolakan.
 *
 * Admin menandai satu atau beberapa step yang bermasalah (multi-select),
 * lalu mengirim catatan ke pengaju. Status pengajuan berubah menjadi
 * "Perlu perbaikan" sehingga pengaju masih bisa memperbaiki karyanya.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - modal tampil atau tidak
 * @param {function} props.onClose - penutup modal
 * @param {function} props.onSubmit - callback saat permintaan dikirim
 * @param {string} props.idPengajuan - nomor pengajuan (mis. VR-2041)
 * @param {string} props.namaPengajuan - nama pemohon
 * @param {string} props.tipePengajuan - tipe akun pemohon
 * @param {array} props.langkah - daftar step registrasi (1–5) dari data pengajuan
 */
export default function ModalMintaPerbaikan({
  isOpen,
  onClose,
  onSubmit,
  idPengajuan = '',
  namaPengajuan = '',
  tipePengajuan = '',
  langkah = STEP_TEMPLATE_PENYEWA
}) {
  const [selectedSteps, setSelectedSteps] = useState([])
  const [alasanCepat, setAlasanCepat] = useState('')
  const [pesan, setPesan] = useState('')

  // Reset state setiap kali modal dibuka ulang (pola "adjust state saat props berubah").
  const [terbukaSebelumnya, setTerbukaSebelumnya] = useState(isOpen)
  if (isOpen !== terbukaSebelumnya) {
    setTerbukaSebelumnya(isOpen)
    if (isOpen) {
      setSelectedSteps([])
      setAlasanCepat('')
      setPesan('')
    }
  }

  // Tutup modal dengan tombol Escape.
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && onClose) onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const toggleStep = (nomor) => {
    setSelectedSteps((prev) =>
      prev.includes(nomor) ? prev.filter((item) => item !== nomor) : [...prev, nomor].sort((a, b) => a - b)
    )
  }

  const pilihSemua = () => {
    setSelectedSteps((prev) =>
      prev.length === langkah.length ? [] : langkah.map((item) => item.nomor)
    )
  }

  const stepsTerpilih = langkah.filter((item) => selectedSteps.includes(item.nomor))

  const bisaKirim = selectedSteps.length > 0 && pesan.trim().length > 0

  const handleKirim = () => {
    if (!bisaKirim) return

    if (onSubmit) {
      onSubmit({
        idPengajuan,
        steps: selectedSteps,
        judulSteps: stepsTerpilih.map((item) => item.judul),
        alasan: alasanCepat,
        pesan: pesan.trim()
      })
    }
    if (onClose) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Minta perbaikan pengajuan"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose()
      }}
    >
      <div className="flex w-full max-w-[600px] flex-col gap-5 rounded-lg border border-border bg-background p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 shrink-0 rounded-[10px] bg-primary/10 flex items-center justify-center">
            <PencilLine className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h2 className="text-xl font-extrabold tracking-[-0.3px] text-foreground">
              Minta perbaikan · #{idPengajuan}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {namaPengajuan} · {tipePengajuan}. Pengaju menerima email berisi step yang perlu
              diperbaiki, dan pengajuan tetap bisa dilanjutkan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-5 h-5 shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step yang perlu diperbaiki (multi-select) */}
        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-foreground">Step yang perlu diperbaiki</span>
            <button
              type="button"
              onClick={pilihSemua}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              {selectedSteps.length === langkah.length ? 'Hapus semua' : 'Pilih semua'}
            </button>
          </div>

          {/* Daftar checkbox (vertical list, tanpa kartu berat) */}
          <div className="flex w-full flex-col gap-2">
            {langkah.map((item) => {
              const isSelected = selectedSteps.includes(item.nomor)

              return (
                <label
                  key={item.nomor}
                  className="w-full flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="relative w-4 h-4 shrink-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleStep(item.nomor)}
                      className="peer absolute inset-0 m-0 size-4 appearance-none rounded-full border border-primary cursor-pointer checked:bg-primary checked:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    />
                    <Check className="pointer-events-none absolute inset-0 m-auto w-2.5 h-2.5 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100" />
                  </span>

                  <span className="flex-1 flex flex-col gap-0.5 min-w-0">
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      Step {item.nomor} · {item.judul}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.sub}</span>
                  </span>
                </label>
              )
            })}
          </div>

          {selectedSteps.length === 0 ? (
            <p className="text-xs text-muted-foreground">Pilih minimal satu step yang perlu diperbaiki.</p>
          ) : null}
        </div>

        {/* Catatan untuk pengaju */}
        <div className="w-full flex flex-col gap-3">
          <span className="text-sm font-bold text-foreground">Catatan untuk pengaju</span>

          <div className="w-full flex flex-wrap gap-2">
            {ALASAN_PERBAIKAN.map((alasan) => {
              const isSelected = alasan === alasanCepat

              return (
                <button
                  key={alasan}
                  type="button"
                  onClick={() => {
                    setAlasanCepat(alasan)
                    if (!pesan) setPesan(`${alasan}. Mohon lengkapi data pada step di atas. `)
                  }}
                  className={`h-8 cursor-pointer rounded-full px-3 text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {alasan}
                </button>
              )
            })}
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="w-full h-[104px] p-3 rounded-md bg-background border border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/40 transition-colors">
              <textarea
                value={pesan}
                onChange={(e) => setPesan(e.target.value.slice(0, BATAS_PESAN))}
                placeholder="Jelaskan apa yang perlu diperbaiki agar pengaju tahu harus mengunggah atau mengisi ulang apa..."
                className="w-full h-full resize-none bg-transparent border-none outline-none text-sm leading-6 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">Terkirim ke email pengaju</span>
              <span className="text-xs text-muted-foreground">
                {pesan.length} / {BATAS_PESAN}
              </span>
            </div>
          </div>
        </div>

        {/* Catatan alur */}
        <div className="w-full flex items-start gap-2.5 px-4 py-3 rounded-md bg-muted">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
          <p className="text-xs leading-5 text-muted-foreground">
            Status pengajuan berubah menjadi <strong className="font-semibold text-foreground">Perlu perbaikan</strong>.
            Pengaju bisa mengoreksi data lalu mengirim ulang, pengajuan tidak ditolak permanen.
          </p>
        </div>

        {/* Footer */}
        <div className="w-full flex items-center justify-between gap-3 pt-5 border-t border-border">
          <span className="text-xs text-muted-foreground">Tindakan tercatat di audit log</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleKirim}
              disabled={!bisaKirim}
              className="flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Permintaan Perbaikan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
