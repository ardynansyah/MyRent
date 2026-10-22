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
  onSelectCategory,
  className = ''
}) {
  return (
    <div className={`box-border flex flex-row gap-2 items-center overflow-x-auto scrollbar-none py-1 ${className}`}>
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory && onSelectCategory(cat)}
            className={`box-border w-fit shrink-0 h-fit flex flex-row gap-0 py-1.5 px-3.5 justify-start items-center rounded-full transition-all cursor-pointer border-0 select-none ${
              isSelected
                ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
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
