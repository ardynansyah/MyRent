import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Package,
  Scale,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Receipt,
  ChevronRight,
  Coins
} from 'lucide-react';

export default function DashboardUtama({ onNavigateTab }) {
  // Data dummy statistik KPI utama
  const stats = [
    {
      title: 'Total Omzet Sewa Platform',
      value: 'Rp 148.650.000',
      change: '+14,2% bln ini',
      isPositive: true,
      subtext: '84 transaksi selesai',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Saldo Escrow Ditahan',
      value: 'Rp 42.800.000',
      change: 'Aman di rekening penampung',
      isPositive: true,
      subtext: 'Jaminan 38 unit sewa aktif',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Tingkat Okupansi Alat',
      value: '78,4%',
      change: '+5,1% vs bln lalu',
      isPositive: true,
      subtext: '52 dari 66 unit aktif disewa',
      icon: Package,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Tugas Butuh Tindakan',
      value: '13 Kasus',
      change: 'Perlu review admin',
      isPositive: false,
      subtext: '7 KYC · 2 Klaim · 4 Alat baru',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  // Data transaksi sewa real-time terkini
  const recentTransactions = [
    {
      id: 'TRX-2406-089',
      alat: 'Continuous Band Sealer SF-150W',
      penyewa: 'Keripik Tempe Mbok Sri',
      pemilik: 'Sentosa Packaging Mitra',
      durasi: '14 Hari',
      total: 1680000,
      deposit: 500000,
      status: 'Sewa Berjalan',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      tanggal: '24 Okt 2026'
    },
    {
      id: 'TRX-2406-088',
      alat: 'Mesin Espresso Komersial 2 Group',
      penyewa: 'Kopi Senja Mitra',
      pemilik: 'Barista Tools Indo',
      durasi: '30 Hari',
      total: 7500000,
      deposit: 2000000,
      status: 'Klaim Sengketa',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      tanggal: '23 Okt 2026'
    },
    {
      id: 'TRX-2406-087',
      alat: 'Mesin Jahit Obras Juki Direct Drive',
      penyewa: 'Konveksi Berkah Mandiri',
      pemilik: 'Jaya Abadi Garment',
      durasi: '7 Hari',
      total: 700000,
      deposit: 300000,
      status: 'Menunggu Pengembalian',
      statusColor: 'bg-purple-50 text-purple-700 border-purple-200',
      tanggal: '22 Okt 2026'
    },
    {
      id: 'TRX-2406-086',
      alat: 'Planetary Mixer Roti 20 Liter',
      penyewa: 'Dapur Roti Andini',
      pemilik: 'Sentosa Bakery Equipment',
      durasi: '30 Hari',
      total: 3600000,
      deposit: 1200000,
      status: 'Selesai & Escrow Rilis',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      tanggal: '21 Okt 2026'
    }
  ];

  // Kategori okupansi alat
  const categories = [
    { nama: 'F&B & Mesin Kopi', unit: 22, okupansi: 85, color: 'bg-amber-500' },
    { nama: 'Tekstil & Konveksi', unit: 18, okupansi: 72, color: 'bg-blue-500' },
    { nama: 'Kemasan & Packaging', unit: 16, okupansi: 88, color: 'bg-emerald-500' },
    { nama: 'Roti & Bakery', unit: 10, okupansi: 60, color: 'bg-purple-500' }
  ];

  const formatRp = (num) => {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6">
      {/* 1. KARTU STATISTIK UTAMA (KPI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{s.title}</span>
                <div className={`w-9 h-9 rounded-xl ${s.bgColor} ${s.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">{s.value}</div>
                <div className="flex items-center gap-2 mt-1.5 text-xs">
                  <span className={s.isPositive ? 'font-semibold text-emerald-600' : 'font-semibold text-amber-600'}>
                    {s.change}
                  </span>
                  <span className="text-slate-400">· {s.subtext}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. BANNER PRIORITAS TINDAKAN (ACTION REQUIRED) */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-xs font-bold text-white mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>SLA Penanganan Hari Ini</span>
          </div>
          <h2 className="text-lg font-bold">Ada 7 Berkas Verifikasi KYC &amp; 2 Klaim Mediasi Menunggu</h2>
          <p className="text-xs text-blue-100 max-w-xl">
            SLA review adalah 24 jam agar calon penyewa UMKM dapat segera menyewa mesin produksi untuk usahanya.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab && onNavigateTab('kyc')}
            className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            Review Antrean KYC (7)
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('klaim')}
            className="px-4 py-2 bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-xs rounded-xl border border-white/20 transition cursor-pointer"
          >
            Mediasi Sengketa (2)
          </button>
        </div>
      </div>

      {/* 3. GRID 2 KOLOM: OKUPANSI KATEGORI & AKSI CEPAT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri (2 span): Transaksi Terkini */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Persewaan &amp; Escrow Terkini</h3>
              <p className="text-xs text-slate-500">Aktivitas transaksi sewa mesin UMKM real-time</p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('transaksi')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {recentTransactions.map((t) => (
              <div key={t.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-600">{t.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${t.statusColor}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{t.alat}</p>
                  <p className="text-xs text-slate-500">
                    Penyewa: <strong className="text-slate-700">{t.penyewa}</strong> · Pemilik: {t.pemilik}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <p className="text-sm font-extrabold text-slate-900">{formatRp(t.total)}</p>
                  <p className="text-[11px] text-slate-500">
                    Escrow: <strong className="text-emerald-600">{formatRp(t.deposit)}</strong> · {t.durasi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan (1 span): Ringkasan Okupansi Alat & Kategori */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Okupansi Kategori Alat</h3>
                <p className="text-xs text-slate-500">Tingkat utilisasi mesin produksi</p>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('alat')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Katalog
              </button>
            </div>

            <div className="space-y-4 mt-5">
              {categories.map((c, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 font-semibold">{c.nama}</span>
                    <span className="text-slate-500">
                      {c.okupansi}% <span className="text-[11px]">({c.unit} Unit)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${c.color}`}
                      style={{ width: `${c.okupansi}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-5 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Alat Terdaftar:</span>
              <strong className="text-slate-800">66 Unit Mesin</strong>
            </div>
            <div className="flex items-center justify-between text-xs mt-1.5">
              <span className="text-slate-500">Sedang Disewa Aktif:</span>
              <strong className="text-blue-600">52 Unit</strong>
            </div>
            <div className="flex items-center justify-between text-xs mt-1.5">
              <span className="text-slate-500">Menunggu Moderasi:</span>
              <strong className="text-amber-600">4 Unit Baru</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
