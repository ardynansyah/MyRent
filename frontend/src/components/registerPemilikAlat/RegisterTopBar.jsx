export default function RegisterTopBar({ onLoginClick }) {
  return (
    <header className="w-full h-16 shrink-0 flex flex-row items-center justify-between px-4 sm:px-8 bg-white border-b border-[#E2E8F0]">
      <div className="flex flex-row items-center gap-3">
        <div className="text-[17px] text-[#2563EB] font-extrabold tracking-[-0.3px] whitespace-nowrap select-none">
          MyRent
        </div>
        <div className="w-px h-4 bg-[#E2E8F0]" />
        <div className="hidden sm:block text-[12px] text-[#475569] font-semibold whitespace-nowrap">
          Daftar sebagai Pemilik Alat
        </div>
      </div>

      <div className="flex flex-row items-center gap-2">
        <span className="hidden sm:inline text-[11px] text-[#475569] whitespace-nowrap">
          Sudah punya akun?
        </span>
        <button
          type="button"
          onClick={onLoginClick}
          className="text-[11px] text-[#2563EB] font-bold whitespace-nowrap hover:underline cursor-pointer transition-colors"
        >
          Masuk
        </button>
      </div>
    </header>
  )
}
