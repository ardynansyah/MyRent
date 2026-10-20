import React, { useEffect, useState } from 'react'
import { FileX, X, Send, ShieldAlert } from 'lucide-react'
import { ALASAN_TOLAK_PERMANEN } from './adminDashboardData'

const BATAS_PESAN = 500

/**
 * Modal "Tolak secara permanen".
 *
 * Alur penolakan final: pengajuan ditutup tanpa opsi perbaikan,
 * status berubah menjadi "Ditolak" dan tidak bisa diajukan ulang.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - modal tampil atau tidak
 * @param {function} props.onClose - penutup modal
 * @param {function} props.onSubmit - callback saat penolakan dikirim
 * @param {string} props.idPengajuan - nomor pengajuan (mis. VR-2041)
 * @param {string} props.namaPengajuan - nama pemohon
 * @param {string} props.tipePengajuan - tipe akun pemohon
 */
export default function ModalTolakPengajuan({
  isOpen,
  onClose,
  onSubmit,
  idPengajuan = '',
  namaPengajuan = '',
  tipePengajuan = ''
}) {
  const [alasan, setAlasan] = useState(ALASAN_TOLAK_PERMANEN[0])
  const [pesan, setPesan] = useState('')
  const [sudahCobaKirim, setSudahCobaKirim] = useState(false)

  // Reset state setiap kali modal dibuka ulang (pola "adjust state saat props berubah").
  const [terbukaSebelumnya, setTerbukaSebelumnya] = useState(isOpen)
  if (isOpen !== terbukaSebelumnya) {
    setTerbukaSebelumnya(isOpen)
    if (isOpen) {
      setAlasan(ALASAN_TOLAK_PERMANEN[0])
      setPesan('')
      setSudahCobaKirim(false)
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

  const pesanKosong = pesan.trim().length === 0

  const handleKirim = () => {
    setSudahCobaKirim(true)
    if (pesanKosong) return

    if (onSubmit) {
      onSubmit({
        idPengajuan,
        alasan,
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
      aria-label="Tolak pengajuan secara permanen"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose()
      }}
    >
      <div className="w-full max-w-[560px] flex flex-col gap-5 p-6 rounded-2xl bg-white shadow-[0px_18px_50px_#0F172A55]">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 shrink-0 rounded-[10px] bg-red-50 flex items-center justify-center">
            <FileX className="w-5 h-5 text-red-700" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h2 className="text-xl font-extrabold tracking-[-0.3px] text-slate-900">
              Tolak pengajuan · #{idPengajuan}
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              {namaPengajuan} · {tipePengajuan}
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

        {/* Peringatan keras */}
        <div className="w-full flex items-start gap-3 px-4 py-4 rounded-xl bg-red-50 border border-red-200">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-red-700" />
          <p className="text-sm leading-6 text-red-900">
            Tindakan ini akan menolak pengajuan akun secara permanen dan pengguna tidak dapat
            memperbaiki pengajuan ini.
          </p>
        </div>

        {/* Alasan penolakan permanen */}
        <div className="w-full flex flex-col gap-3">
          <span className="text-sm font-bold text-slate-900">Alasan penolakan</span>
          <div className="w-full flex flex-col gap-2">
            {ALASAN_TOLAK_PERMANEN.map((item) => {
              const isSelected = item === alasan

              return (
                <label
                  key={item}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-slate-200 hover:border-red-200'
                  }`}
                >
                  <span className="relative w-5 h-5 shrink-0">
                    <input
                      type="radio"
                      name="alasan-tolak-permanen"
                      value={item}
                      checked={isSelected}
                      onChange={() => setAlasan(item)}
                      className="peer absolute inset-0 w-full h-full m-0 appearance-none rounded-full border-[1.5px] border-slate-300 bg-white checked:border-[6px] checked:border-red-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700/40"
                    />
                  </span>
                  <span
                    className={`flex-1 text-sm font-semibold ${
                      isSelected ? 'text-red-700' : 'text-slate-900'
                    }`}
                  >
                    {item}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Catatan penolakan (wajib) */}
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-slate-900">Catatan penolakan</span>
            <span className="text-xs font-semibold text-red-700">Wajib diisi</span>
          </div>
          <div
            className={`w-full h-[104px] p-3 rounded-[10px] bg-white border transition-colors ${
              sudahCobaKirim && pesanKosong
                ? 'border-red-700 focus-within:border-red-700'
                : 'border-slate-200 focus-within:border-red-700'
            }`}
          >
            <textarea
              value={pesan}
              onChange={(e) => setPesan(e.target.value.slice(0, BATAS_PESAN))}
              placeholder="Tuliskan alasan penolakan yang mudah dipahami pengaju..."
              className="w-full h-full resize-none bg-transparent border-none outline-none text-sm leading-6 text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div className="w-full flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">Terkirim ke email pengaju</span>
            <span className="text-xs text-slate-400">
              {pesan.length} / {BATAS_PESAN}
            </span>
          </div>
          {sudahCobaKirim && pesanKosong ? (
            <p className="text-xs font-semibold text-red-700">
              Catatan penolakan wajib diisi sebelum pengajuan ditolak.
            </p>
          ) : null}
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
              className="flex items-center gap-2 px-4 h-10 rounded-[10px] bg-red-700 text-sm font-bold text-white hover:bg-red-800 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Tolak Secara Permanen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
