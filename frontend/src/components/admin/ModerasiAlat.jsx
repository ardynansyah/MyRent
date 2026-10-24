import React, { useState } from 'react';
import {
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Search,
  Filter,
  Eye,
  Check,
  RotateCcw
} from 'lucide-react';

const DUMMY_ALAT = [
  {
    id: 'EQ-041',
    nama: 'Mesin Roasting Kopi Artisanal 3kg',
    kategori: 'F&B & Kopi',
    pemilik: 'Mitra Roaster Indo',
    lokasi: 'Bandung, Jawa Barat',
    daya: '2200 Watt',
    kapasitas: '3 kg / batch (15-20 mnt)',
    tarifHarian: 350000,
    deposit: 1500000,
    status: 'Menunggu Review',
    tanggalDaftar: '24 Okt 2026, 09:30',
    foto: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80',
    catatanPemilik: 'Mesin baru servis berkala, drum cast iron mulus, burner gas normal. Siap antar wilayah Bandung Raya.',
    kelengkapan: ['Manual Book', 'Kabel Power Industri', 'Selang Regulator Gas SNI', 'Cooling Tray Spare']
  },
  {
    id: 'EQ-042',
    nama: 'Continuous Band Sealer with Gas Flushing SF-150',
    kategori: 'Kemasan & Packaging',
    pemilik: 'Sentosa Packaging Mitra',
    lokasi: 'Sidoarjo, Jawa Timur',
    daya: '650 Watt',
    kapasitas: '0-12 meter / menit',
    tarifHarian: 120000,
    deposit: 600000,
    status: 'Menunggu Review',
    tanggalDaftar: '24 Okt 2026, 08:15',
    foto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    catatanPemilik: 'Bagus untuk kemasan keripik atau camilan dengan nitrogen gas flush agar renyah tahan lama.',
    kelengkapan: ['Conveyor Belt Cadangan', 'Teflon Belt 2 Set', 'Coding Embossing Angka/Huruf']
  },
  {
    id: 'EQ-043',
    nama: 'Mesin Jahit Obras Otomatis 4 Benang High Speed',
    kategori: 'Tekstil & Konveksi',
    pemilik: 'Konveksi Berkah Mandiri',
    lokasi: 'Cimahi, Jawa Barat',
    daya: '550 Watt (Direct Drive)',
    kapasitas: '5500 jahitan / menit',
    tarifHarian: 65000,
    deposit: 350000,
    status: 'Menunggu Review',
    tanggalDaftar: '23 Okt 2026, 17:40',
    foto: 'https://images.unsplash.com/photo-1528458876885-5b6eacdd3671?auto=format&fit=crop&w=600&q=80',
    catatanPemilik: 'Motor direct drive senyap, hemat listrik hingga 70%. Dilengkapi lampu LED built-in.',
    kelengkapan: ['Meja & Kaki Jahit Standard', 'Tiang Benang 4 Susun', 'Jarum Cadangan 1 Kotak']
  },
  {
    id: 'EQ-044',
    nama: 'Rotary Deck Gas Oven Roti 12 Tray',
    kategori: 'Roti & Bakery',
    pemilik: 'Sentosa Bakery Equipment',
    lokasi: 'Sleman, D.I. Yogyakarta',
    daya: '1500 Watt + Gas LPG',
    kapasitas: '12 Loyang 40x60 cm',
    tarifHarian: 450000,
    deposit: 2500000,
    status: 'Menunggu Review',
    tanggalDaftar: '23 Okt 2026, 14:10',
    foto: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    catatanPemilik: 'Suhu stabil, timer digital berfungsi akurat, api atas bawah merata sempurna.',
    kelengkapan: ['12 Loyang Alumunium 40x60', 'Regulator Tekanan Tinggi SNI', 'Sarung Tangan Tahan Panas']
  },
  {
    id: 'EQ-035',
    nama: 'Mesin Espresso Komersial 2 Group La Marzocco Rep',
    kategori: 'F&B & Kopi',
    pemilik: 'Barista Tools Indo',
    lokasi: 'Jakarta Selatan, DKI',
    daya: '3200 Watt',
    kapasitas: 'Rotary Pump 2 Group',
    tarifHarian: 280000,
    deposit: 2000000,
    status: 'Aktif di Katalog',
    tanggalDaftar: '18 Okt 2026',
    foto: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80',
    catatanPemilik: 'Cocok untuk pop-up booth festival atau kedai kopi baru buka.',
    kelengkapan: ['Portafilter Double & Single', 'Tamper 58mm', 'Knockbox']
  }
];

