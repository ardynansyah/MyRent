import React from 'react'
import { MapPin } from 'lucide-react'

export default function ProductCard({
  id,
  image,
  status = 'Tersedia',
  distance = '2.4 km',
  meta = '1300 Watt · Min. 2 Hari',
  name = 'Espresso Machine La Marzocco GS3',
  price = 'Rp 150.000',
  period = '/hari',
  deposit = 'Deposit: Rp 500.000 (100% kembali)',
  onSelectDate,
  onClick
}) {
  const handleCardClick = () => {
    if (onClick) onClick(id)
  }

  const handleButtonClick = (e) => {
    e.stopPropagation()
    if (onSelectDate) onSelectDate(id)
    else if (onClick) onClick(id)
  }

  return (
    <div
      onClick={handleCardClick}
      className="group box-border flex-1 min-w-[260px] max-w-full sm:max-w-[340px] h-fit flex flex-col gap-0 justify-start items-start bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[14px] overflow-hidden hover:ring-[#2563EB]/40 hover:shadow-md transition-all cursor-pointer"
    >
      {/* Photo with Badges */}
      <div className="box-border w-full h-[168px] shrink-0 relative bg-slate-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
            Foto Alat
          </div>
        )}

        {/* Status Badge */}
        <div className="box-border w-fit h-fit absolute left-[12px] top-[12px] flex flex-row gap-0 py-[5px] px-[10px] justify-start items-start bg-[#FFFFFF] rounded-full shadow-2xs z-10">
          <span className="text-[11px] text-[#15803D] font-bold whitespace-nowrap">
            {status}
          </span>
        </div>

        {/* Distance Badge */}
        <div className="box-border w-fit h-fit absolute left-[12px] top-[130px] flex flex-row gap-[5px] py-[4px] px-[9px] justify-start items-center bg-[#FFFFFF]/95 backdrop-blur rounded-full shadow-2xs z-10">
          <MapPin className="w-[11px] h-[11px] text-[#475569]" />
          <span className="text-[11px] text-[#475569] font-semibold tabular-nums whitespace-nowrap">
            {distance}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[9px] p-[16px] justify-start items-start">
        {/* Meta (Watt & Min Rent) */}
        <div className="text-[12px] text-[#2563EB] font-semibold tabular-nums text-left whitespace-nowrap">
          {meta}
        </div>

        {/* Name */}
        <h3 className="text-[14px] leading-[20px] w-full text-[#0F172A] font-bold text-left line-clamp-2 min-h-[40px] m-0 group-hover:text-[#2563EB] transition-colors">
          {name}
        </h3>

        {/* Price Row */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[5px] justify-start items-end">
          <div className="text-[18px] text-[#0F172A] font-extrabold tracking-tight tabular-nums text-left whitespace-nowrap">
            {price}
          </div>
          <div className="text-[12px] text-slate-500 font-normal text-left whitespace-nowrap pb-[2px]">
            {period}
          </div>
        </div>

        {/* Deposit Info */}
        <div className="text-[11px] text-slate-500 font-medium tabular-nums text-left whitespace-nowrap">
          {deposit}
        </div>

        {/* Divider */}
        <div className="box-border w-full h-[1px] shrink-0 bg-[#E2E8F0] my-1"></div>

        {/* Action Button: Pilih Tanggal Sewa */}
        <button
          type="button"
          onClick={handleButtonClick}
          className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] py-[10px] px-[16px] justify-center items-center bg-[#EFF6FF] hover:bg-[#2563EB] text-[#1D4ED8] hover:text-[#FFFFFF] rounded-[10px] transition-all cursor-pointer border-0 font-semibold text-[13px] whitespace-nowrap"
        >
          Pilih Tanggal Sewa
        </button>
      </div>
    </div>
  )
}
