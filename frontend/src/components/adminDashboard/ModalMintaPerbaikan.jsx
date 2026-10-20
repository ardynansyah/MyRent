import React, { useEffect, useState } from 'react'
import { PencilLine, X, Check, Send, Info } from 'lucide-react'
import { ALASAN_PERBAIKAN, LANGKAH_PENGAJUAN } from './adminDashboardData'

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
 * @param {array} props.langkah - daftar step registrasi (1–5)
 */
export default function ModalMintaPerbaikan({
  isOpen,
  onClose,
  onSubmit,
  idPengajuan = 'VR-2041',
  namaPengajuan = 'Dapur Roti Andini',
  tipePengajuan = 'Penyewa UMKM',
  langkah = LANGKAH_PENGAJUAN
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
      <div className="w-full max-w-[600px] flex flex-col gap-5 p-6 rounded-2xl bg-white shadow-[0px_18px_50px_#0F172A55]">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 shrink-0 rounded-[10px] bg-[#FFFBEB] flex items-center justify-center">
            <PencilLine className="w-5 h-5 text-[#B45309]" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h2 className="text-xl font-extrabold tracking-[-0.3px] text-[#0F172A]">
              Minta perbaikan · #{idPengajuan}
            </h2>
            <p className="text-sm leading-6 text-[#475569]">
              {namaPengajuan} · {tipePengajuan}. Pengaju menerima email berisi step yang perlu
              diperbaiki, dan pengajuan tetap bisa dilanjutkan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-5 h-5 shrink-0 text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step yang perlu diperbaiki (multi-select) */}
        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-[#0F172A]">Step yang perlu diperbaiki</span>
            <button
              type="button"
              onClick={pilihSemua}
              className="text-xs font-semibold text-[#B45309] hover:underline cursor-pointer"
            >
              {selectedSteps.length === langkah.length ? 'Hapus semua' : 'Pilih semua'}
            </button>
          </div>

          <div className="w-full flex flex-col gap-2">
            {langkah.map((item) => {
              const isSelected = selectedSteps.includes(item.nomor)

              return (
                <label
                  key={item.nomor}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-[10px] border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFFBEB] border-[#FCD34D]'
                      : 'bg-white border-[#E2E8F0] hover:border-[#FCD34D]'
                  }`}
                >
                  <span className="relative w-5 h-5 shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleStep(item.nomor)}
                      className="peer absolute inset-0 w-full h-full m-0 appearance-none rounded-[6px] border-[1.5px] border-[#CBD5E1] bg-white checked:bg-[#B45309] checked:border-[#B45309] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309]/40"
                    />
                    <Check className="pointer-events-none absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                  </span>

                  <span className="flex-1 flex flex-col gap-1 min-w-0">
                    <span
                      className={`text-sm font-bold ${
                        isSelected ? 'text-[#92400E]' : 'text-[#0F172A]'
                      }`}
                    >
                      Step {item.nomor} · {item.judul}
                    </span>
                    <span className="text-xs text-[#94A3B8]">{item.sub}</span>
                  </span>
                </label>
              )
            })}
          </div>

          {selectedSteps.length === 0 ? (
            <p className="text-xs text-[#B45309]">Pilih minimal satu step yang perlu diperbaiki.</p>
          ) : null}
        </div>

        {/* Catatan untuk pengaju */}
        <div className="w-full flex flex-col gap-3">
          <span className="text-sm font-bold text-[#0F172A]">Catatan untuk pengaju</span>

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
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#B45309] text-white'
                      : 'bg-white text-[#475569] border border-[#E2E8F0] hover:border-[#FCD34D] hover:text-[#92400E]'
                  }`}
                >
                  {alasan}
                </button>
              )
            })}
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="w-full h-[104px] p-3 rounded-[10px] bg-[#FFFBEB]/50 border border-[#FDE68A] focus-within:border-[#B45309] transition-colors">
              <textarea
                value={pesan}
                onChange={(e) => setPesan(e.target.value.slice(0, BATAS_PESAN))}
                placeholder="Jelaskan apa yang perlu diperbaiki agar pengaju tahu harus mengunggah atau mengisi ulang apa..."
                className="w-full h-full resize-none bg-transparent border-none outline-none text-sm leading-6 text-[#0F172A] placeholder:text-[#94A3B8]"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-3">
              <span className="text-xs text-[#94A3B8]">Terkirim ke email pengaju</span>
              <span className="text-xs text-[#94A3B8]">
                {pesan.length} / {BATAS_PESAN}
              </span>
            </div>
          </div>
        </div>

        {/* Catatan alur */}
        <div className="w-full flex items-start gap-2.5 px-4 py-3 rounded-[10px] bg-[#F8FAFC]">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#64748B]" />
          <p className="text-xs leading-5 text-[#475569]">
            Status pengajuan berubah menjadi <strong className="font-semibold">Perlu perbaikan</strong>.
            Pengaju bisa mengoreksi data lalu mengirim ulang, pengajuan tidak ditolak permanen.
          </p>
        </div>

        {/* Footer */}
        <div className="w-full flex items-center justify-between gap-3 pt-5 border-t border-[#E2E8F0]">
          <span className="text-xs text-[#94A3B8]">Tindakan tercatat di audit log</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-10 rounded-[10px] border border-[#E2E8F0] text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleKirim}
              disabled={!bisaKirim}
              className="flex items-center gap-2 px-4 h-10 rounded-[10px] bg-[#B45309] text-sm font-bold text-white hover:bg-[#92400E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