export default function ModerasiAlat() {
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlatId, setSelectedAlatId] = useState(DUMMY_ALAT[0].id);
  const [toastMsg, setToastMsg] = useState('');

  const selectedAlat = DUMMY_ALAT.find((a) => a.id === selectedAlatId) || DUMMY_ALAT[0];

  const filteredList = DUMMY_ALAT.filter((item) => {
    const matchStatus =
      filterStatus === 'Semua' ||
      (filterStatus === 'Menunggu' && item.status === 'Menunggu Review') ||
      (filterStatus === 'Aktif' && item.status === 'Aktif di Katalog');
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pemilik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const formatRp = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

  return (
    <div className="space-y-6">
      {/* Toast Notifikasi */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER DAN FILTER PENCARIAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Katalog &amp; Moderasi Alat Sewa</h2>
          <p className="text-xs text-slate-500">
            Tinjau spesifikasi, uji fungsi kelistrikan, dan nilai deposit sebelum alat tayang di katalog UMKM.
          </p>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari mesin, pemilik, lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-64 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setFilterStatus('Semua')}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
            filterStatus === 'Semua' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua ({DUMMY_ALAT.length})
        </button>
        <button
          onClick={() => setFilterStatus('Menunggu')}
          className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
            filterStatus === 'Menunggu' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Menunggu Review</span>
          <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">4</span>
        </button>
        <button
          onClick={() => setFilterStatus('Aktif')}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
            filterStatus === 'Aktif' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Aktif di Katalog
        </button>
      </div>

      {/* GRID UTAMA: LIST KIRI & DETAIL KANAN */}
      <div className="grid grid-cols-12 gap-6">
        {/* KOLOM KIRI (5 col): DAFTAR ALAT */}
        <div className="col-span-12 lg:col-span-5 space-y-3">
          {filteredList.map((item) => {
            const isSelected = item.id === selectedAlatId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedAlatId(item.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex gap-3.5 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <img
                  src={item.foto}
                  alt={item.nama}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        {item.kategori}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.status === 'Menunggu Review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{item.nama}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.pemilik}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                    <span className="font-bold text-slate-900">{formatRp(item.tarifHarian)}/hr</span>
                    <span className="text-[10px] text-slate-400">Daya: {item.daya}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* KOLOM KANAN (7 col): DETAIL MODERASI & FORM KEPUTUSAN */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">{selectedAlat.id}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedAlat.nama}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {selectedAlat.lokasi} · Didaftarkan oleh: <strong>{selectedAlat.pemilik}</strong>
                  </span>
                </p>
              </div>

              <span
                className={`self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full ${
                  selectedAlat.status === 'Menunggu Review'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {selectedAlat.status}
              </span>
            </div>

            {/* Gambar preview */}
            <div className="relative rounded-xl overflow-hidden aspect-16/9 bg-slate-100 border border-slate-200">
              <img src={selectedAlat.foto} alt={selectedAlat.nama} className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                Foto Unit Nyata dari Pemilik
              </div>
            </div>

            {/* Parameter & Tarif Sewa */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tarif Sewa</span>
                <p className="text-sm font-extrabold text-blue-600 mt-0.5">{formatRp(selectedAlat.tarifHarian)}/hr</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Deposit Jaminan</span>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{formatRp(selectedAlat.deposit)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Daya Listrik</span>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{selectedAlat.daya}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kapasitas Kerja</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5 line-clamp-1">{selectedAlat.kapasitas}</p>
              </div>
            </div>

            {/* Catatan Pemilik & Kelengkapan */}
            <div className="space-y-3">
              <div>
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Catatan Kondisi Unit</h5>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-1">
                  "{selectedAlat.catatanPemilik}"
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Aksesoris &amp; Kelengkapan</h5>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedAlat.kelengkapan.map((acc, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-lg border border-blue-100 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-blue-500" />
                      <span>{acc}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel Keputusan Admin */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Catatan Verifikasi Tim Moderasi (Opsional)
              </label>
              <textarea
                rows={2}
                placeholder="Misal: Mohon pemilik memperjelas foto pelat merk ampere kelistrikan..."
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2.5 mt-4">
                <button
                  onClick={() => showNotification(`Alat ${selectedAlat.id} ditolak.`)}
                  className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer"
                >
                  Tolak Pengajuan
                </button>
                <button
                  onClick={() => showNotification(`Permintaan revisi dikirim ke ${selectedAlat.pemilik}.`)}
                  className="px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition cursor-pointer"
                >
                  Minta Revisi Video
                </button>
                <button
                  onClick={() => showNotification(`Alat ${selectedAlat.nama} BERHASIL DITERBITKAN ke Katalog Publik!`)}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Setujui &amp; Terbitkan Alat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
