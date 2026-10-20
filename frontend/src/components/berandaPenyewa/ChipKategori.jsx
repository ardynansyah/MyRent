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
    <div className="box-border w-full h-[58px] shrink-0 flex flex-row gap-2.5 px-4 md:px-8 justify-start items-center bg-white border-b border-slate-200 overflow-x-auto scrollbar-none">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory && onSelectCategory(cat)}
            className={`box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-[7px] px-3.5 justify-start items-center rounded-full transition-all cursor-pointer border-0 select-none ${
              isSelected
                ? 'bg-blue-600 text-white shadow-2xs font-medium'
                : 'bg-white ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <span className="text-xs whitespace-nowrap">{cat}</span>
          </button>
        )
      })}
    </div>
  )
}
