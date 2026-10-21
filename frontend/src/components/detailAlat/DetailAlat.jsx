import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Info, Loader2, MapPin, ShieldCheck, TriangleAlert } from 'lucide-react'
import NavbarPenyewa from '../common/NavbarPenyewa'
import ImageGallery from './ImageGallery'
import SpecGrid from './SpecGrid'
import WarningBanner from './WarningBanner'
import AvailabilityCalendar from './AvailabilityCalendar'
import CheckoutPanel from './CheckoutPanel'
import { formatRupiah, getEquipment } from '../../lib/equipmentsApi'
import { getSessionUser, getUserInitials, getUserPowerLimit } from '../../lib/userSession'
import { diffDays, formatLongDate } from '../../lib/dateHelpers'

const STATUS_LABEL = {
  TERSEDIA: 'Tersedia',
  DISEWA: 'Disewa',
  MAINTENANCE: 'Pemeliharaan'
}

// Bulan kalender ketersediaan alat (Juni 2025), 0-based.
const CALENDAR_YEAR = 2025
const CALENDAR_MONTH = 5

export default function DetailAlat({
  onBack,
  onNavigateHome,
  onAjukanSewa
}) {
  const { id } = useParams()

  const [equipment, setEquipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Seleksi tanggal sewa (dikendalikan dari AvailabilityCalendar) ──────
  const [selectionStart, setSelectionStart] = useState(null)
  const [selectionEnd, setSelectionEnd] = useState(null)
  const [dateWarning, setDateWarning] = useState(false)
  const [showPowerModal, setShowPowerModal] = useState(false)

  // Kapasitas daya listrik usaha penyewa (dari sesi login di localStorage).
  const user = getSessionUser()
  const userPowerLimit = getUserPowerLimit(user)

  // ── Ambil detail alat dari backend ──────────────────────────────────────
  useEffect(() => {
    let isActive = true

    const loadEquipment = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getEquipment(id)
        if (isActive) setEquipment(data)
      } catch (err) {
        if (isActive) {
          setEquipment(null)
          setError(err.message || 'Gagal memuat detail alat')
        }
      } finally {
        if (isActive) setLoading(false)
      }
    }

    if (id) {
      loadEquipment()
    } else {
      setError('ID alat tidak ditemukan pada URL')
      setLoading(false)
    }

    return () => {
      isActive = false
    }
  }, [id])

  const minRentDays = equipment?.minRentDays || equipment?.maintenanceBufferDays || 1
  const isSingleDayValid = minRentDays === 1 && selectionStart && !selectionEnd

  // Rentang sewa terpilih → jumlah hari & teks tanggal untuk panel checkout.
  const rentalDays =
    selectionStart && selectionEnd
      ? Math.max(1, diffDays(selectionStart, selectionEnd) + 1)
      : isSingleDayValid
      ? 1
      : 0

  const startDateFormatted = selectionStart ? formatLongDate(selectionStart) : 'Pilih tanggal'
  const endDateFormatted = selectionEnd
    ? formatLongDate(selectionEnd)
    : isSingleDayValid
    ? formatLongDate(selectionStart)
    : startDateFormatted

  // Kalender memberi tahu perubahan rentang (termasuk reset saat klik ulang).
  const handleSelectionChange = (start, end) => {
    setSelectionStart(start)
    setSelectionEnd(end)
    setDateWarning(false)
  }

  // Badge & info turunan dari baris database.
  const badges = useMemo(() => {
    if (!equipment) return []
    return [
      `Jeda rawat ${equipment.maintenanceBufferDays} hari`,
      'Ambil sendiri',
      'Kurir toko',
      'BAST digital'
    ]
  }, [equipment])

  const ownerInitials = equipment?.owner ? getUserInitials(equipment.owner) : '?'

  // Alat membutuhkan daya lebih besar dari kapasitas listrik usaha penyewa.
  const isPowerExceeded =
    Boolean(equipment) &&
    userPowerLimit !== null &&
    equipment.powerWatt > userPowerLimit

  if (loading) {
    return (
      <div className="box-border w-full min-h-screen flex flex-col justify-center items-center gap-3 bg-slate-50">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-600">Memuat detail alat…</p>
      </div>
    )
  }

  if (error || !equipment) {
    return (
      <div className="box-border w-full min-h-screen flex flex-col justify-center items-center gap-3 bg-slate-50 px-4 text-center">
        <TriangleAlert className="w-6 h-6 text-amber-600" />
        <h1 className="text-base font-bold text-slate-900">Detail alat tidak dapat dimuat</h1>
        <p className="text-xs text-slate-600">{error || 'Alat tidak ditemukan'}</p>
        <button
          type="button"
          onClick={onBack || onNavigateHome}
          className="mt-2 text-xs font-semibold text-blue-600 hover:underline bg-transparent border-0 cursor-pointer"
        >
          Kembali ke Jelajahi Alat
        </button>
      </div>
    )
  }

  const statusLabel = STATUS_LABEL[equipment.status] || equipment.status

  return (
    <div className="box-border w-full min-h-screen flex flex-col justify-start items-start bg-slate-50">
      {/* 1. Global Navigation Bar */}
      <NavbarPenyewa
        activeTab="jelajahi"
        dateRange="12 – 15 Jun"
        walletBalance="Rp 1.250.000"
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
            images={equipment.images}
            status={statusLabel}
            distance={`${Number(equipment.distance).toLocaleString('id-ID')} km`}
          />

          {/* Title and Meta Header */}
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-2.5 justify-start items-start bg-white ring-1 ring-slate-200 rounded-2xl p-5">
            <div className="box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-4 justify-between items-start">
              {/* Left Info */}
              <div className="box-border flex-1 h-fit flex flex-col gap-1.5 justify-start items-start">
                <span className="text-[11px] text-blue-600 font-bold tracking-[0.4px] uppercase whitespace-nowrap">
                  {equipment.category}
                </span>

                <h1 className="text-[22px] sm:text-[28px] leading-tight text-slate-900 font-extrabold tracking-[-0.8px] text-left m-0">
                  {equipment.name}
                </h1>

                {/* Meta details: status, lokasi, verifikasi */}
                <div className="box-border w-full h-fit shrink-0 flex flex-wrap gap-3.5 items-center pt-1 text-xs">
                  {/* Status */}
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="font-semibold">{statusLabel}</span>
                  </div>

                  <span className="text-slate-300">•</span>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-slate-600 tabular-nums">
                    <MapPin className="w-3.25 h-3.25 text-slate-400" />
                    <span>
                      {Number(equipment.distance).toLocaleString('id-ID')} km · {equipment.location}
                    </span>
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
                    {formatRupiah(equipment.pricePerDay)}
                  </span>
                  <span className="text-xs text-slate-500 font-normal pb-1 whitespace-nowrap">
                    /hari
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium tabular-nums whitespace-nowrap">
                  Deposit {formatRupiah(equipment.deposit)}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <SpecGrid
            power={`${equipment.powerWatt} W`}
            rawPower={equipment.powerWatt}
            userPowerLimit={userPowerLimit ?? 0}
            weight={`${equipment.weightKg} kg`}
            dimensions={equipment.dimensions}
            maintenanceBuffer={`${equipment.maintenanceBufferDays} Hari`}
          />

          {/* Warning Banner (Shown when tool power exceeds user's power) */}
          {isPowerExceeded && (
            <WarningBanner
              requiredWatt={equipment.powerWatt}
              userWatt={userPowerLimit}
              onActionClick={() => setShowPowerModal(true)}
            />
          )}

          {/* Highlight Peringatan Minimal Sewa */}
          <div className="box-border w-full flex flex-row gap-2.5 p-3.5 justify-start items-center bg-blue-50/80 ring-1 ring-blue-200 rounded-[12px]">
            <Info className="w-4 h-4 shrink-0 text-blue-600" />
            <p className="text-xs text-blue-900 font-medium m-0">
              Pilih tanggal sewa di kalender. Minimal sewa:{' '}
              <span className="font-bold">{minRentDays} Hari</span>
            </p>
          </div>

          {/* Availability Calendar */}
          <AvailabilityCalendar
            monthTitle="Ketersediaan Juni 2025"
            year={CALENDAR_YEAR}
            month={CALENDAR_MONTH}
            minRentDays={minRentDays}
            selectionStart={selectionStart}
            selectionEnd={selectionEnd}
            onSelectionChange={handleSelectionChange}
          />

          {/* About / Description Card */}
          <div className="box-border w-full h-fit shrink-0 flex flex-col gap-3 p-5 justify-start items-start bg-white ring-1 ring-slate-200 rounded-[14px]">
            <h2 className="text-sm text-slate-900 font-bold text-left whitespace-nowrap m-0">
              Tentang alat ini
            </h2>
            <p className="text-xs leading-5 w-full text-slate-600 font-normal text-left m-0">
              {equipment.description}
            </p>

            {/* Badges */}
            <div className="box-border w-full h-fit shrink-0 flex flex-wrap gap-2 justify-start items-start pt-1">
              {badges.map((badge) => (
                <div
                  key={badge}
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

        {/* Right Column: Checkout Panel + Owner Card
            `self-stretch` memberi ruang gulir pada kolom kanan supaya wrapper
            sticky di bawah benar-benar bisa bergerak (bukan terkunci statis). */}
        <section className="box-border w-full lg:w-105 shrink-0 self-stretch flex flex-col justify-start items-start">
          {/* Wrapper sticky tunggal: CheckoutPanel + Profil Toko digabung agar
              keduanya menggulir bersamaan dan tidak saling menimpa. */}
          <div className="box-border sticky top-24 w-full h-fit flex flex-col gap-4 justify-start items-start">
            {/* Peringatan: rentang tanggal belum lengkap */}
            {dateWarning && (
              <div className="box-border w-full flex flex-row gap-2 p-3 justify-start items-start bg-amber-50 ring-1 ring-amber-200 rounded-[10px]">
                <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <p className="text-[11px] leading-4 text-amber-700 font-normal text-left m-0">
                  Pilih tanggal mulai &amp; selesai sewa di kalender sebelum mengajukan sewa.
                </p>
              </div>
            )}

            {/* Checkout & Rental Calculation Panel */}
            <CheckoutPanel
              dailyPrice={equipment.pricePerDay}
              depositAmount={equipment.deposit}
              rentalDays={rentalDays}
              startDateText={startDateFormatted}
              endDateText={endDateFormatted}
              ownerAddress={`${equipment.location} (${Number(equipment.distance).toLocaleString('id-ID')} km)`}
              onAjukanSewa={(checkoutData) => {
                // Tanggal belum lengkap → jangan kirim pengajuan.
                const isReady = (selectionStart && selectionEnd) || isSingleDayValid
                if (!isReady) {
                  setDateWarning(true)
                  return
                }

                setDateWarning(false)
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
                  {ownerInitials}
                </span>
              </div>

              {/* Owner Meta */}
              <div className="box-border flex-1 h-fit flex flex-col gap-0.5 justify-start items-start">
                <div className="text-xs text-slate-900 font-bold text-left whitespace-nowrap">
                  {equipment.owner?.fullName || 'Pemilik Alat'}
                </div>
                <div className="text-[10px] text-slate-400 font-normal text-left whitespace-nowrap">
                  {equipment.owner?.email || '-'}
                </div>
              </div>

              {/* Verified Badge */}
              {equipment.owner?.verificationStatus === 'DISETUJUI' && (
                <div className="box-border w-fit shrink-0 h-fit flex flex-row py-1.25 px-2.5 justify-start items-center bg-green-50 rounded-full">
                  <span className="text-[11px] text-green-700 font-semibold whitespace-nowrap">
                    Terverifikasi
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Optional: Update Power Modal Demo */}
      {showPowerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Perbarui Daya Listrik UMKM</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Daya terdaftar saat ini: <strong>{userPowerLimit} W</strong>. Anda dapat mengajukan penyesuaian daya listrik tempat usaha atau sewa genset tambahan.
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
