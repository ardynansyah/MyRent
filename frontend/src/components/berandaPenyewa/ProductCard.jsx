import React from 'react'
import { formatRupiah } from '../../lib/equipmentsApi'
import fallbackImage from '../../assets/beranda/item_1.jpg'

/**
 * Kartu produk bergaya modern minimalis (Apple Store style)
 */
export default function ProductCard({
  id,
  name = '',
  category = '',
  pricePerDay = 0,
  deposit = 0,
  powerWatt = 0,
  minRentDays,
  maintenanceBufferDays = 1,
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
  const minHari = minRentDays || maintenanceBufferDays || 1

  const specs = [
    category,
    powerWatt ? `${powerWatt} Watt` : null,
    minHari ? `Min. ${minHari} Hari` : null
  ]
    .filter(Boolean)
    .join(' • ')

  return (
    <div
      onClick={handleCardClick}
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer w-full group"
    >
      <div>
        {/* Gambar dalam kontainer tersendiri tanpa badge */}
        <div className="bg-slate-50 rounded-xl overflow-hidden mb-4 aspect-[4/3] flex items-center justify-center">
          <img
            src={image}
            alt={name}
            onError={(e) => {
              e.currentTarget.src = fallbackImage
            }}
            className="object-cover size-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Judul */}
        <h3 className="text-lg font-bold text-foreground line-clamp-1 m-0">
          {name}
        </h3>

        {/* Spesifikasi: 1 baris abu-abu */}
        <p className="text-sm text-muted-foreground truncate m-0 mt-1">
          {specs}
        </p>

        {/* Harga & Deposit */}
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-foreground tracking-tight tabular-nums">
              {formatRupiah(pricePerDay)}
            </span>
            <span className="text-xs text-muted-foreground font-normal">/hari</span>
          </div>
          {deposit > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
              Deposit: {formatRupiah(deposit)}
            </p>
          )}
        </div>
      </div>

      {/* Tombol Sewa */}
      <button
        type="button"
        onClick={handleButtonClick}
        className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 font-semibold transition-colors cursor-pointer border-0 mt-4 active:scale-[0.99]"
      >
        Sewa
      </button>
    </div>
  )
}
