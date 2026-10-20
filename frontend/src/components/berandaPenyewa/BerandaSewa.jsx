import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import NavbarPenyewa from '../common/NavbarPenyewa'
import ChipKategori from './ChipKategori'
import SidebarFilter from './SidebarFilter'
import ProductCard from './ProductCard'

// Imported clean assets from export
import item1 from '../../assets/beranda/item_1.jpg'
import item2 from '../../assets/beranda/item_2.jpg'
import item3 from '../../assets/beranda/item_3.jpg'
import item4 from '../../assets/beranda/item_4.jpg'
import item5 from '../../assets/beranda/item_5.jpg'
import item6 from '../../assets/beranda/item_6.jpg'
import item7 from '../../assets/beranda/item_7.jpg'
import item8 from '../../assets/beranda/item_8.jpg'
import item9 from '../../assets/beranda/item_9.jpg'

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Espresso Machine La Marzocco GS3',
    meta: '1300 Watt · Min. 2 Hari',
    watt: 1300,
    price: 'Rp 150.000',
    rawPrice: 150000,
    period: '/hari',
    deposit: 'Deposit: Rp 500.000 (100% kembali)',
    distance: '2.4 km',
    status: 'Tersedia',
    category: 'Mesin Kopi',
    image: item1
  },
  {
    id: 2,
    name: 'Oven Deck Bakery 2 Pintu',
    meta: '1200 Watt · Min. 3 Hari',
    watt: 1200,
    price: 'Rp 210.000',
    rawPrice: 210000,
    period: '/hari',
    deposit: 'Deposit: Rp 750.000 (100% kembali)',
    distance: '3.1 km',
    status: 'Tersedia',
    category: 'Oven & Bakery',
    image: item2
  },
  {
    id: 3,
    name: 'Mesin Kemasan Vakum Otomatis',
    meta: '900 Watt · Min. 1 Hari',
    watt: 900,
    price: 'Rp 95.000',
    rawPrice: 95000,
    period: '/hari',
    deposit: 'Deposit: Rp 300.000 (100% kembali)',
    distance: '1.2 km',
    status: 'Tersedia',
    category: 'Mesin Kemasan',
    image: item3
  },
  {
    id: 4,
    name: 'Mesin Jahit Industri Juki DDL-8700',
    meta: '400 Watt · Min. 7 Hari',
    watt: 400,
    price: 'Rp 75.000',
    rawPrice: 75000,
    period: '/hari',
    deposit: 'Deposit: Rp 400.000 (100% kembali)',
    distance: '5.8 km',
    status: 'Tersedia',
    category: 'Konveksi',
    image: item4
  },
  {
    id: 5,
    name: 'Mixer Planetary 20 Liter',
    meta: '1100 Watt · Min. 2 Hari',
    watt: 1100,
    price: 'Rp 120.000',
    rawPrice: 120000,
    period: '/hari',
    deposit: 'Deposit: Rp 350.000 (100% kembali)',
    distance: '4.0 km',
    status: 'Tersedia',
    category: 'Oven & Bakery',
    image: item5
  },
  {
    id: 6,
    name: 'Grinder Kopi Flat Burr Elektrik',
    meta: '650 Watt · Min. 2 Hari',
    watt: 650,
    price: 'Rp 85.000',
    rawPrice: 85000,
    period: '/hari',
    deposit: 'Deposit: Rp 250.000 (100% kembali)',
    distance: '2.4 km',
    status: 'Tersedia',
    category: 'Mesin Kopi',
    image: item6
  },
  {
    id: 7,
    name: 'Mesin Espresso Otomatis 2 Grup',
    meta: '2200 Watt · Min. 3 Hari',
    watt: 2200,
    price: 'Rp 320.000',
    rawPrice: 320000,
    period: '/hari',
    deposit: 'Deposit: Rp 1.200.000 (100% kembali)',
    distance: '6.5 km',
    status: 'Tersedia',
    category: 'Mesin Kopi',
    image: item7
  },
  {
    id: 8,
    name: 'Chiller Display 2 Pintu',
    meta: '800 Watt · Min. 2 Hari',
    watt: 800,
    price: 'Rp 110.000',
    rawPrice: 110000,
    period: '/hari',
    deposit: 'Deposit: Rp 450.000 (100% kembali)',
    distance: '2.9 km',
    status: 'Tersedia',
    category: 'Mesin Kemasan',
    image: item8
  },
  {
    id: 9,
    name: 'Mesin Gulung Adonan Sheeter',
    meta: '550 Watt · Min. 3 Hari',
    watt: 550,
    price: 'Rp 90.000',
    rawPrice: 90000,
    period: '/hari',
    deposit: 'Deposit: Rp 300.000 (100% kembali)',
    distance: '7.2 km',
    status: 'Tersedia',
    category: 'Oven & Bakery',
    image: item9
  }
]

