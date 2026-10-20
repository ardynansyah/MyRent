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
      className="group box-border flex-1 min-w-[260px] max-w-full sm:max-w-[340px] h-fit flex flex-col gap-0 justify-start items-start bg-white ring-1 ring-slate-200 rounded-[14px] overflow-hidden hover:ring-blue-600/40 hover:shadow-md transition-all cursor-pointer"
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
        <div className="box-border w-fit h-fit absolute left-3 top-3 flex flex-row gap-0 py-[5px] px-2.5 justify-start items-start bg-white rounded-full shadow-2xs z-10">
          <span className="text-[11px] text-green-700 font-bold whitespace-nowrap">
            {status}
          </span>
        </div>

        {/* Distance Badge */}
        <div className="box-border w-fit h-fit absolute left-3 top-[130px] flex flex-row gap-[5px] py-1 px-[9px] justify-start items-center bg-white/95 backdrop-blur rounded-full shadow-2xs z-10">
          <MapPin className="w-[11px] h-[11px] text-slate-600" />
          <span className="text-[11px] text-slate-600 font-semibold tabular-nums whitespace-nowrap">
            {distance}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[9px] p-4 justify-start items-start">
        {/* Meta (Watt & Min Rent) */}
        <div className="text-xs text-blue-600 font-semibold tabular-nums text-left whitespace-nowrap">
          {meta}
        </div>

        {/* Name */}
        <h3 className="text-sm leading-5 w-full text-slate-900 font-bold text-left line-clamp-2 min-h-10 m-0 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>

        {/* Price Row */}
        <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[5px] justify-start items-end">
          <div className="text-lg text-slate-900 font-extrabold tracking-tight tabular-nums text-left whitespace-nowrap">
            {price}
          </div>
          <div className="text-xs text-slate-500 font-normal text-left whitespace-nowrap pb-0.5">
            {period}
          </div>
        </div>

        {/* Deposit Info */}
        <div className="text-[11px] text-slate-500 font-medium tabular-nums text-left whitespace-nowrap">
          {deposit}
        </div>

        {/* Divider */}
        <div className="box-border w-full h-px shrink-0 bg-slate-200 my-1"></div>

        {/* Action Button: Pilih Tanggal Sewa */}
        <button
          type="button"
          onClick={handleButtonClick}
          className="box-border w-full h-fit shrink-0 flex flex-row gap-2 py-2.5 px-4 justify-center items-center bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-[10px] transition-all cursor-pointer border-0 font-semibold text-[13px] whitespace-nowrap"
        >
          Pilih Tanggal Sewa
        </button>
      </div>
    </div>
  )
}
