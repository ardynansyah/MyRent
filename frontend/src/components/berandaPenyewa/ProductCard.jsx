import React from 'react'
import { MapPin } from 'lucide-react'
import { formatRupiah } from '../../lib/equipmentsApi'
import fallbackImage from '../../assets/beranda/item_1.jpg'

const STATUS_LABEL = {
  TERSEDIA: 'Tersedia',
  DISEWA: 'Disewa',
  MAINTENANCE: 'Pemeliharaan'
}

/**
 * Kartu alat pada katalog beranda penyewa.
 *
 * Seluruh props berasal dari baris tabel `Equipment` (lihat API
 * `GET /api/equipments`) — tidak ada data dummy statis di sini.
 */
export default function ProductCard({
  id,
  name = '',
  category = '',
  pricePerDay = 0,
  deposit = 0,
  powerWatt = 0,
  maintenanceBufferDays = 1,
  distance = 0,
  status = 'TERSEDIA',
  images = [],
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

  const image = images?.[0] || fallbackImage
  const meta = `${powerWatt} Watt · Min. ${maintenanceBufferDays} Hari`
  const statusLabel = STATUS_LABEL[status] || status

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
            onError={(e) => {
              e.currentTarget.src = fallbackImage
            }}
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
            {statusLabel}
          </span>
        </div>

        {/* Category Badge */}
        {category && (
          <div className="box-border w-fit h-fit absolute right-3 top-3 flex flex-row gap-0 py-[5px] px-2.5 justify-start items-start bg-white/95 backdrop-blur rounded-full shadow-2xs z-10">
            <span className="text-[11px] text-blue-700 font-semibold whitespace-nowrap">
              {category}
            </span>
          </div>
        )}

        {/* Distance Badge */}
        <div className="box-border w-fit h-fit absolute left-3 top-[130px] flex flex-row gap-[5px] py-1 px-[9px] justify-start items-center bg-white/95 backdrop-blur rounded-full shadow-2xs z-10">
          <MapPin className="w-[11px] h-[11px] text-slate-600" />
          <span className="text-[11px] text-slate-600 font-semibold tabular-nums whitespace-nowrap">
            {Number(distance).toLocaleString('id-ID')} km
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
            {formatRupiah(pricePerDay)}
          </div>
          <div className="text-xs text-slate-500 font-normal text-left whitespace-nowrap pb-0.5">
            /hari
          </div>
        </div>

        {/* Deposit Info */}
        <div className="text-[11px] text-slate-500 font-medium tabular-nums text-left whitespace-nowrap">
          Deposit: {formatRupiah(deposit)} (100% kembali)
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
