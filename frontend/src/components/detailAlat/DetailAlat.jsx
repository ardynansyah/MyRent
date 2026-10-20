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
    <div className="box-border w-full min-h-screen flex flex-col justify-start items-start bg-[#F8FAFC]">
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
      <main className="box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col lg:flex-row gap-[24px] py-[28px] px-4 md:px-[32px] pb-[48px] justify-start items-start">
        {/* Left Column: Media, Specs, Warning, Calendar, Description */}
        <section className="box-border flex-1 min-w-0 w-full h-fit flex flex-col gap-[22px] justify-start items-start">
          {/* Breadcrumb Navigation */}
          <nav className="box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center text-[11px]">
            <button
              type="button"
              onClick={onBack || onNavigateHome}
              className="text-[#475569] font-normal hover:text-[#2563EB] cursor-pointer bg-transparent border-0 p-0"
            >
              Jelajahi Alat
            </button>
            <span className="text-[#94A3B8]">/</span>
            <span className="text-[#475569] font-normal">{equipment.category}</span>
            <span className="text-[#94A3B8]">/</span>
            <span className="text-[#0F172A] font-semibold truncate max-w-[200px] sm:max-w-none">
              {equipment.name}
            </span>
          </nav>

          {/* Image Gallery */}
          <ImageGallery
            distance={equipment.distance}
            status="Tersedia"
          />

          {/* Title and Meta Header */}
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] justify-start items-start bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[16px] p-[20px]">
            <div className="box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-4 justify-between items-start">
              {/* Left Info */}
              <div className="box-border flex-1 h-fit flex flex-col gap-[6px] justify-start items-start">
                <span className="text-[11px] text-[#2563EB] font-bold tracking-[0.4px] uppercase whitespace-nowrap">
                  {equipment.category} · {equipment.subcategory}
                </span>

                <h1 className="text-[22px] sm:text-[28px] leading-tight text-[#0F172A] font-extrabold tracking-[-0.8px] text-left m-0">
                  {equipment.name}
                </h1>

                {/* Meta details: rating, distance, verification */}
                <div className="box-border w-full h-fit shrink-0 flex flex-wrap gap-[14px] items-center pt-1 text-[12px]">
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[#0F172A] font-bold tabular-nums">
                    <Star className="w-[14px] h-[14px] text-amber-500 fill-amber-500" />
                    <span>{equipment.rating}</span>
                    <span className="text-slate-500 font-normal">({equipment.reviewCount} ulasan)</span>
                  </div>

                  <span className="text-slate-300">•</span>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-[#475569] tabular-nums">
                    <MapPin className="w-[13px] h-[13px] text-[#94A3B8]" />
                    <span>{equipment.distance} · {equipment.district}</span>
                  </div>

                  <span className="text-slate-300">•</span>

                  {/* Verified Owner */}
                  <div className="flex items-center gap-1.5 text-[#475569]">
                    <ShieldCheck className="w-[13px] h-[13px] text-[#2563EB]" />
                    <span>Pemilik terverifikasi</span>
                  </div>
                </div>
              </div>

              {/* Price Box */}
              <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start sm:items-end">
                <div className="box-border w-fit h-fit shrink-0 flex flex-row gap-[4px] justify-start items-end">
                  <span className="text-[24px] sm:text-[26px] text-[#0F172A] font-extrabold tracking-tight tabular-nums whitespace-nowrap">
                    {formatRupiah(equipment.dailyPrice)}
                  </span>
                  <span className="text-[12px] text-slate-500 font-normal pb-1 whitespace-nowrap">
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
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[14px]">
            <h2 className="text-[14px] text-[#0F172A] font-bold text-left whitespace-nowrap m-0">
              Tentang alat ini
            </h2>
            <p className="text-[12px] leading-[20px] w-full text-[#475569] font-normal text-left m-0">
              {equipment.about}
            </p>

            {/* Badges */}
            <div className="box-border w-full h-fit shrink-0 flex flex-wrap gap-[8px] justify-start items-start pt-1">
              {equipment.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="box-border w-fit shrink-0 h-fit flex flex-row py-[5px] px-[10px] justify-start items-center bg-[#F8FAFC] ring-1 ring-[#E2E8F0] rounded-full"
                >
                  <span className="text-[11px] text-[#475569] font-semibold whitespace-nowrap">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Checkout Panel + Owner Card */}
        <section className="box-border w-full lg:w-[420px] shrink-0 h-fit flex flex-col gap-[14px] justify-start items-start">
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
          <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[16px] justify-start items-center bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[14px]">
            {/* Owner Initials Avatar */}
            <div className="box-border w-[40px] shrink-0 h-[40px] flex flex-row justify-center items-center bg-[#EFF6FF] rounded-full">
              <span className="text-[13px] text-[#1D4ED8] font-bold whitespace-nowrap">
                {equipment.owner.initials}
              </span>
            </div>

            {/* Owner Meta */}
            <div className="box-border flex-1 h-fit flex flex-col gap-[2px] justify-start items-start">
              <div className="text-[12px] text-[#0F172A] font-bold text-left whitespace-nowrap">
                {equipment.owner.name}
              </div>
              <div className="text-[10px] text-[#94A3B8] font-normal text-left whitespace-nowrap">
                {equipment.owner.stats}
              </div>
            </div>

            {/* Verified Badge */}
            {equipment.owner.verified && (
              <div className="box-border w-fit shrink-0 h-fit flex flex-row py-[5px] px-[10px] justify-start items-center bg-[#F0FDF4] rounded-full">
                <span className="text-[11px] text-[#15803D] font-semibold whitespace-nowrap">
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
                className="px-4 py-2 text-xs font-semibold bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 cursor-pointer"
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
