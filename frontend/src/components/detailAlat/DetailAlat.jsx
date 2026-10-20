import React, { useState } from 'react'
import { MapPin, ShieldCheck, Star } from 'lucide-react'
import NavbarPenyewa from '../common/NavbarPenyewa'
import ImageGallery from './ImageGallery'
import SpecGrid from './SpecGrid'
import WarningBanner from './WarningBanner'
import AvailabilityCalendar from './AvailabilityCalendar'
import CheckoutPanel from './CheckoutPanel'

// Default equipment data matching DetailAlat-export.html
const DEFAULT_EQUIPMENT = {
  id: 7,
  category: 'Mesin Kopi',
  subcategory: 'Espresso Machine',
  name: 'Mesin Espresso Otomatis 2 Grup',
  rating: '4.9',
  reviewCount: 18,
  distance: '6.5 km',
  district: 'Kec. Cilandak',
  isVerifiedOwner: true,
  dailyPrice: 320000,
  depositAmount: 1200000,
  powerWatt: 2200,
  weight: '34 kg',
  dimensions: '40 × 53 × 35 cm',
  maintenanceBuffer: '1 Hari',
  userPowerLimit: 1300,
  about:
    'Mesin espresso 2 grup dengan sistem PID dan dual boiler, stabil untuk produksi 150–200 cangkir per hari. Sudah termasuk portafilter, tamper, dan pitcher susu. Perawatan rutin dilakukan setiap 3 bulan oleh teknisi pemilik.',
  badges: ['Min. 3 hari', 'Ambil sendiri', 'Kurir toko', 'BAST digital'],
  owner: {
    initials: 'KS',
    name: 'Kopi Senja Roastery',
    stats: '34 alat disewakan · 4.9 rating',
    verified: true
  }
}

