import { Check, UploadCloud } from 'lucide-react'
import { SECTORS, POWER_CAPACITIES } from './constants'

export default function Step3ProfilUMKM({
  formData,
  handleInputChange,
  errors,
  handleMockUpload
}) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nama UMKM */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Nama UMKM *
          </label>
          <input
            type="text"
            placeholder="Kopi Senja Roastery"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border ${
              errors.businessName ? 'border-red-400 focus:ring-red-200' : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.businessName && <span className="text-[10px] text-red-500">{errors.businessName}</span>}
        </div>

        {/* Kategori Usaha */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Kategori Usaha *
          </label>
          <select
            value={formData.businessSector}
            onChange={(e) => handleInputChange('businessSector', e.target.value)}
            className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer"
          >
            {SECTORS.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tahun Mulai Usaha */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            Tahun Mulai Usaha
          </label>
          <input
            type="number"
            placeholder="2019"
            value={formData.startYear}
            onChange={(e) => handleInputChange('startYear', e.target.value)}
            className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
          />
        </div>

        {/* NIB (opsional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#475569]">
            NIB (Nomor Induk Berusaha - opsional)
          </label>
          <input
            type="text"
            placeholder="8120 4457 9921"
            value={formData.nib}
            onChange={(e) => handleInputChange('nib', e.target.value)}
            className="w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-[#94A3B8] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Daya Listrik Tempat Usaha (Pill selector sesuai HTML mentah) */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-semibold text-[#475569]">
          Daya Listrik Tempat Usaha *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {POWER_CAPACITIES.map((cap) => (
            <button
              key={cap}
              type="button"
              onClick={() => handleInputChange('powerCapacity', cap)}
              className={`py-2 px-3 rounded-[10px] text-[12px] font-semibold border transition-all cursor-pointer text-center ${
                formData.powerCapacity === cap
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-[#CBD5E1] hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              {cap}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-[#64748B]">
          Daya listrik dipakai memfilter alat mesin agar sesuai kapasitas listrik toko/bengkel Anda.
        </span>
      </div>

      {/* Foto Lokasi Usaha (1–2 foto) */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-semibold text-[#475569]">
          Foto Lokasi Usaha (1–2 foto) *
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Tampak Depan */}
          <div
            onClick={() => handleMockUpload('frontPhoto', 'Foto Tampak Depan')}
            className={`h-[90px] rounded-[10px] border border-dashed flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-all ${
              formData.frontPhoto
                ? 'bg-blue-50/70 border-blue-400 text-blue-700'
                : errors.frontPhoto
                ? 'bg-red-50/50 border-red-300 text-slate-600'
                : 'bg-[#F8FAFC] border-[#CBD5E1] text-slate-600 hover:bg-blue-50/40'
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
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-bold text-slate-800">
                  Tampak Depan Toko
                </span>
                <span className="text-[9px] text-[#94A3B8]">Plang / etalase usaha</span>
              </>
            )}
          </div>

          {/* Area Produksi */}
          <div
            onClick={() => handleMockUpload('productionPhoto', 'Foto Area Produksi')}
            className={`h-[90px] rounded-[10px] border border-dashed flex flex-col items-center justify-center gap-1 p-2 cursor-pointer transition-all ${
              formData.productionPhoto
                ? 'bg-blue-50/70 border-blue-400 text-blue-700'
                : 'bg-[#F8FAFC] border-[#CBD5E1] text-slate-600 hover:bg-blue-50/40'
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
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-bold text-slate-800">
                  Area Produksi (Opsional)
                </span>
                <span className="text-[9px] text-[#94A3B8]">Dapur / meja kerja</span>
              </>
            )}
          </div>
        </div>
        {errors.frontPhoto && <span className="text-[10px] text-red-500">{errors.frontPhoto}</span>}
      </div>

      {/* Deskripsi Singkat Usaha */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-[#475569]">
          Deskripsi Singkat Usaha
        </label>
        <textarea
          rows={3}
          placeholder="Contoh: Roastery kopi kecil dengan 2 barista, produksi 40 kg green bean per minggu dan melayani 60 cangkir/hari."
          value={formData.businessDesc}
          onChange={(e) => handleInputChange('businessDesc', e.target.value)}
          className="w-full bg-white text-[13px] rounded-[10px] p-3 text-slate-800 placeholder-[#94A3B8] border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none"
        />
      </div>
    </div>
  )
}
