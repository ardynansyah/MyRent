import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Building2,
  BadgeCheck
} from 'lucide-react';

const DUMMY_USERS = [
  {
    id: 'USR-0101',
    namaUsaha: 'Dapur Roti Andini',
    penanggungJawab: 'Andini Prasetyo',
    peran: 'Penyewa UMKM',
    kategori: 'Kuliner & Bakery',
    kota: 'Jakarta Timur, DKI',
    wa: '0812-3456-7890',
    email: 'andini.roti@gmail.com',
    statusKyc: 'Menunggu KYC',
    totalSewa: '2x Transaksi',
    tanggalDaftar: '24 Okt 2026'
  },
  {
    id: 'USR-0102',
    namaUsaha: 'Sentosa Packaging Mitra',
    penanggungJawab: 'Hendra Sentosa',
    peran: 'Pemilik Alat',
    kategori: 'Kemasan & Industri',
    kota: 'Sidoarjo, Jawa Timur',
    wa: '0811-2233-4455',
    email: 'sentosa.pack@indonet.id',
    statusKyc: 'Terverifikasi',
    totalSewa: '14 Unit Alat Terdaftar',
    tanggalDaftar: '12 Sep 2026'
  },
  {
    id: 'USR-0103',
    namaUsaha: 'Kopi Senja Mitra',
    penanggungJawab: 'Senja Pratama',
    peran: 'Penyewa UMKM',
    kategori: 'F&B & Kafe',
    kota: 'Bandung, Jawa Barat',
    wa: '0813-9876-5432',
    email: 'kopisenja.bdg@gmail.com',
    statusKyc: 'Menunggu KYC',
    totalSewa: '1x Transaksi',
    tanggalDaftar: '24 Okt 2026'
  },
  {
    id: 'USR-0104',
    namaUsaha: 'Konveksi Sinar Jaya',
    penanggungJawab: 'Jaya Santoso',
    peran: 'Pemilik Alat',
    kategori: 'Tekstil & Pakaian',
    kota: 'Surabaya, Jawa Timur',
    wa: '0821-4455-6677',
    email: 'jaya.konveksi@yahoo.co.id',
    statusKyc: 'Terverifikasi',
    totalSewa: '8 Unit Mesin Jahit',
    tanggalDaftar: '05 Agu 2026'
  },
  {
    id: 'USR-0105',
    namaUsaha: 'Keripik Tempe Mbok Sri',
    penanggungJawab: 'Sri Wahyuni',
    peran: 'Penyewa UMKM',
    kategori: 'Makanan Ringan',
    kota: 'Malang, Jawa Timur',
    wa: '0852-1122-3344',
    email: 'mboksri.malang@gmail.com',
    statusKyc: 'Terverifikasi',
    totalSewa: '4x Transaksi',
    tanggalDaftar: '19 Jul 2026'
  }
];

export default function ManajemenPengguna({ onNavigateTab }) {
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const filteredUsers = DUMMY_USERS.filter((u) => {
    const matchRole =
      roleFilter === 'Semua' ||
      (roleFilter === 'Penyewa' && u.peran === 'Penyewa UMKM') ||
      (roleFilter === 'Pemilik' && u.peran === 'Pemilik Alat');

    const matchSearch =
      u.namaUsaha.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.penanggungJawab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.kota.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchRole && matchSearch;
  });

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notifikasi */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER & PENCARIAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manajemen Pengguna UMKM &amp; Pemilik Alat</h2>
          <p className="text-xs text-slate-500">
            Kelola profil usaha, kontak WhatsApp, dan kepatuhan identitas mitra terdaftar di platform MyRent.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari UMKM, penanggung jawab, kota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-64 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        {['Semua', 'Penyewa', 'Pemilik'].map((tab) => (
          <button
            key={tab}
            onClick={() => setRoleFilter(tab)}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              roleFilter === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'Semua' ? `Semua Pengguna (${DUMMY_USERS.length})` : `${tab} Alat`}
          </button>
        ))}
      </div>

      {/* DAFTAR CARD / TABEL PENGGUNA */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-4">Nama Usaha &amp; Penanggung Jawab</th>
              <th className="py-3.5 px-4">Peran &amp; Kategori</th>
              <th className="py-3.5 px-4">Kontak WhatsApp / Email</th>
              <th className="py-3.5 px-4">Lokasi Usaha</th>
              <th className="py-3.5 px-4">Status Legalitas / KYC</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80 transition">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                      {u.namaUsaha.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{u.namaUsaha}</p>
                      <p className="text-[11px] text-slate-500">PJ: {u.penanggungJawab}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                      u.peran === 'Penyewa UMKM'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {u.peran}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{u.kategori}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{u.wa}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{u.email}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{u.kota}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{u.totalSewa}</p>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.statusKyc === 'Terverifikasi'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {u.statusKyc === 'Terverifikasi' ? (
                      <BadgeCheck className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Clock className="w-3 h-3 text-amber-600" />
                    )}
                    <span>{u.statusKyc}</span>
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() =>
                        window.open(`https://wa.me/62${u.wa.replace(/[^0-9]/g, '').slice(1)}`, '_blank')
                      }
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold transition cursor-pointer"
                    >
                      Hubungi WA
                    </button>
                    {u.statusKyc === 'Menunggu KYC' && (
                      <button
                        onClick={() => onNavigateTab && onNavigateTab('kyc')}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition cursor-pointer"
                      >
                        Verifikasi
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
