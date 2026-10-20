import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Default schedule status for June 2025
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
  12: 'dipilih',
  13: 'dipilih',
  14: 'dipilih',
  15: 'dipilih',
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
  selectedRange = [12, 15],
  onSelectRange
}) {
  const [currentRange, setCurrentRange] = useState(selectedRange)

  // 30 days of June
  const daysArray = Array.from({ length: 30 }, (_, i) => i + 1)

  const handleDayClick = (day) => {
    // If it's already booked (terisi), do nothing
    if (DEFAULT_DAYS_STATUS[day] === 'terisi') return

    if (!currentRange || currentRange.length === 2) {
      setCurrentRange([day])
      if (onSelectRange) onSelectRange([day])
    } else {
      const [start] = currentRange
      const range = day >= start ? [start, day] : [day, start]
      setCurrentRange(range)
      if (onSelectRange) onSelectRange(range)
    }
  }

  const getDayStatus = (day) => {
    if (currentRange.length === 2 && day >= currentRange[0] && day <= currentRange[1]) {
      return 'dipilih'
    }
    if (currentRange.length === 1 && day === currentRange[0]) {
      return 'dipilih'
    }
    return DEFAULT_DAYS_STATUS[day] || 'tersedia'
  }

  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[14px] p-[20px] justify-start items-start bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[14px] font-['Plus_Jakarta_Sans',system-ui,sans-serif]">
      {/* Calendar Header */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
        <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start">
          <div className="text-[15px] text-[#0F172A] font-bold text-left whitespace-nowrap">
            {monthTitle}
          </div>
          <div className="text-[11px] text-[#94A3B8] font-normal text-left whitespace-nowrap">
            {subTitle}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-start">
          <button
            type="button"
            className="box-border w-[30px] shrink-0 h-[30px] flex flex-row justify-center items-center ring-1 ring-[#E2E8F0] rounded-[8px] bg-white hover:bg-slate-50 transition-colors cursor-pointer border-0"
          >
            <ChevronLeft className="w-[15px] h-[15px] text-[#475569]" />
          </button>
          <button
            type="button"
            className="box-border w-[30px] shrink-0 h-[30px] flex flex-row justify-center items-center ring-1 ring-[#E2E8F0] rounded-[8px] bg-white hover:bg-slate-50 transition-colors cursor-pointer border-0"
          >
            <ChevronRight className="w-[15px] h-[15px] text-[#475569]" />
          </button>
        </div>
      </div>

      {/* Days of Week (DOW) */}
      <div className="w-full grid grid-cols-7 gap-[6px]">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((dow) => (
          <div
            key={dow}
            className="text-[10px] text-[#94A3B8] font-bold text-center py-1 uppercase"
          >
            {dow}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="w-full grid grid-cols-7 gap-[6px]">
        {daysArray.map((day) => {
          const status = getDayStatus(day)

          let styleClasses = ''
          if (status === 'terisi') {
            styleClasses = 'bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed opacity-60'
          } else if (status === 'buffer') {
            styleClasses = 'bg-[#EFF6FF] text-[#1D4ED8] font-semibold cursor-pointer hover:ring-1 hover:ring-[#1D4ED8]'
          } else if (status === 'dipilih') {
            styleClasses = 'bg-[#2563EB] text-[#FFFFFF] font-bold shadow-xs cursor-pointer scale-[1.02]'
          } else {
            // tersedia
            styleClasses = 'bg-[#FFFFFF] ring-1 ring-[#E2E8F0] text-[#0F172A] hover:bg-blue-50/50 hover:ring-[#2563EB] font-medium cursor-pointer'
          }

          return (
            <button
              key={day}
              type="button"
              disabled={status === 'terisi'}
              onClick={() => handleDayClick(day)}
              className={`box-border h-[40px] flex flex-row justify-center items-center rounded-[8px] transition-all border-0 text-[12px] ${styleClasses}`}
            >
              <span>{day}</span>
            </button>
          )
        })}
      </div>

      {/* Calendar Legend */}
      <div className="box-border w-full h-fit shrink-0 flex flex-wrap gap-[16px] pt-[12px] justify-start items-center border-t border-[#E2E8F0]">
        {/* Tersedia */}
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center">
          <div className="box-border w-[12px] shrink-0 h-[12px] bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[4px]"></div>
          <span className="text-[10px] text-[#475569] font-normal whitespace-nowrap">
            Tersedia
          </span>
        </div>

        {/* Terisi */}
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center">
          <div className="box-border w-[12px] shrink-0 h-[12px] bg-[#F8FAFC] rounded-[4px]"></div>
          <span className="text-[10px] text-[#475569] font-normal whitespace-nowrap">
            Terisi
          </span>
        </div>

        {/* Buffer Perawatan */}
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center">
          <div className="box-border w-[12px] shrink-0 h-[12px] bg-[#EFF6FF] rounded-[4px]"></div>
          <span className="text-[10px] text-[#475569] font-normal whitespace-nowrap">
            Buffer perawatan
          </span>
        </div>

        {/* Dipilih */}
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center">
          <div className="box-border w-[12px] shrink-0 h-[12px] bg-[#2563EB] rounded-[4px]"></div>
          <span className="text-[10px] text-[#475569] font-normal whitespace-nowrap">
            Dipilih
          </span>
        </div>
      </div>
    </div>
  )
}
