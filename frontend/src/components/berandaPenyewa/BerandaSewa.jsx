import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Loader2, TriangleAlert } from 'lucide-react'
import NavbarPenyewa from '../common/NavbarPenyewa'
import ChipKategori from './ChipKategori'
import SidebarFilter from './SidebarFilter'
import ProductCard from './ProductCard'
import { listEquipments } from '../../lib/equipmentsApi'
import { getSessionUser, getUserPowerLimit } from '../../lib/userSession'
import { formatShortDate } from '../../lib/dateHelpers'

const ALL_CATEGORY = 'Semua Alat'
const NEAREST_CATEGORY = 'Terdekat'

// Opsi dropdown "Urutkan".
const SORT_OPTIONS = [
  { value: 'terdekat', label: 'Terdekat' },
  { value: 'termurah', label: 'Termurah' },
  { value: 'termahal', label: 'Termahal' }
]

// Filter sidebar: rentang tanggal + batas security deposit.
const createInitialFilters = () => ({
  dateRange: { start: null, end: null },
  maxDeposit: 'semua'
})

export default function BerandaSewa({
  onSelectProduct,
  onNavigateHome
}) {
  const [equipments, setEquipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [maxPrice, setMaxPrice] = useState(500000)
  const [powerMatch, setPowerMatch] = useState(true)

  // ── Urutkan (dropdown) ──────────────────────────────────────────────────
  const [sortBy, setSortBy] = useState('terdekat')
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef(null)

  // ── Filter sidebar ──────────────────────────────────────────────────────
  const [filters, setFilters] = useState(createInitialFilters)

  // Kapasitas daya listrik usaha penyewa (dari sesi login).
  const user = getSessionUser()
  const powerLimit = getUserPowerLimit(user)
  const powerMatchLabel = powerLimit ? `Sesuai Listrik Saya (${powerLimit}W)` : ALL_CATEGORY

  const [selectedCategory, setSelectedCategory] = useState(powerMatchLabel)

  // Tutup dropdown "Urutkan" saat klik di luar atau tekan Escape.
  useEffect(() => {
    if (!sortOpen) return undefined

    const handlePointerDown = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSortOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [sortOpen])

  // ── Ambil katalog alat dari backend ─────────────────────────────────────
  useEffect(() => {
    let isActive = true

    const loadEquipments = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await listEquipments()
        if (isActive) setEquipments(data)
      } catch (err) {
        if (isActive) {
          setEquipments([])
          setError(err.message || 'Gagal memuat katalog alat')
        }
      } finally {
        if (isActive) setLoading(false)
      }
    }

    loadEquipments()

    return () => {
      isActive = false
    }
  }, [])

  // Kategori chip dihitung dari data yang benar-benar ada di database.
  const categories = useMemo(() => {
    const fromData = Array.from(
      new Set(equipments.map((item) => item.category).filter(Boolean))
    )

    return [
      ALL_CATEGORY,
      ...(powerLimit ? [powerMatchLabel] : []),
      ...fromData,
      NEAREST_CATEGORY
    ]
  }, [equipments, powerLimit, powerMatchLabel])

  // Batas deposit aktif ('semua' = tanpa batas).
  const maxDeposit = filters.maxDeposit === 'semua' ? Infinity : Number(filters.maxDeposit)

  // Filter logic
  const filteredProducts = useMemo(() => {
    return equipments.filter((item) => {
      // Search filter
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Category filter
      if (selectedCategory === powerMatchLabel && powerLimit) {
        if (item.powerWatt > powerLimit) return false
      } else if (selectedCategory === ALL_CATEGORY || selectedCategory === NEAREST_CATEGORY) {
        // keep
      } else if (item.category !== selectedCategory) {
        return false
      }

      // Power toggle filter from sidebar
      if (powerMatch && powerLimit && item.powerWatt > powerLimit) {
        return false
      }

      // Max price
      if (item.pricePerDay > maxPrice) {
        return false
      }

      // Batas security deposit (filter sidebar)
      if (Number(item.deposit) > maxDeposit) {
        return false
      }

      return true
    })
  }, [equipments, searchQuery, selectedCategory, powerMatch, powerLimit, powerMatchLabel, maxPrice, maxDeposit])

  // Sorting hasil filter sesuai pilihan dropdown "Urutkan".
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]

    if (sortBy === 'termurah') {
      return list.sort((a, b) => Number(a.pricePerDay) - Number(b.pricePerDay))
    }

    if (sortBy === 'termahal') {
      return list.sort((a, b) => Number(b.pricePerDay) - Number(a.pricePerDay))
    }

    // 'terdekat' → jarak (km) terdekat lebih dulu
    return list.sort((a, b) => Number(a.distance) - Number(b.distance))
  }, [filteredProducts, sortBy])

  // Label rentang tanggal untuk header & navbar.
  const dateRangeLabel = useMemo(() => {
    const { start, end } = filters.dateRange

    if (start && end) return `${formatShortDate(start)} – ${formatShortDate(end)}`
    if (start) return formatShortDate(start)
    if (end) return formatShortDate(end)

    return 'Semua tanggal'
  }, [filters.dateRange])

  const activeSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortBy)?.label ?? 'Terdekat'

  const resetFilters = () => {
    setSelectedCategory(ALL_CATEGORY)
    setSearchQuery('')
    setMaxPrice(500000)
    setPowerMatch(false)
    setFilters(createInitialFilters())
  }

  return (
    <div className="box-border w-full min-h-screen flex flex-col justify-start items-start bg-slate-50">
      {/* 1. Global Navigation Bar */}
      <NavbarPenyewa
        activeTab="jelajahi"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateRange={dateRangeLabel}
        walletBalance="Rp 1.250.000"
        onNavigateHome={onNavigateHome}
      />

      {/* 2. Chip Filter Bar */}
      <ChipKategori
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 3. Main Content: Sidebar + Product Grid */}
      <main className="box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col lg:flex-row gap-6 py-7 px-4 md:px-8 pb-10 justify-start items-start">
        {/* Left: Filter Sidebar */}
        <SidebarFilter
          filters={filters}
          onFiltersChange={setFilters}
          powerMatch={powerMatch}
          onPowerMatchChange={setPowerMatch}
          powerLimit={powerLimit}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          onReset={resetFilters}
          onApply={(next) => {
            setPowerMatch(next.powerMatch)
            setMaxPrice(next.maxPrice)
            setFilters((prev) => ({ ...prev, maxDeposit: next.maxDeposit }))
          }}
        />

        {/* Right: Catalog Grid Area */}
        <section className="box-border flex-1 w-full h-fit flex flex-col gap-5 justify-start items-start">
          {/* Grid Header */}
          <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2 justify-between items-center">
            <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-[3px] justify-start items-start">
              <h1 className="text-[17px] text-slate-900 font-bold text-left whitespace-nowrap m-0">
                Alat tersedia untuk <span className="tabular-nums">{dateRangeLabel}</span>
              </h1>
              <div className="text-xs text-slate-600 font-normal text-left whitespace-nowrap tabular-nums">
                {loading ? 'Memuat katalog…' : `${sortedProducts.length} alat · `}
                {powerMatch && powerLimit ? `semua sesuai daya ${powerLimit} W` : 'semua kapasitas daya'}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div ref={sortRef} className="relative box-border w-fit shrink-0 h-fit">
              <button
                type="button"
                onClick={() => setSortOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                className="box-border w-fit shrink-0 h-fit flex flex-row gap-2 py-2 px-3 justify-start items-center bg-white ring-1 ring-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <span className="text-xs text-slate-900 font-semibold whitespace-nowrap">
                  Urutkan: {activeSortLabel}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    sortOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {sortOpen && (
                <ul
                  role="listbox"
                  aria-label="Urutkan alat"
                  className="absolute right-0 top-[calc(100%+6px)] z-50 w-[168px] box-border flex flex-col gap-0.5 p-1.5 bg-white ring-1 ring-slate-200 rounded-[10px] shadow-lg shadow-slate-900/10"
                >
                  {SORT_OPTIONS.map((option) => {
                    const isSelected = sortBy === option.value

                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSortBy(option.value)
                            setSortOpen(false)
                          }}
                          className={`box-border w-full flex flex-row gap-2 py-2 px-2.5 justify-between items-center rounded-lg cursor-pointer border-0 transition-colors ${
                            isSelected
                              ? 'bg-blue-50 text-blue-700 font-bold'
                              : 'bg-white text-slate-600 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span className="text-xs whitespace-nowrap">{option.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Status pemuatan / error */}
          {loading && (
            <div className="w-full bg-white rounded-2xl border border-slate-200 p-12 flex flex-col gap-3 items-center justify-center text-slate-500">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <p className="text-sm">Memuat katalog alat dari server…</p>
            </div>
          )}

          {!loading && error && (
            <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-8 flex flex-col gap-3 items-center justify-center text-amber-800">
              <TriangleAlert className="w-6 h-6 text-amber-600" />
              <p className="text-sm font-semibold">Katalog alat gagal dimuat</p>
              <p className="text-xs text-center">{error}</p>
              <p className="text-[11px] text-amber-700/80 text-center">
                Pastikan backend berjalan di http://localhost:3000
              </p>
            </div>
          )}

          {!loading && !error && sortedProducts.length === 0 ? (
            <div className="w-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <p className="text-sm">Tidak ada alat yang cocok dengan filter yang dipilih.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            !loading && !error && (
              <div className="box-border w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                    onSelectDate={() => onSelectProduct && onSelectProduct(product)}
                  />
                ))}
              </div>
            )
          )}
        </section>
      </main>
    </div>
  )
}
