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
    <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[14px] justify-start items-start bg-[#FFFBEB] ring-1 ring-[#FDE68A] rounded-[12px]">
      {/* Alert Icon */}
      <TriangleAlert className="w-[18px] h-[18px] text-[#B45309] shrink-0 mt-[1px]" />

      {/* Text Content */}
      <div className="box-border flex-1 h-fit flex flex-col gap-[3px] justify-start items-start">
        <div className="text-[12px] text-[#B45309] font-bold text-left whitespace-nowrap">
          {title}
        </div>
        <div className="text-[11px] leading-[17px] w-full text-[#92400E] font-normal tabular-nums text-left">
          {message || defaultMessage}
        </div>
      </div>

      {/* Action Link */}
      <button
        type="button"
        onClick={onActionClick}
        className="text-[11px] text-[#B45309] font-bold text-left whitespace-nowrap hover:underline cursor-pointer bg-transparent border-0 p-0 self-start shrink-0"
      >
        {actionText}
      </button>
    </div>
  )
}
