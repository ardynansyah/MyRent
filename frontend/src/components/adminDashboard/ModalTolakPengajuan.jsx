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
  idPengajuan = 'VR-2041',
  namaPengajuan = 'Dapur Roti Andini',
  tipePengajuan = 'Penyewa UMKM'
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
          <div className="w-10 h-10 shrink-0 rounded-[10px] bg-[#FEF2F2] flex items-center justify-center">
            <FileX className="w-5 h-5 text-[#B91C1C]" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h2 className="text-xl font-extrabold tracking-[-0.3px] text-[#0F172A]">
              Tolak pengajuan · #{idPengajuan}
            </h2>
            <p className="text-sm leading-6 text-[#475569]">
              {namaPengajuan} · {tipePengajuan}
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

        {/* Peringatan keras */}
        <div className="w-full flex items-start gap-3 px-4 py-4 rounded-[12px] bg-[#FEF2F2] border border-[#FECACA]">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-[#B91C1C]" />
          <p className="text-sm leading-6 text-[#7F1D1D]">
            Tindakan ini akan menolak pengajuan akun secara permanen dan pengguna tidak dapat
            memperbaiki pengajuan ini.
          </p>
        </div>

        {/* Alasan penolakan permanen */}
        <div className="w-full flex flex-col gap-3">
          <span className="text-sm font-bold text-[#0F172A]">Alasan penolakan</span>
          <div className="w-full flex flex-col gap-2">
            {ALASAN_TOLAK_PERMANEN.map((item) => {
              const isSelected = item === alasan

              return (
                <label
                  key={item}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#FEF2F2] border-[#FECACA]'
                      : 'bg-white border-[#E2E8F0] hover:border-[#FECACA]'
                  }`}
                >
                  <span className="relative w-5 h-5 shrink-0">
                    <input
                      type="radio"
                      name="alasan-tolak-permanen"
                      value={item}
                      checked={isSelected}
                      onChange={() => setAlasan(item)}
                      className="peer absolute inset-0 w-full h-full m-0 appearance-none rounded-full border-[1.5px] border-[#CBD5E1] bg-white checked:border-[6px] checked:border-[#B91C1C] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C]/40"
                    />
                  </span>
                  <span
                    className={`flex-1 text-sm font-semibold ${
                      isSelected ? 'text-[#B91C1C]' : 'text-[#0F172A]'
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
            <span className="text-sm font-bold text-[#0F172A]">Catatan penolakan</span>
            <span className="text-xs font-semibold text-[#B91C1C]">Wajib diisi</span>
          </div>
          <div
            className={`w-full h-[104px] p-3 rounded-[10px] bg-white border transition-colors ${
              sudahCobaKirim && pesanKosong
                ? 'border-[#B91C1C] focus-within:border-[#B91C1C]'
                : 'border-[#E2E8F0] focus-within:border-[#B91C1C]'
            }`}
          >
            <textarea
              value={pesan}
              onChange={(e) => setPesan(e.target.value.slice(0, BATAS_PESAN))}
              placeholder="Tuliskan alasan penolakan yang mudah dipahami pengaju..."
              className="w-full h-full resize-none bg-transparent border-none outline-none text-sm leading-6 text-[#0F172A] placeholder:text-[#94A3B8]"
            />
          </div>
          <div className="w-full flex items-center justify-between gap-3">
            <span className="text-xs text-[#94A3B8]">Terkirim ke email pengaju</span>
            <span className="text-xs text-[#94A3B8]">
              {pesan.length} / {BATAS_PESAN}
            </span>
          </div>
          {sudahCobaKirim && pesanKosong ? (
            <p className="text-xs font-semibold text-[#B91C1C]">
              Catatan penolakan wajib diisi sebelum pengajuan ditolak.
            </p>
          ) : null}
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
              className="flex items-center gap-2 px-4 h-10 rounded-[10px] bg-[#B91C1C] text-sm font-bold text-white hover:bg-[#991B1B] transition-colors cursor-pointer"
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
