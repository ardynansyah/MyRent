/**
 * CheckoutStep1.jsx — Rincian Sewa
 *
 * Fitur:
 *  - Data alat & pemilik dari backend (GET /api/equipments/:id)
 *  - Jadwal sewa interaktif (bisa ubah via AvailabilityCalendar)
 *  - Metode serah terima: Ambil sendiri / Diantar kurir
 *  - Layanan tambahan (Add-ons): Asuransi, Operator, Antar-jemput
 *  - Kode promo live (validasi ke backend, tampil potongan di Ringkasan)
 *  - Bagian "Yang perlu disiapkan": status KYC, deposit, nama penyewa
 *  - Ringkasan Biaya real-time di sidebar kanan
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Loader2, TriangleAlert, MapPin, Zap, ChevronRight,
  CheckCircle2, Tag, MessageCircle, Info, ShieldCheck, Clock
} from 'lucide-react'
import NavbarPenyewa from '../common/NavbarPenyewa'
import AvailabilityCalendar from '../detailAlat/AvailabilityCalendar'
import { getEquipment, formatRupiah } from '../../lib/equipmentsApi'
import { validatePromo } from '../../lib/ordersApi'
import { getSessionUser } from '../../lib/userSession'
import {
  diffDays, formatLongDate, normalizeDate,
  isEquipmentAvailableInRange
} from '../../lib/dateHelpers'

// ── Konstanta Add-ons ──────────────────────────────────────────────────────────
const ADDON_OPTIONS = [
  { id: 'insurance', label: 'Asuransi kerusakan alat', price: 45000, icon: '🛡️', desc: 'Perlindungan kerusakan selama masa sewa' },
  { id: 'operator', label: 'Operator & instalasi', price: 150000, icon: '🔧', desc: 'Teknisi ahli membantu instalasi & operasional' },
  { id: 'pickup', label: 'Antar-jemput dua arah', price: 90000, icon: '🚚', desc: 'Ongkir PP (kurir toko mengantarkan & menjemput)' }
]

const SHIPPING_COST = 45000

// ── Progress Steps ──────────────────────────────────────────────────────────
function WizardSteps({ current }) {
  const steps = ['Rincian Sewa', 'Kontrak Digital', 'Pembayaran Escrow']
  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((label, i) => {
        const stepNum = i + 1
        const isActive = stepNum === current
        const isDone = stepNum < current
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2 shrink-0">
              <div className={`w-[22px] h-[22px] flex items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-200 text-slate-400'
              }`}>
                {isDone ? '✓' : stepNum}
              </div>
              <span className={`text-[12px] font-${isActive ? 'bold' : 'medium'} ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-slate-200 mx-2" />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function CheckoutStep1({ wizardData, updateWizard, onNext }) {
  const navigate = useNavigate()
  const user = getSessionUser()
  const [equipment, setEquipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Kalender
  const [selectionStart, setSelectionStart] = useState(() => normalizeDate(wizardData.selectionStart))
  const [selectionEnd, setSelectionEnd] = useState(() => normalizeDate(wizardData.selectionEnd))
  const [showCalendar, setShowCalendar] = useState(false)
  const [dateWarning, setDateWarning] = useState(false)

  // Metode serah terima
  const [deliveryMethod, setDeliveryMethod] = useState(wizardData.deliveryMethod || 'PICKUP')

  // Add-ons
  const [selectedAddons, setSelectedAddons] = useState(wizardData.addons?.map(a => a.id) || [])

  // Promo
  const [promoInput, setPromoInput] = useState(wizardData.promoCode || '')
  const [promoData, setPromoData] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)

  // Chat owner modal
  const [showChat, setShowChat] = useState(false)

  // Ambil data alat
  useEffect(() => {
    if (!wizardData.equipmentId) {
      setError('ID alat tidak ditemukan')
      setLoading(false)
      return
    }
    let active = true
    getEquipment(wizardData.equipmentId)
      .then(data => { if (active) setEquipment(data) })
      .catch(err => { if (active) setError(err.message || 'Gagal memuat data alat') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [wizardData.equipmentId])

  // Hitung jumlah hari
  const rentalDays = useMemo(() => {
    if (selectionStart && selectionEnd) return Math.max(1, diffDays(selectionStart, selectionEnd) + 1)
    if (selectionStart && !selectionEnd) return 1
    return 0
  }, [selectionStart, selectionEnd])

  // Hitung biaya add-ons
  const addonsCost = useMemo(() => {
    return ADDON_OPTIONS
      .filter(a => selectedAddons.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0)
  }, [selectedAddons])

  // Logika ongkir: jika ada pickup add-on, ongkir dihapus karena sudah termasuk PP
  const effectiveShippingCost = useMemo(() => {
    if (deliveryMethod === 'PICKUP') return 0
    if (selectedAddons.includes('pickup')) return 0 // Antar-jemput dua arah sudah cover
    return SHIPPING_COST
  }, [deliveryMethod, selectedAddons])

  // Subtotal (sebelum promo)
  const rentalCost = (equipment?.pricePerDay || 0) * rentalDays
  const subtotal = rentalCost + effectiveShippingCost + addonsCost

  // Diskon promo
  const discountAmount = promoData?.discountAmount || 0

  // Total bayar (tanpa deposit - dibayar terpisah)
  const totalPayment = subtotal - discountAmount + (equipment?.deposit || 0)

  // Validasi promo
  const handleValidatePromo = async () => {
    if (!promoInput.trim()) return
    setPromoLoading(true)
    setPromoError('')
    try {
      const data = await validatePromo(promoInput.trim(), subtotal)
      setPromoData(data)
      updateWizard({ promoCode: promoInput.trim(), discountAmount: data.discountAmount })
    } catch (err) {
      setPromoError(err.message || 'Kode promo tidak valid')
      setPromoData(null)
    } finally {
      setPromoLoading(false)
    }
  }

  // Toggle add-on
  const toggleAddon = useCallback((addonId) => {
    setSelectedAddons(prev => {
      const next = prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
      return next
    })
  }, [])

  // Lanjut ke Step 2
  const handleNext = () => {
    if (rentalDays === 0) { setDateWarning(true); return }
    setDateWarning(false)

    const addons = ADDON_OPTIONS.filter(a => selectedAddons.includes(a.id))
    const patch = {
      selectionStart: selectionStart?.toISOString().slice(0, 10),
      selectionEnd: selectionEnd?.toISOString().slice(0, 10),
      deliveryMethod,
      addons,
      addonsCost,
      promoCode: promoData ? promoInput.trim() : '',
      discountAmount: promoData?.discountAmount || 0,
      rentalCost,
      shippingCost: effectiveShippingCost,
      depositAmount: equipment?.deposit || 0,
      totalPaid: totalPayment
    }
    updateWizard(patch)
    onNext(patch)
  }

  // KYC info penyewa
  const kycData = user?.kycData || {}
  const businessName = kycData.businessName || user?.fullName || 'UMKM Anda'
  const kycVerified = user?.verificationStatus === 'DISETUJUI'

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center gap-3">
      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
      <span className="text-sm text-slate-600">Memuat rincian sewa…</span>
    </div>
  )

  if (error || !equipment) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 px-4 text-center">
      <TriangleAlert className="w-6 h-6 text-amber-600" />
      <h1 className="text-base font-bold text-slate-900">Gagal memuat data alat</h1>
      <p className="text-xs text-slate-500">{error}</p>
      <button onClick={() => navigate('/beranda-sewa')} className="text-sm text-blue-600 font-semibold hover:underline mt-1">
        Kembali ke Katalog
      </button>
    </div>
  )

  const minRentDays = equipment.maintenanceBufferDays || 1
  const calYear = new Date().getFullYear()
  const calMonth = new Date().getMonth()

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top Bar */}
      <header className="w-full h-[68px] shrink-0 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center gap-3.5">
          <button onClick={() => navigate('/beranda-sewa')} className="text-[18px] text-blue-600 font-extrabold tracking-[-0.3px] cursor-pointer">
            SewaAlat
          </button>
          <div className="w-px h-[18px] bg-slate-200" />
          <span className="text-[13px] font-semibold text-slate-900">Checkout · Rincian sewa</span>
        </div>
        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">Langkah 1 dari 3</span>
      </header>

      <main className="w-full max-w-[1040px] mx-auto flex flex-col gap-5 py-7 px-4 md:px-0 pb-12">
        {/* Wizard Steps */}
        <WizardSteps current={1} />

        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* ── Left Column ────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4.5">

            {/* Alat & Jadwal Sewa */}
            <div className="bg-white ring-1 ring-slate-200 rounded-[14px] p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-bold text-slate-900">Alat &amp; jadwal sewa</h2>
                <button
                  onClick={() => setShowCalendar(v => !v)}
                  className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  {showCalendar ? 'Tutup kalender' : 'Ubah jadwal'}
                </button>
              </div>

              {/* Kartu alat mini */}
              <div className="flex gap-3.5 items-center">
                {equipment.images?.[0] && (
                  <img
                    src={equipment.images[0]}
                    alt={equipment.name}
                    className="w-[92px] h-[72px] rounded-[10px] object-cover shrink-0"
                  />
                )}
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className="text-[11px] text-blue-600 font-bold uppercase tracking-wide">{equipment.category}</span>
                  <span className="text-[13px] font-bold text-slate-900 leading-tight">{equipment.name}</span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3" /> {equipment.location}
                    <span className="text-slate-300">·</span>
                    <Zap className="w-3 h-3" /> {equipment.powerWatt} W
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[14px] font-extrabold text-slate-900">Rp {equipment.pricePerDay.toLocaleString('id-ID')}</div>
                  <div className="text-[11px] text-slate-400">/hari</div>
                </div>
              </div>

              {/* Jadwal banner */}
              <div className="bg-blue-50/80 ring-1 ring-blue-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[12px] text-slate-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    {rentalDays > 0 ? (
                      <>
                        <span>{formatLongDate(selectionStart)}</span>
                        <span className="text-slate-400">→</span>
                        <span>{formatLongDate(selectionEnd || selectionStart)}</span>
                      </>
                    ) : (
                      <span className="text-slate-500">Pilih tanggal sewa di kalender</span>
                    )}
                  </div>
                  {rentalDays > 0 && (
                    <div className="text-[11px] text-blue-700 font-semibold">
                      Durasi: {rentalDays} hari · 09:00 – 20:00 WIB
                    </div>
                  )}
                </div>
                {dateWarning && (
                  <div className="text-[11px] text-amber-700 font-semibold bg-amber-50 ring-1 ring-amber-200 px-2 py-1 rounded-lg">
                    Pilih tanggal dulu!
                  </div>
                )}
              </div>

              {/* Kalender */}
              {showCalendar && (
                <div className="mt-1">
                  <AvailabilityCalendar
                    monthTitle={`Ketersediaan ${new Date(calYear, calMonth).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}`}
                    year={calYear}
                    month={calMonth}
                    minRentDays={minRentDays}
                    selectionStart={selectionStart}
                    selectionEnd={selectionEnd}
                    equipment={equipment}
                    onSelectionChange={(start, end) => {
                      setSelectionStart(start)
                      setSelectionEnd(end)
                      setDateWarning(false)
                    }}
                  />
                </div>
              )}

              {/* Tombol Tanya Pemilik */}
              <button
                onClick={() => setShowChat(true)}
                className="flex items-center gap-2 text-[12px] font-semibold text-blue-700 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Tanya pemilik sebelum bayar
                <ChevronRight className="w-3.5 h-3.5 ml-auto" />
              </button>
            </div>

            {/* Metode Serah Terima */}
            <div className="bg-white ring-1 ring-slate-200 rounded-[14px] p-5 flex flex-col gap-4">
              <h2 className="text-[14px] font-bold text-slate-900">Metode serah terima</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'PICKUP', label: 'Ambil sendiri', desc: 'Ambil & kembalikan ke toko pemilik', cost: 0, icon: '🏪' },
                  { id: 'COURIER', label: 'Diantar kurir toko', desc: 'Kurir mengantar ke lokasi UMKM Anda', cost: 45000, icon: '🚚' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setDeliveryMethod(opt.id)}
                    className={`flex gap-3 p-4 rounded-xl ring-2 text-left transition-all cursor-pointer ${
                      deliveryMethod === opt.id
                        ? 'ring-blue-600 bg-blue-50'
                        : 'ring-slate-200 bg-white hover:ring-blue-300'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="text-[13px] font-bold text-slate-900">{opt.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                      <div className={`text-[12px] font-bold mt-1.5 ${opt.cost === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {opt.cost === 0 ? 'Gratis' : `+ Rp ${opt.cost.toLocaleString('id-ID')}`}
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 ${
                      deliveryMethod === opt.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                    }`}>
                      {deliveryMethod === opt.id && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-[2px]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Layanan Tambahan */}
            <div className="bg-white ring-1 ring-slate-200 rounded-[14px] p-5 flex flex-col gap-4">
              <div>
                <h2 className="text-[14px] font-bold text-slate-900">Layanan tambahan</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Pilih layanan opsional untuk pengalaman sewa lebih nyaman</p>
              </div>
              <div className="flex flex-col gap-2.5">
                {ADDON_OPTIONS.map(addon => {
                  const checked = selectedAddons.includes(addon.id)
                  // Info ekstra untuk antar-jemput jika sudah pilih kurir
                  const isPickupAddon = addon.id === 'pickup'
                  const addonNote = isPickupAddon && deliveryMethod === 'COURIER' && checked
                    ? '(menggantikan ongkir kurir)'
                    : ''
                  return (
                    <label
                      key={addon.id}
                      className={`flex gap-3 p-4 rounded-xl ring-1 cursor-pointer transition-all ${
                        checked ? 'ring-blue-400 bg-blue-50' : 'ring-slate-200 bg-white hover:ring-blue-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddon(addon.id)}
                        className="mt-0.5 accent-blue-600 w-4 h-4 shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span>{addon.icon}</span>
                          <span className="text-[13px] font-semibold text-slate-900">{addon.label}</span>
                          {addonNote && <span className="text-[10px] text-emerald-600 font-semibold">{addonNote}</span>}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{addon.desc}</div>
                      </div>
                      <div className="text-[12px] font-bold text-slate-700 shrink-0">
                        + Rp {addon.price.toLocaleString('id-ID')}
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Yang Perlu Disiapkan */}
            <div className="bg-white ring-1 ring-slate-200 rounded-[14px] p-5 flex flex-col gap-3">
              <h2 className="text-[14px] font-bold text-slate-900">Yang perlu disiapkan</h2>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <ShieldCheck className={`w-5 h-5 shrink-0 ${kycVerified ? 'text-emerald-500' : 'text-amber-500'}`} />
                  <div>
                    <div className="text-[12px] font-bold text-slate-900">
                      Verifikasi KYC {kycVerified ? '✓ Terverifikasi' : '⚠ Belum diverifikasi'}
                    </div>
                    <div className="text-[11px] text-slate-500">{businessName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 ring-1 ring-amber-200 rounded-xl">
                  <span className="text-lg">💰</span>
                  <div>
                    <div className="text-[12px] font-bold text-slate-900">
                      Deposit: Rp {(equipment?.deposit || 0).toLocaleString('id-ID')}
                    </div>
                    <div className="text-[11px] text-slate-500">Ditahan escrow, dikembalikan setelah alat kembali</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 bg-blue-50/60 ring-1 ring-blue-100 rounded-xl">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Anda akan menandatangani Kontrak Sewa Digital di langkah berikutnya. Pastikan data KYC sudah lengkap.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Ringkasan Biaya ───────────────────────────────── */}
          <div className="w-full lg:w-[340px] shrink-0 sticky top-24">
            <div className="bg-white ring-1 ring-slate-200 rounded-[14px] p-5 flex flex-col gap-4">
              <h2 className="text-[14px] font-bold text-slate-900">Ringkasan biaya</h2>

              {/* Detail baris biaya */}
              <div className="flex flex-col gap-2.5 text-[12px]">
                <div className="flex justify-between text-slate-600">
                  <span>Sewa alat ({rentalDays} hari × Rp {(equipment?.pricePerDay || 0).toLocaleString('id-ID')})</span>
                  <span className="font-semibold text-slate-900">Rp {rentalCost.toLocaleString('id-ID')}</span>
                </div>
                {effectiveShippingCost > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Ongkir kurir toko</span>
                    <span className="font-semibold text-slate-900">Rp {effectiveShippingCost.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {selectedAddons.map(addonId => {
                  const addon = ADDON_OPTIONS.find(a => a.id === addonId)
                  if (!addon) return null
                  return (
                    <div key={addonId} className="flex justify-between text-slate-600">
                      <span className="flex items-center gap-1">{addon.icon} {addon.label}</span>
                      <span className="font-semibold text-slate-900">Rp {addon.price.toLocaleString('id-ID')}</span>
                    </div>
                  )
                })}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Diskon promo ({promoData?.code})</span>
                    <span>− Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="h-px bg-slate-100 my-1" />
                <div className="flex justify-between text-slate-600">
                  <span>Deposit (ditahan escrow)</span>
                  <span className="font-semibold text-slate-900">Rp {(equipment?.deposit || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="h-px bg-slate-200 my-1" />
                <div className="flex justify-between text-slate-900 font-extrabold text-[14px]">
                  <span>Total Bayar</span>
                  <span className="text-blue-600">Rp {totalPayment.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Kode Promo */}
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" /> Kode Promo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoError('') }}
                    placeholder="UMKMAJU / SEWAHEMAT"
                    className="flex-1 px-3 py-2 text-[12px] bg-slate-50 ring-1 ring-slate-200 focus:ring-blue-500 rounded-lg outline-none font-mono transition-all"
                  />
                  <button
                    onClick={handleValidatePromo}
                    disabled={promoLoading || !promoInput.trim()}
                    className="px-3 py-2 text-[12px] font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors cursor-pointer shrink-0"
                  >
                    {promoLoading ? '...' : 'Pakai'}
                  </button>
                </div>
                {/* Demo hint */}
                <p className="text-[10px] text-slate-400">💡 Coba: <strong>UMKMAJU</strong> (Rp 50rb) atau <strong>SEWAHEMAT</strong> (10%)</p>
                {promoError && <p className="text-[11px] text-red-600 font-semibold">{promoError}</p>}
                {promoData && (
                  <div className="flex items-center gap-2 p-2.5 bg-emerald-50 ring-1 ring-emerald-200 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="text-[11px] text-emerald-800 font-semibold">{promoData.description} · Hemat Rp {promoData.discountAmount.toLocaleString('id-ID')}</div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={handleNext}
                disabled={rentalDays === 0}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-[14px] rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                {rentalDays === 0 ? 'Pilih tanggal sewa dulu' : `Lanjut ke Kontrak Sewa →`}
              </button>
              <p className="text-[10px] text-slate-400 text-center">
                Dilindungi escrow MyRent · 100% aman
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Chat Pemilik (sederhana) */}
      {showChat && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-[15px] font-bold text-slate-900">Hubungi Pemilik Alat</h3>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
                {equipment?.owner?.fullName?.charAt(0) || 'P'}
              </div>
              <div>
                <div className="text-[13px] font-bold text-slate-900">{equipment?.owner?.fullName || 'Pemilik Alat'}</div>
                <div className="text-[11px] text-slate-500">{equipment?.owner?.email}</div>
              </div>
            </div>
            <p className="text-[12px] text-slate-600">
              Hubungi pemilik alat via WhatsApp untuk pertanyaan seputar alat, jadwal, atau informasi teknis sebelum memesan.
            </p>
            {equipment?.owner?.phone && (
              <a
                href={`https://wa.me/${equipment.owner.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-bold rounded-xl text-center transition-colors"
              >
                💬 Chat via WhatsApp
              </a>
            )}
            <button onClick={() => setShowChat(false)} className="w-full py-2 text-[12px] text-slate-500 hover:text-slate-700 cursor-pointer">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
