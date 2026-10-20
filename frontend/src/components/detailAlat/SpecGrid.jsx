import React from 'react'
import { Zap, Scale, Box, Clock } from 'lucide-react'

export default function SpecGrid({
  power = '2200 W',
  rawPower = 2200,
  userPowerLimit = 1300,
  weight = '34 kg',
  dimensions = '40 × 53 × 35 cm',
  maintenanceBuffer = '1 Hari'
}) {
  const isPowerExceeded = rawPower > userPowerLimit

  return (
    <div className="box-border w-full h-fit shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-[12px] justify-start items-start">
      {/* 1. Daya Listrik */}
      <div
        className={`box-border flex-1 h-fit flex flex-col gap-[6px] p-[14px] justify-start items-start rounded-[12px] transition-all ${
          isPowerExceeded
            ? 'bg-[#FFFBEB] ring-1 ring-[#FDE68A]'
            : 'bg-[#FFFFFF] ring-1 ring-[#E2E8F0]'
        }`}
      >
        <Zap
          className={`w-[16px] h-[16px] ${
            isPowerExceeded ? 'text-[#D97706]' : 'text-[#2563EB]'
          }`}
        />
        <div className="text-[11px] text-slate-500 font-semibold tracking-wider text-left uppercase whitespace-nowrap">
          Daya Listrik
        </div>
        <div
          className={`text-sm font-bold tabular-nums text-left whitespace-nowrap ${
            isPowerExceeded ? 'text-[#B45309]' : 'text-[#0F172A]'
          }`}
        >
          {power}
        </div>
      </div>

      {/* 2. Berat */}
      <div className="box-border flex-1 h-fit flex flex-col gap-[6px] p-[14px] justify-start items-start bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[12px]">
        <Scale className="w-[16px] h-[16px] text-[#2563EB]" />
        <div className="text-[11px] text-slate-500 font-semibold tracking-wider text-left uppercase whitespace-nowrap">
          Berat
        </div>
        <div className="text-sm text-[#0F172A] font-bold tabular-nums text-left whitespace-nowrap">
          {weight}
        </div>
      </div>

      {/* 3. Dimensi */}
      <div className="box-border flex-1 h-fit flex flex-col gap-[6px] p-[14px] justify-start items-start bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[12px]">
        <Box className="w-[16px] h-[16px] text-[#2563EB]" />
        <div className="text-[11px] text-slate-500 font-semibold tracking-wider text-left uppercase whitespace-nowrap">
          Dimensi
        </div>
        <div className="text-sm text-[#0F172A] font-bold tabular-nums text-left whitespace-nowrap">
          {dimensions}
        </div>
      </div>

      {/* 4. Jeda Rawat */}
      <div className="box-border flex-1 h-fit flex flex-col gap-[6px] p-[14px] justify-start items-start bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[12px]">
        <Clock className="w-[16px] h-[16px] text-[#2563EB]" />
        <div className="text-[11px] text-slate-500 font-semibold tracking-wider text-left uppercase whitespace-nowrap">
          Jeda Rawat
        </div>
        <div className="text-sm text-[#0F172A] font-bold tabular-nums text-left whitespace-nowrap">
          {maintenanceBuffer}
        </div>
      </div>
    </div>
  )
}