export default function BerandaSewa({
  products = INITIAL_PRODUCTS,
  onSelectProduct,
  onNavigateHome
}) {
  const [selectedCategory, setSelectedCategory] = useState('Sesuai Listrik Saya (1300W)')
  const [searchQuery, setSearchQuery] = useState('')
  const [maxPrice, setMaxPrice] = useState(500000)
  const [powerMatch, setPowerMatch] = useState(true)

  // Filter logic
  const filteredProducts = products.filter((item) => {
    // Search filter
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Category filter
    if (selectedCategory === 'Sesuai Listrik Saya (1300W)') {
      if (item.watt > 1300) return false
    } else if (selectedCategory === 'Semua Alat' || selectedCategory === 'Terdekat') {
      // keep
    } else if (item.category !== selectedCategory) {
      return false
    }

    // Power toggle filter from sidebar
    if (powerMatch && item.watt > 1300) {
      return false
    }

    // Max price
    if (item.rawPrice > maxPrice) {
      return false
    }

    return true
  })

  return (
    <div className="box-border w-full min-h-screen flex flex-col justify-start items-start bg-[#F8FAFC] font-['Plus_Jakarta_Sans',system-ui,sans-serif]">
      {/* 1. Global Navigation Bar */}
      <NavbarPenyewa
        activeTab="jelajahi"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userPower="1300 W"
        dateRange="12 – 15 Jun"
        walletBalance="Rp 1.250.000"
        userInitials="BS"
        onNavigateHome={onNavigateHome}
      />

      {/* 2. Chip Filter Bar */}
      <ChipKategori
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 3. Main Content: Sidebar + Product Grid */}
      <main className="box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col lg:flex-row gap-[24px] py-[28px] px-4 md:px-[32px] pb-[40px] justify-start items-start">
        {/* Left: Filter Sidebar */}
        <SidebarFilter
          startDate="12 Jun 2025"
          endDate="15 Jun 2025"
          powerMatch={powerMatch}
          onPowerMatchChange={setPowerMatch}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          onReset={() => {
            setSelectedCategory('Semua Alat')
            setSearchQuery('')
            setMaxPrice(500000)
            setPowerMatch(false)
          }}
          onApply={(filters) => {
            setPowerMatch(filters.powerMatch)
            setMaxPrice(filters.maxPrice)
          }}
        />

        {/* Right: Catalog Grid Area */}
        <section className="box-border flex-1 w-full h-fit flex flex-col gap-[20px] justify-start items-start">
          {/* Grid Header */}
          <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2 justify-between items-center">
            <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-[3px] justify-start items-start">
              <h1 className="text-[17px] text-[#0F172A] font-bold text-left whitespace-nowrap m-0">
                Alat tersedia untuk 12–15 Jun
              </h1>
              <div className="text-[12px] text-[#475569] font-normal text-left whitespace-nowrap">
                {filteredProducts.length} alat ·{' '}
                {powerMatch ? 'semua sesuai daya 1300 W' : 'semua kapasitas daya'}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] py-[8px] px-[12px] justify-start items-center bg-[#FFFFFF] ring-1 ring-[#E2E8F0] rounded-[8px] cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="text-[12px] text-[#0F172A] font-semibold whitespace-nowrap">
                Urutkan: Terdekat
              </span>
              <ChevronDown className="w-[14px] h-[14px] text-[#94A3B8]" />
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="w-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <p className="text-sm">Tidak ada alat yang cocok dengan filter yang dipilih.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Semua Alat')
                  setPowerMatch(false)
                  setMaxPrice(500000)
                }}
                className="mt-3 text-xs text-[#2563EB] font-semibold hover:underline"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="box-border w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                  onSelectDate={() => onSelectProduct && onSelectProduct(product)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
