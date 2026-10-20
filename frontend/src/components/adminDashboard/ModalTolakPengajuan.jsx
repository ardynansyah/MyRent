import React, { useEffect, useState } from 'react'
import { FileX, X, Send, ShieldAlert, Check } from 'lucide-react'
import { cn } from '../../lib/utils'
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
      <div className="w-full max-w-[560px] flex flex-col gap-5 p-6 rounded-2xl bg-background shadow-[0px_18px_50px_#0F172A55]">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-destructive/10">
            <FileX className="size-5 text-destructive" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h2 className="text-xl font-extrabold tracking-[-0.3px] text-foreground">
              Tolak pengajuan · #{idPengajuan}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {namaPengajuan} · {tipePengajuan}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Peringatan keras */}
        <div className="w-full flex items-start gap-3 px-4 py-4 rounded-[12px] bg-destructive/10 border border-destructive/30">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
          <p className="text-sm leading-6 text-destructive">
            Tindakan ini akan menolak pengajuan akun secara permanen dan pengguna tidak dapat
            memperbaiki pengajuan ini.
          </p>
        </div>

        {/* Alasan penolakan permanen — chip yang membungkus otomatis */}
        <div className="w-full flex flex-col gap-3">
          <span className="text-sm font-bold text-foreground">Alasan penolakan</span>
          <div className="mb-4 flex w-full flex-wrap gap-2">
            {ALASAN_TOLAK_PERMANEN.map((item) => {
              const isSelected = item === alasan

              return (
                <label key={item} className="cursor-pointer">
                  <input
                    type="radio"
                    name="alasan-tolak-permanen"
                    value={item}
                    checked={isSelected}
                    onChange={() => setAlasan(item)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                      'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
                      'peer-checked:border-destructive peer-checked:bg-destructive peer-checked:text-destructive-foreground peer-checked:hover:bg-destructive/90',
                      'border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    {isSelected ? <Check className="size-3 shrink-0" /> : null}
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
            <span className="text-sm font-bold text-foreground">Catatan penolakan</span>
            <span className="text-xs font-semibold text-destructive">Wajib diisi</span>
          </div>
          <div
            className={`w-full h-[104px] p-3 rounded-[10px] bg-background border transition-colors ${
              sudahCobaKirim && pesanKosong
                ? 'border-destructive focus-within:border-destructive'
                : 'border-input focus-within:border-destructive'
            }`}
          >
            <textarea
              value={pesan}
              onChange={(e) => setPesan(e.target.value.slice(0, BATAS_PESAN))}
              placeholder="Tuliskan alasan penolakan yang mudah dipahami pengaju..."
              className="w-full h-full resize-none bg-transparent border-none outline-none text-sm leading-6 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="w-full flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">Terkirim ke email pengaju</span>
            <span className="text-xs text-muted-foreground">
              {pesan.length} / {BATAS_PESAN}
            </span>
          </div>
          {sudahCobaKirim && pesanKosong ? (
            <p className="text-xs font-semibold text-destructive">
              Catatan penolakan wajib diisi sebelum pengajuan ditolak.
            </p>
          ) : null}
        </div>

        {/* Footer */}
        <div className="w-full flex items-center justify-between gap-3 pt-5 border-t border-border">
          <span className="text-xs text-muted-foreground">Tindakan tercatat di audit log</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-[10px] border border-input bg-background px-4 h-10 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleKirim}
              className="flex items-center gap-2 px-4 h-10 rounded-[10px] bg-destructive text-sm font-bold text-destructive-foreground hover:bg-destructive/90 transition-colors cursor-pointer"
            >
              <Send className="size-4" />
              <span>Tolak Secara Permanen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
