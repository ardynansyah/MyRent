import { useState } from 'react'
import {
  Building2,
  Car,
  KeyRound,
  TrendingUp,
  Users,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  DollarSign,
  Sparkles,
  CheckCircle2
} from 'lucide-react'

const initialRentals = [
  {
    id: 1,
    title: 'Apartemen Sudirman Suites 2BR',
    category: 'Properti',
    price: 'Rp 8.500.000',
    period: '/bulan',
    status: 'Tersedia',
    statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    tenant: 'Belum Tersewa',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    tags: ['Furnished', 'Pool Access', 'Gym']
  },
  {
    id: 2,
    title: 'Honda CR-V Turbo Prestige 2023',
    category: 'Kendaraan',
    price: 'Rp 750.000',
    period: '/hari',
    status: 'Disewa',
    statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    tenant: 'Budi Santoso (s/d 22 Okt)',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    tags: ['Automatic', 'Lepas Kunci', 'Asuransi All Risk']
  },
  {
    id: 3,
    title: 'Sony Alpha 7 IV + Lensa 24-70mm GM',
    category: 'Peralatan',
    price: 'Rp 450.000',
    period: '/hari',
    status: 'Tersedia',
    statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    tenant: 'Belum Tersewa',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    tags: ['4K Video', '2 Baterai', 'SD Card 128GB']
  },
  {
    id: 4,
    title: 'Villa Nuansa Asri Puncak Bogor',
    category: 'Properti',
    price: 'Rp 2.200.000',
    period: '/malam',
    status: 'Tersedia',
    statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    tenant: 'Belum Tersewa',
    rating: '4.95',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    tags: ['Private Pool', '4 Kamar', 'BBQ Area']
  }
]

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const categories = ['Semua', 'Properti', 'Kendaraan', 'Peralatan']

  const filteredRentals = initialRentals.filter((item) => {
    const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Notification Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 border border-indigo-400/30 animate-bounce text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                MyRent
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                React 19 + Tailwind v4
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari properti, kendaraan, atau alat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 text-sm rounded-xl pl-10 pr-4 py-2 text-slate-200 placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Notifikasi sudah diperbarui')}
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-all"
              title="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            </button>

            <button
              onClick={() => showToast('Fitur Tambah Unit siap dikembangkan!')}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Tambah Unit</span>
            </button>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700/60 flex items-center justify-center font-bold text-xs text-indigo-300">
              AR
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900/80 border border-indigo-500/20 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 -mb-12 w-64 h-64 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tech Stack Siap Digunakan</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Kelola Semua Rental Anda dengan{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">
                MyRent Platform
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Frontend telah berhasil diinisialisasi menggunakan <strong>React.js (Vite)</strong> dan <strong>Tailwind CSS v4</strong>. Konfigurasi super cepat, zero-config styling, dan siap untuk integrasi API backend.
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Aset Rental</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-white">24 Unit</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+3 unit baru bulan ini</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Sedang Disewa</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-white">18 Unit</div>
              <div className="text-xs text-slate-400 mt-1">75% Tingkat Okupansi</div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Estimasi Omset Bulan Ini</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-white">Rp 48.5jt</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.4% dari bulan lalu</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Penyewa Aktif</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-white">16 Klien</div>
              <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>100% Terverifikasi KTP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Katalog Unit Rental</h2>
              <p className="text-xs sm:text-sm text-slate-400">Daftar inventaris aset aktif yang dikelola di sistem MyRent</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredRentals.length > 0 ? (
              filteredRentals.map((item) => (
                <div
                  key={item.id}
                  className="group bg-slate-900/60 rounded-2xl border border-slate-800/90 overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                      ★ {item.rating}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] font-medium text-indigo-400 uppercase tracking-wider">
                        {item.category}
                      </div>
                      <h3 className="text-sm font-semibold text-white mt-1 group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-500">Tarif Rental</div>
                        <div className="text-sm font-bold text-white">
                          {item.price}
                          <span className="text-xs font-normal text-slate-400">{item.period}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => showToast(`Detail ${item.title} dibuka`)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 transition-all"
                        title="Lihat Detail"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500">
                Tidak ada data rental yang sesuai dengan pencarian atau filter.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 MyRent. Dibangun dengan React 19, Vite, dan Tailwind CSS v4.</p>
      </footer>
    </div>
  )
}
