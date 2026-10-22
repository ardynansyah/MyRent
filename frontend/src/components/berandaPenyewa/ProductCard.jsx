import React from 'react'
import { formatRupiah } from '../../lib/equipmentsApi'
import fallbackImage from '../../assets/beranda/item_1.jpg'

const STATUS_LABEL = {
  TERSEDIA: 'Tersedia',
  DISEWA: 'Disewa',
  MAINTENANCE: 'Pemeliharaan'
}

/**
 * Kartu alat pada katalog beranda penyewa bergaya e-commerce modern & minimalis.
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
  const statusLabel = STATUS_LABEL[status] || status

  // Gabungan info spesifikasi: Kategori • Daya Listrik • Min Sewa
  const specs = [
    category,
    powerWatt ? `${powerWatt} Watt` : null,
    maintenanceBufferDays ? `Min. ${maintenanceBufferDays} Hari` : null
  ]
    .filter(Boolean)
    .join(' • ')

  return (
    <div
      onClick={handleCardClick}
      className="group bg-card text-card-foreground rounded-2xl border border-border/60 p-3.5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer w-full"
    >
      {/* Gambar Produk: rounded di semua sudut di dalam padding kartu */}
      <div className="relative w-full h-48 bg-muted rounded-xl overflow-hidden shrink-0">
        <img
          src={image}
          alt={name}
          onError={(e) => {
            e.currentTarget.src = fallbackImage
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {status && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 backdrop-blur-xs text-slate-700 shadow-xs">
            {statusLabel}
          </span>
        )}

        {distance > 0 && (
          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/95 backdrop-blur-xs text-slate-600 shadow-xs tabular-nums">
            {Number(distance).toLocaleString('id-ID')} km
          </span>
        )}
      </div>

      {/* Konten Kartu */}
      <div className="pt-3.5 px-1 pb-1 flex flex-col flex-1 justify-between gap-3.5">
        <div className="flex flex-col gap-1">
          {/* Judul Nama Alat */}
          <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors m-0">
            {name}
          </h3>

          {/* Spesifikasi (Subteks) */}
          <p className="text-sm text-muted-foreground truncate m-0">
            {specs}
          </p>

          {/* Harga */}
          <div className="mt-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-foreground tracking-tight tabular-nums">
                {formatRupiah(pricePerDay)}
              </span>
              <span className="text-xs text-muted-foreground font-normal">/hari</span>
            </div>
            {deposit > 0 && (
              <span className="text-[11px] text-muted-foreground/80 block mt-0.5 tabular-nums">
                Deposit: {formatRupiah(deposit)} (100% kembali)
              </span>
            )}
          </div>
        </div>

        {/* Tombol Sewa */}
        <button
          type="button"
          onClick={handleButtonClick}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-2.5 font-semibold text-sm transition-colors cursor-pointer border-0 shadow-xs active:scale-[0.99] mt-1"
        >
          Sewa
        </button>
      </div>
    </div>
  )
}
