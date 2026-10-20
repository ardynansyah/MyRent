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
    <div className="box-border w-full h-fit shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-3 justify-start items-start">
      {/* 1. Daya Listrik */}
      <div
        className={`box-border flex-1 h-fit flex flex-col gap-1.5 p-3.5 justify-start items-start rounded-xl transition-all ${isPowerExceeded
            ? 'bg-amber-50 ring-1 ring-amber-200'
            : 'bg-white ring-1 ring-slate-200'
          }`}
      >
        <Zap
          className={`w-4 h-4 ${isPowerExceeded ? 'text-amber-600' : 'text-blue-600'
            }`}
        />
        <div className="text-[11px] text-slate-500 font-semibold tracking-wider text-left uppercase whitespace-nowrap">
          Daya Listrik
        </div>
        <div
          className={`text-sm font-bold tabular-nums text-left whitespace-nowrap ${isPowerExceeded ? 'text-amber-700' : 'text-slate-900'
            }`}
        >
          {power}
        </div>
      </div>

      {/* 2. Berat */}
      <div className="box-border flex-1 h-fit flex flex-col gap-1.5 p-3.5 justify-start items-start bg-white ring-1 ring-slate-200 rounded-xl">
        <Scale className="w-4 h-4 text-blue-600" />
        <div className="text-[11px] text-slate-500 font-semibold tracking-wider text-left uppercase whitespace-nowrap">
          Berat
        </div>
        <div className="text-sm text-slate-900 font-bold tabular-nums text-left whitespace-nowrap">
          {weight}
        </div>
      </div>

      {/* 3. Dimensi */}
      <div className="box-border flex-1 h-fit flex flex-col gap-1.5 p-3.5 justify-start items-start bg-white ring-1 ring-slate-200 rounded-xl">
        <Box className="w-4 h-4 text-blue-600" />
        <div className="text-[11px] text-slate-500 font-semibold tracking-wider text-left uppercase whitespace-nowrap">
          Dimensi
        </div>
        <div className="text-sm text-slate-900 font-bold tabular-nums text-left whitespace-nowrap">
          {dimensions}
        </div>
      </div>

      {/* 4. Jeda Rawat */}
      <div className="box-border flex-1 h-fit flex flex-col gap-1.5 p-3.5 justify-start items-start bg-white ring-1 ring-slate-200 rounded-xl">
        <Clock className="w-4 h-4 text-blue-600" />
        <div className="text-[11px] text-slate-500 font-semibold tracking-wider text-left uppercase whitespace-nowrap">
          Jeda Rawat
        </div>
        <div className="text-sm text-slate-900 font-bold tabular-nums text-left whitespace-nowrap">
          {maintenanceBuffer}
        </div>
      </div>
    </div>
  )
}
