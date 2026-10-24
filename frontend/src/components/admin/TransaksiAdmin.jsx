import React, { useState } from 'react';
import {
  ReceiptText,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Download,
  Eye,
  FileCheck2,
  Scale
} from 'lucide-react';

const DUMMY_TRANSAKSI = [
  {
    id: 'INV-2406-089',
    alat: 'Continuous Band Sealer SF-150W',
    penyewa: 'Keripik Tempe Mbok Sri',
    pemilik: 'Sentosa Packaging Mitra',
    mulaiSewa: '14 Okt 2026',
    selesaiSewa: '28 Okt 2026',
    biayaSewa: 1680000,
    depositEscrow: 500000,
    biayaAdmin: 84000,
    status: 'Sewa Berjalan',
    statusEscrow: 'Tertahan Aman',
    metodeBayar: 'BCA Virtual Account'
  },
  {
    id: 'INV-2406-088',
    alat: 'Mesin Espresso Komersial 2 Group',
    penyewa: 'Kopi Senja Mitra',
    pemilik: 'Barista Tools Indo',
    mulaiSewa: '24 Sep 2026',
    selesaiSewa: '24 Okt 2026',
    biayaSewa: 7500000,
    depositEscrow: 2000000,
    biayaAdmin: 375000,
    status: 'Klaim Sengketa',
    statusEscrow: 'Dibekukan dalam Mediasi',
    metodeBayar: 'Mandiri Livin'
  },
  {
    id: 'INV-2406-087',
    alat: 'Mesin Jahit Obras Juki Direct Drive',
    penyewa: 'Konveksi Berkah Mandiri',
    pemilik: 'Jaya Abadi Garment Tools',
    mulaiSewa: '18 Okt 2026',
    selesaiSewa: '25 Okt 2026',
    biayaSewa: 700000,
    depositEscrow: 300000,
    biayaAdmin: 35000,
    status: 'Menunggu Pengembalian',
    statusEscrow: 'Tertahan Aman',
    metodeBayar: 'QRIS Dinamis'
  },
  {
    id: 'INV-2406-086',
    alat: 'Planetary Mixer Roti 20L',
    penyewa: 'Dapur Roti Andini',
    pemilik: 'Sentosa Bakery Equipment',
    mulaiSewa: '20 Sep 2026',
    selesaiSewa: '20 Okt 2026',
    biayaSewa: 3600000,
    depositEscrow: 1200000,
    biayaAdmin: 180000,
    status: 'Siap Rilis Deposit',
    statusEscrow: 'Alat Diterima Baik',
    metodeBayar: 'BNI Virtual Account'
  },
  {
    id: 'INV-2406-085',
    alat: 'Mesin Coding Tanggal Kadaluarsa Handheld',
    penyewa: 'Sambal Bu Broto',
    pemilik: 'Sentosa Packaging Mitra',
    mulaiSewa: '10 Okt 2026',
    selesaiSewa: '17 Okt 2026',
    biayaSewa: 550000,
    depositEscrow: 250000,
    biayaAdmin: 27500,
    status: 'Selesai & Dicairkan',
    statusEscrow: 'Selesai (Deposit Dikembalikan)',
    metodeBayar: 'BCA Virtual Account'
  }
];