export default function DetailAlat({
  equipment = DEFAULT_EQUIPMENT,
  onBack,
  onNavigateHome,
  onAjukanSewa
}) {
  const [selectedRange, setSelectedRange] = useState([12, 15])
  const [showPowerModal, setShowPowerModal] = useState(false)

  const rentalDays =
    selectedRange.length === 2
      ? Math.max(1, selectedRange[1] - selectedRange[0] + 1)
      : 1

  const startDateFormatted = selectedRange.length >= 1 ? `Kam, ${selectedRange[0]} Jun 2025` : 'Pilih tanggal'
  const endDateFormatted = selectedRange.length === 2 ? `Min, ${selectedRange[1]} Jun 2025` : startDateFormatted

  const formatRupiah = (val) => `Rp ${val.toLocaleString('id-ID')}`

  return (
    <div className="box-border w-full min-h-screen flex flex-col justify-start items-start bg-slate-50">
      {/* 1. Global Navigation Bar */}
      <NavbarPenyewa
        activeTab="jelajahi"
        userPower="1300 W"
        dateRange="12 – 15 Jun"
        walletBalance="Rp 1.250.000"
        userInitials="BS"
        onNavigateHome={onNavigateHome}
      />

      {/* 2. Main Detail Page Layout: Two Columns */}
      <main className="box-border w-full max-w-360 mx-auto h-fit flex flex-col lg:flex-row gap-6 py-7 px-4 md:px-8 pb-12 justify-start items-start">
        {/* Left Column: Media, Specs, Warning, Calendar, Description */}
        <section className="box-border flex-1 min-w-0 w-full h-fit flex flex-col gap-5.5 justify-start items-start">
          {/* Breadcrumb Navigation */}
          <nav className="box-border w-fit h-fit shrink-0 flex flex-row gap-2 justify-start items-center text-[11px]">
            <button
              type="button"
              onClick={onBack || onNavigateHome}
              className="text-slate-600 font-normal hover:text-blue-600 cursor-pointer bg-transparent border-0 p-0"
            >
              Jelajahi Alat
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600 font-normal">{equipment.category}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-semibold truncate max-w-50 sm:max-w-none">
              {equipment.name}
            </span>
          </nav>

          {/* Image Gallery */}
          <ImageGallery
            distance={equipment.distance}
            status="Tersedia"
          />

          {/* Title and Meta Header */}
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-2.5 justify-start items-start bg-white ring-1 ring-slate-200 rounded-2xl p-5">
            <div className="box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-4 justify-between items-start">
              {/* Left Info */}
              <div className="box-border flex-1 h-fit flex flex-col gap-1.5 justify-start items-start">
                <span className="text-[11px] text-blue-600 font-bold tracking-[0.4px] uppercase whitespace-nowrap">
                  {equipment.category} · {equipment.subcategory}
                </span>

                <h1 className="text-[22px] sm:text-[28px] leading-tight text-slate-900 font-extrabold tracking-[-0.8px] text-left m-0">
                  {equipment.name}
                </h1>

                {/* Meta details: rating, distance, verification */}
                <div className="box-border w-full h-fit shrink-0 flex flex-wrap gap-3.5 items-center pt-1 text-xs">
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-slate-900 font-bold tabular-nums">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{equipment.rating}</span>
                    <span className="text-slate-500 font-normal">({equipment.reviewCount} ulasan)</span>
                  </div>

                  <span className="text-slate-300">•</span>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-slate-600 tabular-nums">
                    <MapPin className="w-3.25 h-3.25 text-slate-400" />
                    <span>{equipment.distance} · {equipment.district}</span>
                  </div>

                  <span className="text-slate-300">•</span>

                  {/* Verified Owner */}
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <ShieldCheck className="w-3.25 h-3.25 text-blue-600" />
                    <span>Pemilik terverifikasi</span>
                  </div>
                </div>
              </div>

              {/* Price Box */}
              <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-0.5 justify-start sm:items-end">
                <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-1 justify-start items-end">
                  <span className="text-2xl sm:text-[26px] text-slate-900 font-extrabold tracking-tight tabular-nums whitespace-nowrap">
                    {formatRupiah(equipment.dailyPrice)}
                  </span>
                  <span className="text-xs text-slate-500 font-normal pb-1 whitespace-nowrap">
                    /hari
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium tabular-nums whitespace-nowrap">
                  Deposit {formatRupiah(equipment.depositAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <SpecGrid
            power={`${equipment.powerWatt} W`}
            rawPower={equipment.powerWatt}
            userPowerLimit={equipment.userPowerLimit}
            weight={equipment.weight}
            dimensions={equipment.dimensions}
            maintenanceBuffer={equipment.maintenanceBuffer}
          />

          {/* Warning Banner (Shown when tool power exceeds user's power) */}
          {equipment.powerWatt > equipment.userPowerLimit && (
            <WarningBanner
              requiredWatt={equipment.powerWatt}
              userWatt={equipment.userPowerLimit}
              onActionClick={() => setShowPowerModal(true)}
            />
          )}

          {/* Availability Calendar */}
          <AvailabilityCalendar
            monthTitle="Ketersediaan Juni 2025"
            selectedRange={selectedRange}
            onSelectRange={setSelectedRange}
          />

          {/* About / Description Card */}
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-3 p-5 justify-start items-start bg-white ring-1 ring-slate-200 rounded-[14px]">
            <h2 className="text-sm text-slate-900 font-bold text-left whitespace-nowrap m-0">
              Tentang alat ini
            </h2>
            <p className="text-xs leading-5 w-full text-slate-600 font-normal text-left m-0">
              {equipment.about}
            </p>

            {/* Badges */}
            <div className="box-border w-full h-fit shrink-0 flex flex-wrap gap-2 justify-start items-start pt-1">
              {equipment.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="box-border w-fit shrink-0 h-fit flex flex-row py-1.25 px-2.5 justify-start items-center bg-slate-50 ring-1 ring-slate-200 rounded-full"
                >
                  <span className="text-[11px] text-slate-600 font-semibold whitespace-nowrap">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Checkout Panel + Owner Card */}
        <section className="box-border w-full lg:w-105 shrink-0 h-fit flex flex-col gap-3.5 justify-start items-start">
          {/* Checkout & Rental Calculation Panel */}
          <CheckoutPanel
            dailyPrice={equipment.dailyPrice}
            depositAmount={equipment.depositAmount}
            rentalDays={rentalDays}
            startDateText={startDateFormatted}
            endDateText={endDateFormatted}
            ownerAddress={`${equipment.district} (${equipment.distance})`}
            onAjukanSewa={(checkoutData) => {
              if (onAjukanSewa) onAjukanSewa(checkoutData)
              else {
                alert(`Pengajuan sewa berhasil dibuat untuk ${equipment.name}!`)
              }
            }}
          />

          {/* Owner Profile Card */}
          <div className="box-border w-full h-fit shrink-0 flex flex-row gap-3 p-4 justify-start items-center bg-white ring-1 ring-slate-200 rounded-[14px]">
            {/* Owner Initials Avatar */}
            <div className="box-border w-10 shrink-0 h-10 flex flex-row justify-center items-center bg-blue-50 rounded-full">
              <span className="text-[13px] text-blue-700 font-bold whitespace-nowrap">
                {equipment.owner.initials}
              </span>
            </div>

            {/* Owner Meta */}
            <div className="box-border flex-1 h-fit flex flex-col gap-0.5 justify-start items-start">
              <div className="text-xs text-slate-900 font-bold text-left whitespace-nowrap">
                {equipment.owner.name}
              </div>
              <div className="text-[10px] text-slate-400 font-normal text-left whitespace-nowrap">
                {equipment.owner.stats}
              </div>
            </div>

            {/* Verified Badge */}
            {equipment.owner.verified && (
              <div className="box-border w-fit shrink-0 h-fit flex flex-row py-1.25 px-2.5 justify-start items-center bg-green-50 rounded-full">
                <span className="text-[11px] text-green-700 font-semibold whitespace-nowrap">
                  Terverifikasi
                </span>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Optional: Update Power Modal Demo */}
      {showPowerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Perbarui Daya Listrik UMKM</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Daya terdaftar saat ini: <strong>1300 W</strong>. Anda dapat mengajukan penyesuaian daya listrik tempat usaha atau sewa genset tambahan.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPowerModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Data kapasitas listrik telah diperbarui!')
                  setShowPowerModal(false)
                }}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Simpan Penyesuaian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
