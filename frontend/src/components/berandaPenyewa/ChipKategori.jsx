import React from 'react'

const DEFAULT_CATEGORIES = [
  'Semua Alat',
  'Sesuai Listrik Saya (1300W)',
  'Mesin Kopi',
  'Oven & Bakery',
  'Mesin Kemasan',
  'Konveksi',
  'Terdekat'
]

export default function ChipKategori({
  categories = DEFAULT_CATEGORIES,
  selectedCategory = 'Sesuai Listrik Saya (1300W)',
  onSelectCategory
}) {
  return (
    <div className="box-border w-full h-[58px] shrink-0 flex flex-row gap-[10px] px-4 md:px-8 justify-start items-center bg-[#FFFFFF] border-b border-[#E2E8F0] overflow-x-auto scrollbar-none font-['Plus_Jakarta_Sans',system-ui,sans-serif]">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory && onSelectCategory(cat)}
            className={`box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-[7px] px-[14px] justify-start items-center rounded-full transition-all cursor-pointer border-0 select-none ${
              isSelected
                ? 'bg-[#2563EB] text-[#FFFFFF] shadow-2xs font-medium'
                : 'bg-[#FFFFFF] ring-1 ring-[#E2E8F0] text-[#475569] hover:bg-slate-50 font-medium'
            }`}
          >
            <span className="text-[12px] whitespace-nowrap">{cat}</span>
          </button>
        )
      })}
    </div>
  )
}