export default function TransaksiAdmin({ onNavigateTab }) {
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const filteredList = DUMMY_TRANSAKSI.filter((tx) => {
    const matchStatus =
      filterStatus === 'Semua' ||
      (filterStatus === 'Berjalan' && tx.status === 'Sewa Berjalan') ||
      (filterStatus === 'Siap Rilis' && tx.status === 'Siap Rilis Deposit') ||
      (filterStatus === 'Sengketa' && tx.status === 'Klaim Sengketa') ||
      (filterStatus === 'Selesai' && tx.status === 'Selesai & Dicairkan');

    const matchSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.alat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.penyewa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.pemilik.toLowerCase().includes(searchQuery.toLowerCase());

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

      {/* 1. RINGKASAN SALDO ESCROW PLATFORM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Escrow Tertahan</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">Rp 42.800.000</div>
          <p className="text-[11px] text-slate-400 mt-1">38 jaminan unit sewa aktif</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Siap Dirilis ke Penyewa</span>
            <FileCheck2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-blue-600 mt-2">Rp 12.600.000</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Alat telah dikembalikan aman</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Dibekukan (Sengketa)</span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-600 mt-2">Rp 3.200.000</div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">2 kasus proses mediasi</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Pendapatan Komisi (Fee)</span>
            <ReceiptText className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">Rp 14.865.000</div>
          <p className="text-[11px] text-slate-400 mt-1">5% rata-rata potongan transaksi</p>
        </div>
      </div>

      {/* 2. HEADER TABEL & PENCARIAN */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Daftar Transaksi Persewaan &amp; Escrow</h3>
            <p className="text-xs text-slate-500">
              Pelacakan pencairan dana sewa ke pemilik dan pengembalian uang jaminan ke penyewa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari invoice, alat, penyewa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-60 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => showNotification('Data transaksi berhasil diekspor ke format CSV.')}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
            </button>
          </div>
        </div>

        {/* Filter tombol status */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3 text-xs font-semibold">
          {['Semua', 'Berjalan', 'Siap Rilis', 'Sengketa', 'Selesai'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterStatus === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'Semua' ? `Semua (${DUMMY_TRANSAKSI.length})` : tab}
            </button>
          ))}
        </div>

        {/* TABEL TRANSAKSI */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-y border-slate-100">
              <tr>
                <th className="py-3 px-3">No. Invoice &amp; Tanggal</th>
                <th className="py-3 px-3">Unit Mesin / Alat</th>
                <th className="py-3 px-3">Penyewa &amp; Pemilik</th>
                <th className="py-3 px-3">Biaya Sewa</th>
                <th className="py-3 px-3">Escrow Jaminan</th>
                <th className="py-3 px-3">Status Transaksi</th>
                <th className="py-3 px-3 text-right">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredList.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-3">
                    <span className="font-mono font-bold text-blue-600">{tx.id}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{tx.mulaiSewa} s/d {tx.selesaiSewa}</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900">{tx.alat}</p>
                    <p className="text-[10px] text-slate-400">{tx.metodeBayar}</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="text-slate-800 font-semibold">{tx.penyewa}</p>
                    <p className="text-[10px] text-slate-400">Pemilik: {tx.pemilik}</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900">{formatRp(tx.biayaSewa)}</p>
                    <p className="text-[10px] text-slate-400">Fee: {formatRp(tx.biayaAdmin)}</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-extrabold text-emerald-600">{formatRp(tx.depositEscrow)}</p>
                    <span className="text-[10px] text-slate-400">{tx.statusEscrow}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        tx.status === 'Sewa Berjalan'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : tx.status === 'Klaim Sengketa'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : tx.status === 'Siap Rilis Deposit'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {tx.status === 'Siap Rilis Deposit' && (
                      <button
                        onClick={() =>
                          showNotification(`Deposit ${formatRp(tx.depositEscrow)} berhasil ditransfer kembali ke rekening ${tx.penyewa}.`)
                        }
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition cursor-pointer"
                      >
                        Rilis Deposit
                      </button>
                    )}
                    {tx.status === 'Klaim Sengketa' && (
                      <button
                        onClick={() => onNavigateTab && onNavigateTab('klaim')}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-bold shadow-xs transition cursor-pointer"
                      >
                        Buka Mediasi
                      </button>
                    )}
                    {tx.status === 'Sewa Berjalan' && (
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                      >
                        Detail Sewa
                      </button>
                    )}
                    {tx.status === 'Selesai & Dicairkan' && (
                      <span className="text-[11px] text-slate-400 font-medium">Tutup Transaksi</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL BUKTI / SERAH TERIMA JIKA DIKLIK */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">{selectedTx.id}</span>
                <h3 className="text-base font-bold text-slate-900">Rincian Dokumen &amp; Escrow Sewa</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{selectedTx.alat}</p>
                <p className="text-slate-500 mt-0.5">
                  Penyewa: <strong>{selectedTx.penyewa}</strong> · Pemilik: <strong>{selectedTx.pemilik}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-100 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Biaya Sewa Bersih</span>
                  <p className="font-extrabold text-sm text-slate-900 mt-0.5">{formatRp(selectedTx.biayaSewa)}</p>
                </div>
                <div className="border border-slate-100 p-3 rounded-xl bg-emerald-50/50">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase">Deposit Ditahan (Escrow)</span>
                  <p className="font-extrabold text-sm text-emerald-700 mt-0.5">{formatRp(selectedTx.depositEscrow)}</p>
                </div>
              </div>

              <div className="border border-slate-100 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Checklist Serah Terima Alat</span>
                <ul className="mt-1 space-y-1 text-slate-600 text-[11px]">
                  <li>✔ Berita Acara Serah Terima (BAST) fisik telah ditandatangani.</li>
                  <li>✔ Foto kondisi fisik awal sebelum dioperasikan tersimpan di server.</li>
                  <li>✔ Nomor rekening refund terverifikasi via buku tabungan pemohon.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
