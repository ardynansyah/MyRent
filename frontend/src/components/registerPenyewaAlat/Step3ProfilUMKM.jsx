import { Check, UploadCloud } from 'lucide-react'
import { SECTORS, POWER_CAPACITIES } from './constants'

export default function Step3ProfilUMKM({
  formData,
  handleInputChange,
  errors,
  handleMockUpload
}) {
  const isManualPowerActive =
    Boolean(formData.isManualPower) ||
    (Boolean(formData.powerCapacity) && !POWER_CAPACITIES.includes(formData.powerCapacity))

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nama UMKM */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Nama UMKM *
          </label>
          <input
            type="text"
            placeholder="Kopi Senja Roastery"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-slate-400 border ${
              errors.businessName ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.businessName && <span className="text-[10px] text-red-500">{errors.businessName}</span>}
        </div>

        {/* Kategori Usaha */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Kategori Usaha *
          </label>
          <select
            value={formData.businessSector}
            onChange={(e) => handleInputChange('businessSector', e.target.value)}
            className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer"
          >
            {SECTORS.filter((sec) => sec !== 'Lainnya').map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
            <option value="Lainnya">Lainnya</option>
          </select>
          {formData.businessSector === 'Lainnya' && (
            <input
              type="text"
              placeholder="Masukkan jenis usaha Anda"
              value={formData.customSector || ''}
              onChange={(e) => handleInputChange('customSector', e.target.value)}
              className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-slate-400 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all mt-1"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tahun Mulai Usaha */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Tahun Mulai Usaha
          </label>
          <input
            type="number"
            placeholder="2019"
            value={formData.startYear}
            onChange={(e) => handleInputChange('startYear', e.target.value)}
            className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-slate-400 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
          />
        </div>

        {/* NIB (opsional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            NIB (Nomor Induk Berusaha - opsional)
          </label>
          <input
            type="text"
            placeholder="8120 4457 9921"
            value={formData.nib}
            onChange={(e) => handleInputChange('nib', e.target.value)}
            className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-slate-400 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Daya Listrik Tempat Usaha (Pill selector) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-600">
          Daya Listrik Tempat Usaha *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {POWER_CAPACITIES.map((cap) => {
            const isSelected = !isManualPowerActive && formData.powerCapacity === cap
            return (
              <button
                key={cap}
                type="button"
                onClick={() => {
                  handleInputChange('powerCapacity', cap)
                  handleInputChange('isManualPower', false)
                }}
                className={`py-2 px-3 rounded-[10px] text-xs font-semibold border transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                {cap}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => {
              handleInputChange('isManualPower', true)
              if (POWER_CAPACITIES.includes(formData.powerCapacity)) {
                handleInputChange(
                  'powerCapacity',
                  formData.customPower ? `${formData.customPower} W` : ''
                )
              }
            }}
            className={`py-2 px-3 rounded-[10px] text-xs font-semibold border transition-all cursor-pointer text-center ${
              isManualPowerActive
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            Input Manual
          </button>
        </div>

        {isManualPowerActive && (
          <div className="relative max-w-xs mt-1">
            <input
              type="number"
              placeholder="Contoh: 3500"
              value={
                formData.customPower ??
                (formData.powerCapacity && !POWER_CAPACITIES.includes(formData.powerCapacity)
                  ? formData.powerCapacity.replace(/\D/g, '')
                  : '')
              }
              onChange={(e) => {
                const val = e.target.value
                handleInputChange('customPower', val)
                handleInputChange('powerCapacity', val ? `${val} W` : '')
              }}
              className="w-full bg-white text-[13px] rounded-[10px] pl-3.5 pr-10 py-2.5 text-slate-800 placeholder-slate-400 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-slate-500 pointer-events-none select-none">
              W
            </span>
          </div>
        )}

        <span className="text-[10px] text-slate-500">
          Daya listrik dipakai memfilter alat mesin agar sesuai kapasitas listrik toko/bengkel Anda.
        </span>
        {errors.powerCapacity && (
          <span className="text-[10px] text-red-500">{errors.powerCapacity}</span>
        )}
      </div>

      {/* Foto Lokasi Usaha (1–2 foto) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-600">
          Foto Lokasi Usaha (1–2 foto) *
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Tampak Depan */}
          <div
            onClick={() => handleMockUpload('frontPhoto', 'Foto Tampak Depan')}
            className={`min-h-[90px] rounded-[10px] border border-dashed flex flex-col items-center justify-center gap-1 p-2.5 cursor-pointer transition-all ${
              formData.frontPhoto
                ? 'bg-blue-50/70 border-blue-400 text-blue-700'
                : errors.frontPhoto
                ? 'bg-red-50/50 border-red-300 text-slate-600'
                : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-blue-50/40'
            }`}
          >
            {formData.frontPhoto ? (
              <>
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 line-clamp-1">
                  Tampak Depan (Diunggah)
                </span>
                <p className="text-xs text-gray-500 mt-1">Klik untuk mengganti foto</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-bold text-slate-800">
                  Tampak Depan Toko
                </span>
                <span className="text-[9px] text-slate-400">Plang / etalase usaha</span>
              </>
            )}
          </div>

          {/* Area Produksi */}
          <div
            onClick={() => handleMockUpload('productionPhoto', 'Foto Area Produksi')}
            className={`min-h-[90px] rounded-[10px] border border-dashed flex flex-col items-center justify-center gap-1 p-2.5 cursor-pointer transition-all ${
              formData.productionPhoto
                ? 'bg-blue-50/70 border-blue-400 text-blue-700'
                : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-blue-50/40'
            }`}
          >
            {formData.productionPhoto ? (
              <>
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 line-clamp-1">
                  Area Produksi (Diunggah)
                </span>
                <p className="text-xs text-gray-500 mt-1">Klik untuk mengganti foto</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-bold text-slate-800">
                  Area Produksi (Opsional)
                </span>
                <span className="text-[9px] text-slate-400">Dapur / meja kerja</span>
              </>
            )}
          </div>
        </div>
        {errors.frontPhoto && <span className="text-[10px] text-red-500">{errors.frontPhoto}</span>}
      </div>

      {/* Deskripsi Singkat Usaha */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600">
          Deskripsi Singkat Usaha
        </label>
        <textarea
          rows={3}
          placeholder="Contoh: Roastery kopi kecil dengan 2 barista, produksi 40 kg green bean per minggu dan melayani 60 cangkir/hari."
          value={formData.businessDesc}
          onChange={(e) => handleInputChange('businessDesc', e.target.value)}
          className="w-full bg-white text-[13px] rounded-[10px] p-3 text-slate-800 placeholder-slate-400 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none"
        />
      </div>
    </div>
  )
}
