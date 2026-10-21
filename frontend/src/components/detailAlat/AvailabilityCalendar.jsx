import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { addDays, diffDays, formatShortDate, normalizeDate } from '../../lib/dateHelpers'

// Status ketersediaan default untuk Juni 2025.
// 'terisi'   → sedang disewa (tidak bisa dipilih)
// 'buffer'   → jeda rawat / perawatan
// 'tersedia' → bebas disewa
const DEFAULT_DAYS_STATUS = {
  1: 'terisi',
  2: 'terisi',
  3: 'terisi',
  4: 'terisi',
  5: 'terisi',
  6: 'terisi',
  7: 'terisi',
  8: 'terisi',
  9: 'terisi',
  10: 'buffer',
  11: 'tersedia',
  16: 'buffer',
  17: 'tersedia',
  18: 'tersedia',
  19: 'tersedia',
  20: 'tersedia',
  21: 'tersedia',
  22: 'tersedia',
  23: 'tersedia',
  24: 'tersedia',
  25: 'tersedia',
  26: 'tersedia',
  27: 'tersedia',
  28: 'tersedia',
  29: 'tersedia',
  30: 'tersedia'
}

export default function AvailabilityCalendar({
  monthTitle = 'Ketersediaan Juni 2025',
  subTitle = 'Pilih tanggal mulai & selesai sewa',
  year = 2025,
  month = 5, // 0-based → 5 = Juni
  minRentDays = 1,
  // Tanggal mulai & selesai terpilih (Date | null), dikontrol dari parent.
  selectionStart = null,
  selectionEnd = null,
  onSelectionChange,
  dayStatus = DEFAULT_DAYS_STATUS
}) {
  const [notice, setNotice] = useState(null)

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const minDays = Math.max(1, Number(minRentDays) || 1)

  // Timestamp tanggal terpilih (menormalkan ke tengah malam lokal).
  const startTime = normalizeDate(selectionStart)?.getTime() ?? null
  const endTime = normalizeDate(selectionEnd)?.getTime() ?? null

  const toDate = (day) => new Date(year, month, day)
  const getStatus = (day) => dayStatus[day] || 'tersedia'

  const isStart = (day) => startTime !== null && toDate(day).getTime() === startTime
  const isEnd = (day) => endTime !== null && toDate(day).getTime() === endTime
  const isBetween = (day) => {
    if (startTime === null || endTime === null) return false

    const time = toDate(day).getTime()
    return time > startTime && time < endTime
  }

  /**
   * Geser tanggal selesai otomatis sampai DURASI minimal terpenuhi dan tidak
   * menabrak hari yang sudah 'terisi'.
   */
  const adjustEndDate = (start) => {
    let end = addDays(start, minDays - 1)

    for (let i = 0; i < daysInMonth; i += 1) {
      // Melebihi kalender bulan ini → mundur ke hari kosong terakhir.
      if (end.getFullYear() !== year || end.getMonth() !== month) {
        end = new Date(year, month, daysInMonth)
        while (end.getTime() > start.getTime() && getStatus(end.getDate()) === 'terisi') {
          end = addDays(end, -1)
        }
        break
      }

      // Lewati hari yang sudah terisi.
      if (getStatus(end.getDate()) !== 'terisi') break

      end = addDays(end, 1)
    }

    return end
  }

  const handleDayClick = (day) => {
    // Tanggal yang sedang disewa tidak bisa dipilih.
    if (getStatus(day) === 'terisi') return

    const clicked = toDate(day)

    // ── Kasus 1: klik pertama → set sebagai tanggal mulai ─────────────────
    if (startTime === null) {
      onSelectionChange?.(clicked, null)
      setNotice(`Pilih tanggal selesai (minimal ${minDays} hari sewa).`)
      return
    }

    // ── Kasus 2: klik ulang tanggal yang sudah aktif → reset kalender ────
    // (hanya saat rentang sudah lengkap, supaya sewa 1 hari tetap bisa dibuat)
    if (endTime !== null && (isStart(day) || isEnd(day))) {
      onSelectionChange?.(null, null)
      setNotice(null)
      return
    }

    // ── Kasus 3: rentang sudah lengkap & klik tanggal lain → mulai baru ──
    if (endTime !== null) {
      onSelectionChange?.(clicked, null)
      setNotice(`Pilih tanggal selesai (minimal ${minDays} hari sewa).`)
      return
    }

    // ── Kasus 4: klik kedua → tentukan rentang mulai & selesai ───────────
    let start = normalizeDate(selectionStart)
    let end = clicked

    // Klik tanggal yang lebih awal → rentang dibalik (yang diklik jadi mulai).
    if (clicked.getTime() < start.getTime()) {
      start = clicked
      end = normalizeDate(selectionStart)
    }

    let duration = diffDays(start, end) + 1
    let isAdjusted = false

    // Durasi lebih pendek dari minimal sewa → geser tanggal selesai otomatis.
    if (duration < minDays) {
      end = adjustEndDate(start)
      duration = diffDays(start, end) + 1
      isAdjusted = true
    }

    onSelectionChange?.(start, end)

    if (!isAdjusted) {
      setNotice(null)
      return
    }

    setNotice(
      duration >= minDays
        ? `Minimal sewa ${minDays} hari — rentang otomatis disesuaikan menjadi ${duration} hari.`
        : `Minimal sewa ${minDays} hari — bulan ini tidak punya cukup hari kosong, rentang dibatasi ${duration} hari.`
    )
  }

  const rentalDays =
    selectionStart && selectionEnd ? diffDays(selectionStart, selectionEnd) + 1 : 0

  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-3.5 p-5 justify-start items-start bg-white ring-1 ring-slate-200 rounded-[14px]">
      {/* Calendar Header */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
        <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-0.5 justify-start items-start">
          <div className="text-[15px] text-slate-900 font-bold text-left whitespace-nowrap">
            {monthTitle}
          </div>
          <div className="text-xs text-slate-500 font-normal text-left whitespace-nowrap">
            {subTitle}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-1.5 justify-start items-start">
          <button
            type="button"
            className="box-border w-7.5 shrink-0 h-7.5 flex flex-row justify-center items-center ring-1 ring-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors cursor-pointer border-0"
          >
            <ChevronLeft className="w-3.75 h-3.75 text-slate-600" />
          </button>
          <button
            type="button"
            className="box-border w-7.5 shrink-0 h-7.5 flex flex-row justify-center items-center ring-1 ring-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors cursor-pointer border-0"
          >
            <ChevronRight className="w-3.75 h-3.75 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Days of Week (DOW) */}
      <div className="w-full grid grid-cols-7 gap-1.5">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((dow) => (
          <div
            key={dow}
            className="text-[11px] text-slate-500 font-semibold text-center py-1 uppercase tracking-wider"
          >
            {dow}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="w-full grid grid-cols-7 gap-1.5">
        {daysArray.map((day) => {
          const status = getStatus(day)
          const selectedStart = isStart(day)
          const selectedEnd = isEnd(day)
          const inRange = isBetween(day)

          let styleClasses = ''
          if (selectedStart || selectedEnd) {
            // Tanggal mulai & selesai → warna primary penuh.
            styleClasses = 'bg-primary text-primary-foreground font-bold shadow-xs cursor-pointer scale-[1.02]'
          } else if (inRange) {
            // Tanggal di tengah rentang → warna primary transparan.
            styleClasses = 'bg-primary/20 text-primary font-semibold cursor-pointer hover:bg-primary/30'
          } else if (status === 'terisi') {
            styleClasses = 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
          } else if (status === 'buffer') {
            styleClasses = 'bg-blue-50 text-blue-700 font-semibold cursor-pointer hover:ring-1 hover:ring-blue-700'
          } else {
            // tersedia
            styleClasses = 'bg-white ring-1 ring-slate-200 text-slate-900 hover:bg-blue-50/50 hover:ring-blue-600 font-medium cursor-pointer'
          }

          return (
            <button
              key={day}
              type="button"
              disabled={status === 'terisi'}
              onClick={() => handleDayClick(day)}
              aria-label={`${day} ${status}`}
              aria-pressed={selectedStart || selectedEnd || inRange}
              className={`box-border h-10 flex flex-row justify-center items-center rounded-lg transition-all border-0 text-[13px] font-semibold tabular-nums ${styleClasses}`}
            >
              <span>{day}</span>
            </button>
          )
        })}
      </div>

      {/* Ringkasan seleksi + info minimal sewa */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-1.5 justify-start items-start">
        <div className="text-[11px] text-slate-600 font-medium tabular-nums text-left whitespace-nowrap">
          {selectionStart ? (
            <>
              Mulai {formatShortDate(selectionStart)}
              {selectionEnd ? ` · Selesai ${formatShortDate(selectionEnd)} · ${rentalDays} hari sewa` : ' · pilih tanggal selesai'}
            </>
          ) : (
            'Belum ada tanggal dipilih'
          )}
        </div>

        {notice && (
          <div className="box-border w-full flex flex-row gap-2 px-3 py-2 justify-start items-start bg-amber-50 ring-1 ring-amber-100 rounded-lg">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
            <p className="text-[11px] leading-4 text-amber-700 font-normal text-left m-0">
              {notice}
            </p>
          </div>
        )}
      </div>

      {/* Calendar Legend */}
      <div className="box-border w-full h-fit shrink-0 flex flex-wrap gap-4 pt-3 justify-start items-center border-t border-slate-200">
        {/* Tersedia */}
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-1.5 justify-start items-center">
          <div className="box-border w-3 shrink-0 h-3 bg-white ring-1 ring-slate-200 rounded"></div>
          <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
            Tersedia
          </span>
        </div>

        {/* Terisi */}
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-1.5 justify-start items-center">
          <div className="box-border w-3 shrink-0 h-3 bg-slate-50 rounded"></div>
          <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
            Terisi
          </span>
        </div>

        {/* Buffer Perawatan */}
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-1.5 justify-start items-center">
          <div className="box-border w-3 shrink-0 h-3 bg-blue-50 rounded"></div>
          <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
            Buffer perawatan
          </span>
        </div>

        {/* Dipilih (mulai & selesai) */}
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-1.5 justify-start items-center">
          <div className="box-border w-3 shrink-0 h-3 bg-primary rounded"></div>
          <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
            Dipilih
          </span>
        </div>

        {/* Rentang terpilih (in-between) */}
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-1.5 justify-start items-center">
          <div className="box-border w-3 shrink-0 h-3 bg-primary/20 rounded"></div>
          <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
            Dalam rentang
          </span>
        </div>
      </div>
    </div>
  )
}
