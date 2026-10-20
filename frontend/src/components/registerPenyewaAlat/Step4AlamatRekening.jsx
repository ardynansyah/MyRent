import { Check, MapPin, RotateCw } from 'lucide-react'
import { BANKS } from './constants'

export default function Step4AlamatRekening({
  formData,
  handleInputChange,
  errors,
  handleRefreshGps,
  isGpsLoading
}) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Alamat Lengkap */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-[#475569]">
          Alamat Lengkap Usaha *
        </label>
        <textarea
          rows={2}
          placeholder="Jl. Kemang Selatan VIII No. 12, RT 03/RW 05, Bangka, Mampang Prapatan"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className={`w-full bg-white text-[13px] rounded-[10px] p-3 text-slate-800 placeholder-[#94A3B8] border ${
            errors.address ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
          } focus:outline-none focus:ring-2 transition-all resize-none`}
        />
        {errors.address && <span className="text-[10px] text-red-500">{errors.address}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kota / Kabupaten */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Kota / Kabupaten *
          </label>
          <input
            type="text"
            placeholder="Jakarta Selatan"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
              errors.city ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.city && <span className="text-[10px] text-red-500">{errors.city}</span>}
        </div>

        {/* Kecamatan */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Kecamatan *
          </label>
          <input
            type="text"
            placeholder="Mampang Prapatan"
            value={formData.district}
            onChange={(e) => handleInputChange('district', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
              errors.district ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.district && <span className="text-[10px] text-red-500">{errors.district}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kode Pos */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Kode Pos *
          </label>
          <input
            type="text"
            placeholder="12730"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
              errors.postalCode ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.postalCode && <span className="text-[10px] text-red-500">{errors.postalCode}</span>}
        </div>

        {/* Patokan Lokasi */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Patokan Lokasi
          </label>
          <input
            type="text"
            placeholder="Sebelah minimarket 24 jam"
            value={formData.landmark}
            onChange={(e) => handleInputChange('landmark', e.target.value)}
            className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Titik Lokasi GPS */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-[#475569]">
          Titik Lokasi Usaha (GPS) *
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-[10px]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <div className="text-[12px] font-bold text-slate-900">
                Titik terambil ({formData.gpsCoords})
              </div>
              <div className="text-[10px] text-[#64748B]">
                Dipakai untuk estimasi jarak &amp; tarif kurir pengiriman alat
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefreshGps}
            disabled={isGpsLoading}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[11px] font-semibold text-slate-700 rounded-lg cursor-pointer transition-all shrink-0"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isGpsLoading ? 'animate-spin' : ''}`} />
            <span>{isGpsLoading ? 'Memindai...' : 'Perbarui GPS'}</span>
          </button>
        </div>
      </div>

      <hr className="border-slate-100 my-1" />

      {/* Bank Refund Deposit */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-[#475569]">
          Bank untuk Refund Deposit *
        </label>
        <select
          value={formData.bankName}
          onChange={(e) => handleInputChange('bankName', e.target.value)}
          className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer"
        >
          {BANKS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nomor Rekening */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Nomor Rekening *
          </label>
          <input
            type="text"
            placeholder="4471 8890 221"
            value={formData.bankAccount}
            onChange={(e) => handleInputChange('bankAccount', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder:text-slate-400 border ${
              errors.bankAccount ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all font-mono tabular-nums tracking-wide`}
          />
          {errors.bankAccount && <span className="text-xs font-medium text-red-600">{errors.bankAccount}</span>}
        </div>

        {/* Nama Pemilik Rekening */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Nama Pemilik Rekening *
          </label>
          <input
            type="text"
            placeholder="Budi Santoso"
            value={formData.bankAccountHolder}
            onChange={(e) => handleInputChange('bankAccountHolder', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder:text-slate-400 border ${
              errors.bankAccountHolder ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          <p className="text-xs text-slate-500 mt-1">* Nama pemilik rekening harus sama persis dengan nama di KTP.</p>
          {errors.bankAccountHolder && (
            <span className="text-xs font-medium text-red-600">{errors.bankAccountHolder}</span>
          )}
        </div>
      </div>

      {/* Checkbox Konfirmasi Rekening */}
      <div className="space-y-2 pt-1">
        <label
          onClick={() => handleInputChange('confirmAccountOwner', !formData.confirmAccountOwner)}
          className="flex items-start gap-2.5 cursor-pointer select-none"
        >
          <div
            className={`w-4 h-4 rounded-[4px] mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
              formData.confirmAccountOwner ? 'bg-[#2563EB]' : 'border border-[#CBD5E1] bg-white'
            }`}
          >
            {formData.confirmAccountOwner && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
          </div>
          <span className="text-[11px] text-[#475569] leading-tight">
            Saya menyatakan rekening di atas milik saya sendiri dan aktif.
          </span>
        </label>

        <label
          onClick={() => handleInputChange('confirmDeduction', !formData.confirmDeduction)}
          className="flex items-start gap-2.5 cursor-pointer select-none"
        >
          <div
            className={`w-4 h-4 rounded-[4px] mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
              formData.confirmDeduction ? 'bg-[#2563EB]' : 'border border-[#CBD5E1] bg-white'
            }`}
          >
            {formData.confirmDeduction && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
          </div>
          <span className="text-[11px] text-[#475569] leading-tight">
            Saya bersedia menerima potongan denda/klaim yang disepakati dari deposit bila terjadi kerusakan unit.
          </span>
        </label>

        {(errors.confirmAccountOwner || errors.confirmDeduction) && (
          <span className="text-[10px] text-red-500 block">
            Kedua pernyataan di atas wajib disetujui.
          </span>
        )}
      </div>
    </div>
  )
}
