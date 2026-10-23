import React, { useMemo } from 'react'
import {
  Check,
  CheckCircle2,
  Package,
  Sparkles,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react'

export default function Step2KondisiAlat({
  order,
  returnData,
  onChange
}) {
  // 1. Checklist Kondisi Fisik & Fungsi (default state)
  const checklist = returnData.checklist || {
    mesinMenyala: true,
    bodiUtuh: true,
    komponenLengkap: true,
    kebersihanOk: true,
    adaKendala: false
  }

  // 2. Aksesoris yang dikembalikan
  const defaultAccessories = [
    { id: 'portafilter', name: 'Portafilter double + single', returned: 2, total: 2 },
    { id: 'tamper', name: 'Tamper kayu / stainless', returned: 1, total: 1 },
    { id: 'pitcher', name: 'Pitcher susu 600 ml', returned: 2, total: 2 },
    { id: 'kabel', name: 'Kabel power industri', returned: 1, total: 1 }
  ]
  const accessories = returnData.accessories || defaultAccessories

  // 3. Poin Kebersihan & Perawatan
  const defaultCleanliness = {
    backflush: true,
    driptray: true,
    tangkiAir: true
  }
  const cleanliness = returnData.cleanliness || defaultCleanliness

  const notes = returnData.conditionNotes || ''

  // Hitung jumlah checklist yang sesuai
  const conditionScore = useMemo(() => {
    let score = 0
    if (checklist.mesinMenyala) score += 1
    if (checklist.bodiUtuh) score += 1
    if (checklist.komponenLengkap) score += 1
    if (checklist.kebersihanOk) score += 1
    if (!checklist.adaKendala) score += 1
    return score
  }, [checklist])

  const toggleChecklist = (key) => {
    const updated = { ...checklist, [key]: !checklist[key] }
    onChange({
      ...returnData,
      checklist: updated
    })
  }

  const toggleCleanliness = (key) => {
    const updated = { ...cleanliness, [key]: !cleanliness[key] }
    onChange({
      ...returnData,
      cleanliness: updated
    })
  }

  const updateAccessoryCount = (id, delta) => {
    const updated = accessories.map((item) => {
      if (item.id === id) {
        const nextVal = Math.max(0, Math.min(item.total, item.returned + delta))
        return { ...item, returned: nextVal }
      }
      return item
    })
    onChange({
      ...returnData,
      accessories: updated
    })
  }

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4 text-xs">
      {/* 1. Card Checklist Kondisi Alat */}
      <div className="p-5 bg-white ring-1 ring-slate-200 rounded-2xl shadow-2xs flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900 m-0">Kondisi Alat Saat Ini</h3>
            <p className="text-[11px] text-slate-500 m-0 mt-0.5">
              Centang kondisi fisik dan operasional alat sebelum dikembalikan.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-full">
            5 Poin Pemeriksaan
          </span>
        </div>

        {/* Live Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${(conditionScore / 5) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-emerald-700 tabular-nums whitespace-nowrap">
            {conditionScore}/5 sesuai
          </span>
        </div>

        {/* 5 Checklist Items */}
        <div className="flex flex-col gap-2">
          {/* Item 1: Mesin menyala */}
          <div
            onClick={() => toggleChecklist('mesinMenyala')}
            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  checklist.mesinMenyala ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-300'
                }`}
              >
                {checklist.mesinMenyala && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="font-medium text-slate-800">Mesin menyala &amp; tekanan daya stabil normal</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                checklist.mesinMenyala ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {checklist.mesinMenyala ? 'Sesuai' : 'Belum'}
            </span>
          </div>

          {/* Item 2: Bodi utuh */}
          <div
            onClick={() => toggleChecklist('bodiUtuh')}
            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  checklist.bodiUtuh ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-300'
                }`}
              >
                {checklist.bodiUtuh && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="font-medium text-slate-800">Bodi utuh, tidak ada penyok atau goresan baru</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                checklist.bodiUtuh ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {checklist.bodiUtuh ? 'Sesuai' : 'Ada Cacat'}
            </span>
          </div>

          {/* Item 3: Komponen lengkap */}
          <div
            onClick={() => toggleChecklist('komponenLengkap')}
            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  checklist.komponenLengkap ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-300'
                }`}
              >
                {checklist.komponenLengkap && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="font-medium text-slate-800">Komponen bawaan utama terpasang rapi</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                checklist.komponenLengkap ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {checklist.komponenLengkap ? 'Lengkap' : 'Kurang'}
            </span>
          </div>

          {/* Item 4: Kebersihan unit */}
          <div
            onClick={() => toggleChecklist('kebersihanOk')}
            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  checklist.kebersihanOk ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-slate-300'
                }`}
              >
                {checklist.kebersihanOk && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="font-medium text-slate-800">Unit telah dibersihkan dari residu sisa produksi</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                checklist.kebersihanOk ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {checklist.kebersihanOk ? 'Sudah Dicuci' : 'Belum'}
            </span>
          </div>

          {/* Item 5: Kendala teknis */}
          <div
            onClick={() => toggleChecklist('adaKendala')}
            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  checklist.adaKendala ? 'bg-amber-500 text-white' : 'bg-white ring-1 ring-slate-300'
                }`}
              >
                {checklist.adaKendala && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="font-medium text-slate-800">Ada kendala teknis selama pemakaian</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                checklist.adaKendala
                  ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                  : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
              }`}
            >
              {checklist.adaKendala ? 'Ada Catatan' : 'Tidak Ada'}
            </span>
          </div>
        </div>

        {/* Notes Input */}
        <div className="flex flex-col gap-1.5 pt-2">
          <label className="font-bold text-slate-700">
            Catatan Kondisi {checklist.adaKendala ? '(Wajib Diisi)' : '(Opsional)'}
          </label>
          <textarea
            value={notes}
            onChange={(e) => onChange({ ...returnData, conditionNotes: e.target.value })}
            placeholder={
              checklist.adaKendala
                ? 'Jelaskan kendala teknis atau indikasi kerusakan yang dialami...'
                : 'cth. Unit berfungsi normal, filter sudah kami cuci bersih.'
            }
            rows={2}
            className={`w-full p-2.5 bg-slate-50 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600 ${
              checklist.adaKendala && !notes.trim() ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200'
            }`}
          />
        </div>
      </div>

      {/* 2. Card Aksesoris yang Dikembalikan */}
      <div className="p-5 bg-white ring-1 ring-slate-200 rounded-2xl shadow-2xs flex flex-col gap-3.5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900 m-0">Kelengkapan Aksesoris</h3>
            <p className="text-[11px] text-slate-500 m-0 mt-0.5">
              Sesuaikan jumlah aksesoris yang dikembalikan bersama unit.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full ring-1 ring-emerald-200">
            {accessories.filter((a) => a.returned === a.total).length}/{accessories.length} Lengkap
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {accessories.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-slate-500" />
                <span className="font-medium text-slate-800">{item.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white ring-1 ring-slate-200 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => updateAccessoryCount(item.id, -1)}
                    disabled={item.returned === 0}
                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-100 disabled:opacity-30"
                  >
                    <Minus className="w-3 h-3 text-slate-600" />
                  </button>
                  <span className="w-8 text-center font-bold text-xs tabular-nums">
                    {item.returned}/{item.total}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateAccessoryCount(item.id, 1)}
                    disabled={item.returned >= item.total}
                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-100 disabled:opacity-30"
                  >
                    <Plus className="w-3 h-3 text-slate-600" />
                  </button>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.returned === item.total
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.returned === item.total ? 'Lengkap' : 'Kurang'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Card Kebersihan & Perawatan */}
      <div className="p-5 bg-white ring-1 ring-slate-200 rounded-2xl shadow-2xs flex flex-col gap-3.5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900 m-0">Kebersihan &amp; Perawatan</h3>
            <p className="text-[11px] text-slate-500 m-0 mt-0.5">
              Klik untuk mengubah status tindakan perawatan yang telah Anda lakukan.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-full">
            Rawat Mandiri
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Item 1 */}
          <div
            onClick={() => toggleCleanliness('backflush')}
            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl cursor-pointer transition-colors"
          >
            <span className="font-medium text-slate-800">Backflush grup / bilas jalur sirkulasi selesai</span>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                cleanliness.backflush ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {cleanliness.backflush ? 'Sudah' : 'Belum'}
            </span>
          </div>

          {/* Item 2 */}
          <div
            onClick={() => toggleCleanliness('driptray')}
            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl cursor-pointer transition-colors"
          >
            <span className="font-medium text-slate-800">Drip tray &amp; penampung cairan dibersihkan</span>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                cleanliness.driptray ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {cleanliness.driptray ? 'Sudah' : 'Belum'}
            </span>
          </div>

          {/* Item 3 */}
          <div
            onClick={() => toggleCleanliness('tangkiAir')}
            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl cursor-pointer transition-colors"
          >
            <span className="font-medium text-slate-800">Tangki air / corong material dikosongkan kering</span>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                cleanliness.tangkiAir ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {cleanliness.tangkiAir ? 'Sudah' : 'Belum'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
