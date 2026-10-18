/**
 * Kerangka kartu form pendaftaran yang dipakai bersama oleh Step 1-5:
 * header (LANGKAH n DARI 5 + judul + subjudul + pil draf), progress bar 5 segmen,
 * area field (children), dan footer navigasi (kembali, simpan draf, lanjut).
 */
export default function RegisterFormCard({
  step,
  title,
  subtitle,
  backLabel,
  nextLabel,
  onBack,
  onNext,
  onSaveDraft,
  children
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onNext?.()
      }}
      className="w-full max-w-[760px] flex flex-col gap-[18px] p-5 sm:p-7 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm"
    >
      {/* Kepala kartu */}
      <div className="w-full flex flex-row justify-between items-start gap-3">
        <div className="flex-1 min-w-0 flex flex-col gap-[3px]">
          <div className="text-[9px] font-bold tracking-[0.9px] text-[#2563EB]">
            LANGKAH {step} DARI 5
          </div>
          <h2 className="text-[19px] font-bold text-[#0F172A]">{title}</h2>
          <p className="text-[11px] leading-[17px] text-[#475569]">{subtitle}</p>
        </div>

        <div className="shrink-0 px-2.5 py-[5px] bg-[#F8FAFC] rounded-full">
          <span className="text-[10px] font-semibold text-[#94A3B8] whitespace-nowrap">
            Draf tersimpan
          </span>
        </div>
      </div>

      {/* Progress bar 5 segmen */}
      <div className="w-full flex flex-row gap-1.5">
        {[1, 2, 3, 4, 5].map((segment) => (
          <div
            key={segment}
            className={`flex-1 h-[5px] rounded-full transition-colors ${
              segment <= step ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
            }`}
          />
        ))}
      </div>

      {/* Konten field per langkah */}
      <div className="w-full flex flex-col gap-3.5">{children}</div>

      {/* Footer navigasi */}
      <div className="w-full flex flex-row justify-between items-center gap-3 pt-3.5 border-t border-[#E2E8F0]">
        <button
          type="button"
          onClick={onBack}
          className="text-[12px] font-semibold text-[#475569] hover:text-[#0F172A] cursor-pointer transition-colors"
        >
          {backLabel}
        </button>

        <div className="flex flex-row items-center gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-[18px] py-[11px] bg-white border border-[#E2E8F0] rounded-[10px] text-[12px] font-semibold text-[#0F172A] hover:bg-slate-50 cursor-pointer transition-colors"
          >
            Simpan Draf
          </button>
          <button
            type="submit"
            className="px-[18px] py-[11px] bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] rounded-[10px] text-[12px] font-semibold text-white cursor-pointer transition-all shadow-xs"
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
