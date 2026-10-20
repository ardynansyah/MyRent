import { useState, useRef, useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export default function ModernDatePicker({
  value,
  onChange,
  placeholder = 'Pilih tanggal...',
  error,
  maxDate,
  minYear = 1940,
  maxYear = new Date().getFullYear() + 2
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  // Parse initial view from value or fallback to today
  const getInitialView = () => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m] = value.split('-').map(Number)
      return { year: y, month: m - 1 }
    }
    const today = new Date()
    return { year: today.getFullYear(), month: today.getMonth() }
  }

  const [viewDate, setViewDate] = useState(getInitialView)

  // Sync view when value changes externally
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m] = value.split('-').map(Number)
      setViewDate({ year: y, month: m - 1 })
    }
  }, [value])

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Helpers
  const formatDisplay = (val) => {
    if (!val) return ''
    const parts = val.split('-')
    if (parts.length !== 3) return val
    const [y, m, d] = parts
    const mIdx = parseInt(m, 10) - 1
    return `${parseInt(d, 10)} ${MONTH_NAMES[mIdx] || m} ${y}`
  }

  const handlePrevMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 }
      }
      return { year: prev.year, month: prev.month - 1 }
    })
  }

  const handleNextMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 }
      }
      return { year: prev.year, month: prev.month + 1 }
    })
  }

  const handleSelectDay = (day) => {
    const formattedMonth = String(viewDate.month + 1).padStart(2, '0')
    const formattedDay = String(day).padStart(2, '0')
    const isoDate = `${viewDate.year}-${formattedMonth}-${formattedDay}`
    onChange?.(isoDate)
    setIsOpen(false)
  }

  const handleSetToday = () => {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    const isoDate = `${y}-${m}-${d}`
    setViewDate({ year: today.getFullYear(), month: today.getMonth() })
    onChange?.(isoDate)
    setIsOpen(false)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange?.('')
  }

  // Days calculations
  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate()
  const firstDayIndex = new Date(viewDate.year, viewDate.month, 1).getDay()
  const prevMonthDays = new Date(viewDate.year, viewDate.month, 0).getDate()

  const todayStr = (() => {
    const t = new Date()
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
  })()

  // Generate Year options
  const years = []
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y)
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 flex items-center justify-between cursor-pointer border transition-all select-none ${
          error
            ? 'border-red-400 focus:ring-red-200'
            : isOpen
            ? 'border-blue-600 ring-2 ring-blue-100'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <span className={value ? 'text-slate-800 font-medium' : 'text-slate-400'}>
          {value ? formatDisplay(value) : placeholder}
        </span>

        <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors"
              title="Hapus tanggal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <CalendarIcon className={`w-4 h-4 transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-400'}`} />
        </div>
      </div>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-[310px] bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200 p-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Controls: Month/Year Dropdowns & Nav Buttons */}
          <div className="flex items-center justify-between gap-1 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 flex-1">
              {/* Month Dropdown */}
              <select
                value={viewDate.month}
                onChange={(e) => setViewDate((prev) => ({ ...prev, month: parseInt(e.target.value, 10) }))}
                className="text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx}>
                    {name}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={viewDate.year}
                onChange={(e) => setViewDate((prev) => ({ ...prev, year: parseInt(e.target.value, 10) }))}
                className="text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Bulan sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Bulan berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 pt-3 pb-1 text-center">
            {DAY_NAMES.map((name, idx) => (
              <span
                key={name}
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  idx === 0 ? 'text-rose-500' : 'text-slate-400'
                }`}
              >
                {name}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Prev Month Days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => {
              const prevDay = prevMonthDays - firstDayIndex + i + 1
              return (
                <div
                  key={`prev-${i}`}
                  className="h-8 flex items-center justify-center text-xs text-slate-300 select-none"
                >
                  {prevDay}
                </div>
              )
            })}

            {/* Current Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const currentIso = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isSelected = value === currentIso
              const isToday = todayStr === currentIso

              return (
                <button
                  type="button"
                  key={`cur-${day}`}
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 w-8 mx-auto flex items-center justify-center text-xs rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30'
                      : isToday
                      ? 'border border-blue-500 text-blue-600 font-bold hover:bg-blue-50'
                      : 'text-slate-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Footer Shortcuts */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs">
            <button
              type="button"
              onClick={() => {
                onChange?.('')
                setIsOpen(false)
              }}
              className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
            >
              Hapus
            </button>
            <button
              type="button"
              onClick={handleSetToday}
              className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
            >
              Hari ini
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
