import { Info, Edit3, Check } from 'lucide-react'

export default function Step5ReviewKirim({ formData, errors, handleInputChange, onJumpToStep }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-2.5 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          Data akan langsung masuk antrean verifikasi Admin (1 × 24 jam). Klik tombol edit di tiap kartu jika ingin mengubah data.
        </span>
      </div>

      {/* Ringkasan 1: Akun */}
      <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-blue-600 uppercase">1. Akun &amp; Kontak</span>
          <div className="text-[13px] font-bold text-slate-900">
            {formData.fullName || formData.ktpName || '-'} · {formData.email || '-'}
          </div>
          <div className="text-[11px] text-slate-500">
            WhatsApp: +62 {formData.phone || '-'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onJumpToStep(1)}
          className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer transition-colors"
          title="Edit Akun"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Ringkasan 2: Identitas KTP */}
      <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">2. Identitas (KTP)</span>
          <div className="text-[13px] font-bold text-slate-900">
            NIK <span className="font-mono font-bold tabular-nums text-slate-900">{formData.nik || '-'}</span> · {formData.birthPlace || '-'}, {formData.birthDate || '-'}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
            <Check className="w-3 h-3" />
            <span>Foto KTP &amp; Selfie terunggah</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onJumpToStep(2)}
          className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer transition-colors"
          title="Edit KTP"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Ringkasan 3: Profil UMKM */}
      <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">3. Profil UMKM</span>
          <div className="text-[13px] font-bold text-slate-900">
            {formData.businessName || '-'} · {formData.businessSector === 'Lainnya' && formData.customSector ? `${formData.businessSector} (${formData.customSector})` : formData.businessSector}
          </div>
          <div className="text-[11px] text-slate-500">
            Daya Listrik: <strong className="text-slate-800 tabular-nums">{formData.powerCapacity}</strong> · NIB: <span className="font-mono tabular-nums">{formData.nib || 'Tidak ada'}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onJumpToStep(3)}
          className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer transition-colors"
          title="Edit Profil UMKM"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Ringkasan 4: Alamat & Rekening */}
      <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">4. Alamat &amp; Rekening Refund</span>
          <div className="text-[13px] font-bold text-slate-900">
            {formData.address || '-'}, {formData.city || '-'} <span className="font-mono tabular-nums">{formData.postalCode}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {formData.bankName}: <span className="font-mono font-semibold tabular-nums text-slate-900 tracking-wide">{formData.bankAccount}</span> (a.n. {formData.bankAccountHolder})
          </div>
        </div>
        <button
          type="button"
          onClick={() => onJumpToStep(4)}
          className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer transition-colors"
          title="Edit Alamat & Rekening"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Persetujuan Akhir */}
      <div className="space-y-2.5 pt-2">
        <label
          onClick={() => handleInputChange('agreeTruth', !formData.agreeTruth)}
          className="flex items-start gap-2.5 cursor-pointer select-none"
        >
          <div
            className={`w-4 h-4 rounded-[4px] mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
              formData.agreeTruth ? 'bg-[#2563EB]' : 'border border-[#CBD5E1] bg-white'
            }`}
          >
            {formData.agreeTruth && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
          </div>
          <span className="text-[11px] text-[#475569] leading-tight">
            Saya menyatakan seluruh data dan dokumen yang dilampirkan adalah benar dan sah milik usaha saya.
          </span>
        </label>

        <label
          onClick={() => handleInputChange('agreeTerms', !formData.agreeTerms)}
          className="flex items-start gap-2.5 cursor-pointer select-none"
        >
          <div
            className={`w-4 h-4 rounded-[4px] mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
              formData.agreeTerms ? 'bg-[#2563EB]' : 'border border-[#CBD5E1] bg-white'
            }`}
          >
            {formData.agreeTerms && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
          </div>
          <span className="text-[11px] text-[#475569] leading-tight">
            Saya telah membaca serta menyetujui Ketentuan Layanan, Ketentuan Escrow Deposit, dan Kebijakan Privasi MyRent.
          </span>
        </label>

        {(errors.agreeTruth || errors.agreeTerms) && (
          <span className="text-xs font-medium text-red-600 block">
            Kedua persetujuan di atas wajib dicentang sebelum mengirim pendaftaran.
          </span>
        )}
      </div>
    </div>
  )
}
