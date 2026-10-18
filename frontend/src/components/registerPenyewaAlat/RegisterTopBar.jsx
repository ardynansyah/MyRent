import { Sparkles } from 'lucide-react'

export default function RegisterTopBar({ onBackToLogin, onFillDemoData }) {
  return (
    <header className="w-full border-b border-[#E2E8F0] bg-white sticky top-0 z-30">
      <div className="max-w-[1240px] mx-auto h-[64px] px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-[18px] text-[#2563EB] font-extrabold tracking-[-0.3px] select-none hover:opacity-90 cursor-pointer"
          >
            MyRent
          </button>
          <div className="w-[1px] h-[16px] bg-[#E2E8F0] hidden xs:block" />
          <span className="text-[12px] text-[#475569] font-semibold hidden xs:inline-block">
            Daftar sebagai Penyewa UMKM
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Demo Fill Button */}
          <button
            type="button"
            onClick={onFillDemoData}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            title="Isi form otomatis untuk peninjauan cepat"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Isi Data Demo</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px]">
            <span className="text-[#475569] hidden sm:inline">Sudah punya akun?</span>
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-[#2563EB] font-bold hover:underline cursor-pointer"
            >
              Masuk di sini
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
