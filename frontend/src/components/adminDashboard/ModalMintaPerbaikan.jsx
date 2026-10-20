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
      <div className="flex w-full max-w-[600px] flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0px_18px_50px_#0F172A55]">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 shrink-0 rounded-[10px] bg-amber-50 flex items-center justify-center">
            <PencilLine className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h2 className="text-xl font-extrabold tracking-[-0.3px] text-slate-900">
              Minta perbaikan · #{idPengajuan}
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              {namaPengajuan} · {tipePengajuan}. Pengaju menerima email berisi step yang perlu
              diperbaiki, dan pengajuan tetap bisa dilanjutkan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-5 h-5 shrink-0 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step yang perlu diperbaiki (multi-select) */}
        <div className="w-full flex flex-col gap-3">
          <div className="w-full flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-slate-900">Step yang perlu diperbaiki</span>
            <button
              type="button"
              onClick={pilihSemua}
              className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
            >
              {selectedSteps.length === langkah.length ? 'Hapus semua' : 'Pilih semua'}
            </button>
          </div>

          {/* Daftar checkbox */}
          <div className="flex w-full flex-col gap-3">
            {langkah.map((item) => {
              const isSelected = selectedSteps.includes(item.nomor)

              return (
                <label
                  key={item.nomor}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-[10px] border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-white border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <span className="relative w-5 h-5 shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleStep(item.nomor)}
                      className="peer absolute inset-0 w-full h-full m-0 appearance-none rounded-md border-[1.5px] border-slate-300 bg-white checked:bg-amber-700 checked:border-amber-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/40"
                    />
                    <Check className="pointer-events-none absolute inset-0 m-auto w-3 h-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                  </span>

                  <span className="flex-1 flex flex-col gap-1 min-w-0">
                    <span
                      className={`text-sm font-bold ${
                        isSelected ? 'text-amber-800' : 'text-slate-900'
                      }`}
                    >
                      Step {item.nomor} · {item.judul}
                    </span>
                    <span className="text-xs text-slate-400">{item.sub}</span>
                  </span>
                </label>
              )
            })}
          </div>

          {selectedSteps.length === 0 ? (
            <p className="text-xs text-amber-700">Pilih minimal satu step yang perlu diperbaiki.</p>
          ) : null}
        </div>

        {/* Catatan untuk pengaju */}
        <div className="w-full flex flex-col gap-3">
          <span className="text-sm font-bold text-slate-900">Catatan untuk pengaju</span>

          <div className="mb-4 flex w-full flex-wrap gap-2">
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
                      ? 'bg-amber-700 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:text-amber-800'
                  }`}
                >
                  {alasan}
                </button>
              )
            })}
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="w-full h-[104px] p-3 rounded-[10px] bg-amber-50/50 border border-amber-200 focus-within:border-amber-700 transition-colors">
              <textarea
                value={pesan}
                onChange={(e) => setPesan(e.target.value.slice(0, BATAS_PESAN))}
                placeholder="Jelaskan apa yang perlu diperbaiki agar pengaju tahu harus mengunggah atau mengisi ulang apa..."
                className="w-full h-full resize-none bg-transparent border-none outline-none text-sm leading-6 text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">Terkirim ke email pengaju</span>
              <span className="text-xs text-slate-400">
                {pesan.length} / {BATAS_PESAN}
              </span>
            </div>
          </div>
        </div>

        {/* Catatan alur */}
        <div className="w-full flex items-start gap-2.5 px-4 py-3 rounded-[10px] bg-slate-50">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
          <p className="text-xs leading-5 text-slate-600">
            Status pengajuan berubah menjadi <strong className="font-semibold">Perlu perbaikan</strong>.
            Pengaju bisa mengoreksi data lalu mengirim ulang, pengajuan tidak ditolak permanen.
          </p>
        </div>

        {/* Footer */}
        <div className="w-full flex items-center justify-between gap-3 pt-5 border-t border-slate-200">
          <span className="text-xs text-slate-400">Tindakan tercatat di audit log</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-10 rounded-[10px] border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleKirim}
              disabled={!bisaKirim}
              className="flex items-center gap-2 px-4 h-10 rounded-[10px] bg-amber-700 text-sm font-bold text-white hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
