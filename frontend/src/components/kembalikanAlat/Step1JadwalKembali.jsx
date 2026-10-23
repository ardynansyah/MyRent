import React, { useState } from 'react'
import {
  Truck,
  Store,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Edit2,
  Check,
  User,
  Phone
} from 'lucide-react'
import { formatShortDate, formatLongDate, addDays, normalizeDate } from '../../lib/dateHelpers'
import { getSessionUser } from '../../lib/userSession'

export default function Step1JadwalKembali({
  order,
  returnData,
  onChange
}) {
  const user = getSessionUser()
  const kyc = user?.kycData || {}

  // Mode edit alamat penjemputan inline
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [pickupAddress, setPickupAddress] = useState(
    returnData.pickupAddress || kyc.address || 'Jl. Raya Wisata No. 45, Komplek Ruko Sentra'
  )
  const [pickupLandmark, setPickupLandmark] = useState(
    returnData.pickupLandmark || kyc.landmark || 'Samping Bank Mandiri, pagar hitam'
  )
  const [pickupPhone, setPickupPhone] = useState(
    returnData.pickupPhone || user?.phone || '0812-9876-5432'
  )

  const returnMethod = returnData.returnMethod || 'COURIER_PICKUP'
  const selectedDate = normalizeDate(returnData.returnDate || order.endDate)
  const selectedSlot = returnData.returnSlot || '09:00 – 12:00 WIB'

  // Periksa keterlambatan
  const orderEndDate = normalizeDate(order.endDate)
  const diffTime = selectedDate.getTime() - orderEndDate.getTime()
  const daysLate = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  const dailyPrice = order.equipment?.pricePerDay || 200000
  const calculatedLateFee = daysLate > 0 ? daysLate * Math.round(dailyPrice * 1.5) : 0

  // Opsi tanggal (hari ini, tanggal sewa selesai, +1 hari, +2 hari, +3 hari)
  const dateOptions = [-1, 0, 1, 2, 3].map((offset) => addDays(orderEndDate, offset))

  const handleDateSelect = (date) => {
    const diff = date.getTime() - orderEndDate.getTime()
    const dLate = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    const fee = dLate > 0 ? dLate * Math.round(dailyPrice * 1.5) : 0

    onChange({
      ...returnData,
      returnDate: date,
      daysLate: dLate,
      lateFee: fee
    })
  }

  const handleSaveAddress = () => {
    setIsEditingAddress(false)
    onChange({
      ...returnData,
      pickupAddress,
      pickupLandmark,
      pickupPhone
    })
  }

  const timeSlots = [
    '09:00 – 12:00 WIB',
    '13:00 – 17:00 WIB',
    '18:00 – 20:00 WIB'
  ]

  const formatRupiah = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4">
      {/* 1. Card Cara Pengembalian */}
      <div className="p-5 bg-white ring-1 ring-slate-200 rounded-2xl shadow-2xs flex flex-col gap-3.5 text-xs">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 m-0">Pilih Cara Pengembalian</h3>
          <span className="text-[11px] text-slate-400">Wajib dipilih</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Opsi 1: Dijemput kurir toko */}
          <div
            onClick={() => onChange({ ...returnData, returnMethod: 'COURIER_PICKUP' })}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              returnMethod === 'COURIER_PICKUP'
                ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  returnMethod === 'COURIER_PICKUP' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}
              >
                {returnMethod === 'COURIER_PICKUP' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs m-0">Dijemput Kurir Toko</h4>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5">
                Kurir pemilik alat akan menjemput unit langsung di alamat operasional UMKM Anda.
              </p>
            </div>

            <span className="text-[11px] font-bold text-emerald-700">Gratis · Termasuk Layanan</span>
          </div>

          {/* Opsi 2: Antar sendiri ke toko */}
          <div
            onClick={() => onChange({ ...returnData, returnMethod: 'STORE_DROPOFF' })}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              returnMethod === 'STORE_DROPOFF'
                ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  returnMethod === 'STORE_DROPOFF' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}
              >
                {returnMethod === 'STORE_DROPOFF' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs m-0">Antar Sendiri ke Toko</h4>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5">
                Anda mengantarkan unit langsung ke gudang / workshop pemilik alat.
              </p>
            </div>

            <span className="text-[11px] font-bold text-slate-600">Serah terima langsung</span>
          </div>
        </div>
      </div>

      {/* 2. Card Jadwal Tanggal & Slot Waktu */}
      <div className="p-5 bg-white ring-1 ring-slate-200 rounded-2xl shadow-2xs flex flex-col gap-4 text-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 m-0">
            {returnMethod === 'COURIER_PICKUP' ? 'Waktu Penjemputan' : 'Waktu Pengantaran Unit'}
          </h3>
          <p className="text-[11px] text-slate-500 m-0 mt-0.5">
            Pilih hari dan rentang waktu yang sesuai dengan operasional Anda.
          </p>
        </div>

        {/* Date Selector Pills */}
        <div>
          <label className="font-bold text-slate-700 block mb-2">Tanggal Pengembalian</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {dateOptions.map((date, idx) => {
              const isSelected = selectedDate.toDateString() === date.toDateString()
              const isDue = date.toDateString() === orderEndDate.toDateString()
              const isLate = date.getTime() > orderEndDate.getTime()

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-[10px] font-semibold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {isDue ? 'Batas Sewa' : isLate ? 'Lewat Batas' : 'Lebih Awal'}
                  </span>
                  <span className="text-xs font-bold mt-0.5">{formatShortDate(date)}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Slot Waktu Dropdown / Buttons */}
        <div>
          <label className="font-bold text-slate-700 block mb-2">Pilih Slot Waktu</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {timeSlots.map((slot) => {
              const isSelected = selectedSlot === slot
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onChange({ ...returnData, returnSlot: slot })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{slot}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Deteksi Keterlambatan Otomatis */}
        {daysLate === 0 ? (
          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="text-[11px] leading-snug">
              <strong>Tepat waktu!</strong> Tidak ada denda keterlambatan untuk tanggal pengembalian ini.
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-snug">
              <strong>Keterlambatan {daysLate} hari terdeteksi.</strong>
              <p className="m-0 mt-0.5 text-amber-800">
                Pengembalian melewati batas sewa ({formatShortDate(order.endDate)}). Estimasi denda keterlambatan:{' '}
                <strong className="text-red-700">{formatRupiah(calculatedLateFee)}</strong> (akan dipotong otomatis dari deposit escrow).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Card Alamat (Dinamis dari KYC Penyewa atau Gudang Pemilik) */}
      <div className="p-5 bg-white ring-1 ring-slate-200 rounded-2xl shadow-2xs flex flex-col gap-3 text-xs">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 m-0">
            {returnMethod === 'COURIER_PICKUP' ? 'Alamat Penjemputan Unit' : 'Alamat Gudang Pemilik'}
          </h3>
          {returnMethod === 'COURIER_PICKUP' && !isEditingAddress && (
            <button
              type="button"
              onClick={() => setIsEditingAddress(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>Ubah Alamat</span>
            </button>
          )}
        </div>

        {returnMethod === 'COURIER_PICKUP' ? (
          isEditingAddress ? (
            <div className="p-3.5 bg-slate-50 rounded-xl flex flex-col gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Lengkap</label>
                <textarea
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  rows={2}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Patokan Lokasi</label>
                  <input
                    type="text"
                    value={pickupLandmark}
                    onChange={(e) => setPickupLandmark(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Kontak Penjemputan</label>
                  <input
                    type="text"
                    value={pickupPhone}
                    onChange={(e) => setPickupPhone(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="py-1.5 px-3 bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  className="py-1.5 px-3 bg-blue-600 text-white font-bold rounded-lg flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Alamat</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-bold text-slate-900">{kyc.businessName || user?.fullName || 'Usaha UMKM'}</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                  Lokasi Operasional
                </span>
              </div>
              <p className="text-slate-600 m-0 pl-6 leading-relaxed">{pickupAddress}</p>
              <div className="flex flex-wrap items-center gap-4 pl-6 text-[11px] text-slate-500 pt-1">
                <span>Patokan: <strong className="text-slate-700">{pickupLandmark}</strong></span>
                <span>Kontak: <strong className="text-slate-700">{pickupPhone}</strong></span>
              </div>
            </div>
          )
        ) : (
          /* Informasi Gudang Pemilik Alat */
          <div className="p-3.5 bg-slate-50 rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-bold text-slate-900">{order.equipment?.owner?.fullName || 'Gudang Pusat Pemilik'}</span>
            </div>
            <p className="text-slate-600 m-0 pl-6 leading-relaxed">
              {order.equipment?.location || 'Jl. Saharjo Raya No. 108, Tebet, Jakarta Selatan'}
            </p>
            <div className="flex flex-wrap items-center gap-4 pl-6 text-[11px] text-slate-500 pt-1">
              <span>Jam Operasional: <strong className="text-slate-700">Senin – Sabtu, 08:30 – 17:00 WIB</strong></span>
              <span>Kontak Petugas: <strong className="text-slate-700">{order.equipment?.owner?.phone || '0812-3456-7890'}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
