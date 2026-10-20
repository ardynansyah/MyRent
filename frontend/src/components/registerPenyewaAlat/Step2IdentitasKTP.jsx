import { Check, UploadCloud, ShieldCheck, X } from 'lucide-react'
import ModernDatePicker from '../common/ModernDatePicker'

export default function Step2IdentitasKTP({
  formData,
  handleInputChange,
  errors,
  handleFileUpload,
  handleRemoveUpload
}) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* NIK */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            NIK *
          </label>
          <input
            type="text"
            maxLength={16}
            placeholder="3174 0921 8845 0003"
            value={formData.nik}
            onChange={(e) => handleInputChange('nik', e.target.value.replace(/\D/g, ''))}
            className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder:text-slate-400 border ${
              errors.nik ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all font-mono tabular-nums tracking-wide`}
          />
          {errors.nik && <span className="text-xs font-medium text-red-600">{errors.nik}</span>}
        </div>

        {/* Nama sesuai KTP */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Nama sesuai KTP *
          </label>
          <input
            type="text"
            placeholder="Budi Santoso"
            value={formData.ktpName}
            onChange={(e) => handleInputChange('ktpName', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder:text-slate-400 border ${
              errors.ktpName ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.ktpName && <span className="text-xs font-medium text-red-600">{errors.ktpName}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tempat Lahir */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Tempat Lahir *
          </label>
          <input
            type="text"
            placeholder="Jakarta"
            value={formData.birthPlace}
            onChange={(e) => handleInputChange('birthPlace', e.target.value)}
            className={`w-full bg-white text-[13px] rounded-[10px] px-3.5 py-2.5 text-slate-800 placeholder-slate-400 border ${
              errors.birthPlace ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
            } focus:outline-none focus:ring-2 transition-all`}
          />
          {errors.birthPlace && <span className="text-[10px] text-red-500">{errors.birthPlace}</span>}
        </div>

        {/* Tanggal Lahir */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Tanggal Lahir *
          </label>
          <ModernDatePicker
            value={formData.birthDate}
            onChange={(val) => handleInputChange('birthDate', val)}
            placeholder="Pilih tanggal lahir"
            error={errors.birthDate}
          />
          {errors.birthDate && <span className="text-[10px] text-red-500">{errors.birthDate}</span>}
        </div>
      </div>

      {/* Foto KTP & Selfie */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-600">
          Foto KTP &amp; Verifikasi Selfie *
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Box 1: Foto KTP */}
          <label
            className={`h-[100px] rounded-[10px] border border-dashed flex flex-col items-center justify-center gap-1.5 p-3 cursor-pointer transition-all ${
              formData.ktpFile
                ? 'bg-blue-50/70 border-blue-400 text-blue-700'
                : errors.ktpFile
                ? 'bg-red-50/50 border-red-300 text-slate-600 hover:bg-slate-50'
                : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-blue-50/40 hover:border-blue-300'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload?.('ktpFile', file)
                e.target.value = ''
              }}
            />
            {formData.ktpFile ? (
              <>
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 line-clamp-1">
                  {formData.ktpFile.name}
                </span>
                <span className="text-[9px] text-blue-600 font-semibold">
                  Klik untuk mengganti berkas
                </span>
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <span className="text-[11px] font-bold text-slate-800">
                  Foto KTP Asli
                </span>
                <span className="text-[9px] text-slate-400">
                  JPG / PNG maks 5 MB
                </span>
              </>
            )}
          </label>

          {/* Box 2: Selfie + KTP */}
          <label
            className={`h-[100px] rounded-[10px] border border-dashed flex flex-col items-center justify-center gap-1.5 p-3 cursor-pointer transition-all ${
              formData.selfieFile
                ? 'bg-blue-50/70 border-blue-400 text-blue-700'
                : errors.selfieFile
                ? 'bg-red-50/50 border-red-300 text-slate-600 hover:bg-slate-50'
                : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-blue-50/40 hover:border-blue-300'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload?.('selfieFile', file)
                e.target.value = ''
              }}
            />
            {formData.selfieFile ? (
              <>
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 line-clamp-1">
                  {formData.selfieFile.name}
                </span>
                <span className="text-[9px] text-blue-600 font-semibold">
                  Klik untuk mengganti berkas
                </span>
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <span className="text-[11px] font-bold text-slate-800">
                  Selfie + KTP
                </span>
                <span className="text-[9px] text-slate-400">
                  Wajah &amp; KTP terlihat jelas
                </span>
              </>
            )}
          </label>
        </div>

        {/* Tombol hapus berkas yang sudah dipilih */}
        {formData.ktpFile || formData.selfieFile ? (
          <div className="flex flex-wrap items-center gap-2">
            {formData.ktpFile ? (
              <button
                type="button"
                onClick={() => handleRemoveUpload?.('ktpFile', 'Foto KTP')}
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-red-600 hover:text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 rounded-full px-2.5 py-1 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Hapus Foto KTP</span>
              </button>
            ) : null}
            {formData.selfieFile ? (
              <button
                type="button"
                onClick={() => handleRemoveUpload?.('selfieFile', 'Foto Selfie')}
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-red-600 hover:text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 rounded-full px-2.5 py-1 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Hapus Foto Selfie</span>
              </button>
            ) : null}
          </div>
        ) : null}

        {(errors.ktpFile || errors.selfieFile) && (
          <span className="text-[10px] text-red-500">
            {errors.ktpFile || errors.selfieFile}
          </span>
        )}
      </div>

      {/* Catatan Privasi (Sesuai HTML mentah) */}
      <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-[10px] flex items-center gap-2 text-[11px] text-slate-600">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
        <span>Data identitas akan dienkripsi dan tidak ditampilkan ke publik.</span>
      </div>
    </div>
  )
}
