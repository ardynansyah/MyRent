import React from 'react'
import { TriangleAlert } from 'lucide-react'

export default function WarningBanner({
  requiredWatt = 2200,
  userWatt = 1300,
  title = 'Daya listrik alat lebih tinggi dari usaha Anda',
  message,
  actionText = 'Perbarui daya',
  onActionClick
}) {
  const defaultMessage = `Alat ini membutuhkan ${requiredWatt} W, sedangkan daya usaha Anda terdaftar ${userWatt} W. Konfirmasi ke pemilik alat sebelum menyewa untuk menghindari gagal operasi.`

  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-row gap-3 p-3.5 justify-start items-start bg-amber-50 ring-1 ring-amber-200 rounded-xl">
      {/* Alert Icon */}
      <TriangleAlert className="w-4.5 h-4.5 text-amber-700 shrink-0 mt-px" />

      {/* Text Content */}
      <div className="box-border flex-1 h-fit flex flex-col gap-0.75 justify-start items-start">
        <div className="text-xs text-amber-700 font-bold text-left whitespace-nowrap">
          {title}
        </div>
        <div className="text-[11px] leading-4.25 w-full text-amber-800 font-normal tabular-nums text-left">
          {message || defaultMessage}
        </div>
      </div>

      {/* Action Link */}
      <button
        type="button"
        onClick={onActionClick}
        className="text-[11px] text-amber-700 font-bold text-left whitespace-nowrap hover:underline cursor-pointer bg-transparent border-0 p-0 self-start shrink-0"
      >
        {actionText}
      </button>
    </div>
  )
}
