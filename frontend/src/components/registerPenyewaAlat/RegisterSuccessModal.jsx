import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function RegisterSuccessModal({ formData, onBackToLogin }) {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-between items-center text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      <header className="w-full max-w-[1440px] px-5 sm:px-10 py-5 sm:py-6 flex items-center justify-between border-b border-[#E2E8F0] bg-white">
        <div
          onClick={onBackToLogin}
          className="text-[20px] text-[#2563EB] font-extrabold tracking-[-0.3px] select-none cursor-pointer flex items-center gap-2"
        >
          MyRent
        </div>
      </header>

      <main className="w-full max-w-[640px] px-4 py-12 flex-1 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-8 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-9 h-9" strokeWidth={2.5} />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Pendaftaran Berhasil Dikirim
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight pt-2">
              Selamat Datang di MyRent, {formData.fullName || formData.ktpName || 'Penyewa UMKM'}!
            </h1>
            <p className="text-sm text-[#475569] leading-relaxed max-w-md mx-auto">
              Data pendaftaran dan verifikasi identitas Anda untuk <strong className="text-slate-800">{formData.businessName || 'Usaha Anda'}</strong> telah masuk ke antrean verifikasi Admin.
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-left text-xs space-y-2.5">
            <div className="flex justify-between items-center text-slate-500 pb-2 border-b border-slate-200">
              <span>Estimasi Review Admin</span>
              <span className="font-bold text-slate-800">1 × 24 Jam Kerja</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 pb-2 border-b border-slate-200">
              <span>Notifikasi Status</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                WhatsApp (+62 {formData.phone || '-'})
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>Email Terdaftar</span>
              <span className="font-medium text-slate-800">{formData.email}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full sm:w-auto px-6 py-3 bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Masuk ke Halaman Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-[11px] text-[#94A3B8]">
        © 2026 MyRent. Platform Sewa Alat Terverifikasi untuk UMKM Indonesia.
      </footer>
    </div>
  )
}
