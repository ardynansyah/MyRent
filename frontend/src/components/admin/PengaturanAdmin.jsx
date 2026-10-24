import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Clock,
  DollarSign,
  Building,
  Bell,
  CheckCircle2,
  Save,
  RotateCcw
} from 'lucide-react';

export default function PengaturanAdmin() {
  const [platformFee, setPlatformFee] = useState(5.0);
  const [slaKycHours, setSlaKycHours] = useState(24);
  const [slaMediasiHours, setSlaMediasiHours] = useState(48);
  const [bankName, setBankName] = useState('Bank Central Asia (BCA)');
  const [accNumber, setAccNumber] = useState('8830-1928-00');
  const [accHolder, setAccHolder] = useState('PT MYRENT TEKNOLOGI BERSAMA');
  const [waNotification, setWaNotification] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setToastMsg('Pengaturan sistem dan SLA platform berhasil diperbarui!');
    setTimeout(() => setToastMsg(''), 3500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Toast Notifikasi */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-slate-900">Pengaturan Sistem &amp; SLA MyRent</h2>
        <p className="text-xs text-slate-500">
          Konfigurasi operasional platform, persentase komisi, batas waktu mediasi, dan rekening escrow resmi.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Pengaturan Finansial & Biaya Platform */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Kebijakan Finansial &amp; Biaya Layanan</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Potongan Komisi Platform (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Dipotong dari nilai bersih sewa alat pemilik mesin.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Minimal Deposit Escrow Jaminan
              </label>
              <input
                type="text"
                disabled
                value="20% - 30% dari taksiran harga alat"
                className="w-full text-xs p-3 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">Standar otomatis sesuai kategori risiko mesin.</p>
            </div>
          </div>
        </div>

        {/* 2. Pengaturan Rekening Penampung Escrow */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Rekening Resmi Penampung Escrow (Rekber)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Bank Mitra</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Rekening Escrow</label>
              <input
                type="text"
                value={accNumber}
                onChange={(e) => setAccNumber(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Pemegang Rekening</label>
              <input
                type="text"
                value={accHolder}
                onChange={(e) => setAccHolder(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Batas Waktu SLA Operasional & Notifikasi */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Batas Waktu SLA Respon &amp; WhatsApp Gateway</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">SLA Review Berkas KYC (Jam)</label>
              <input
                type="number"
                value={slaKycHours}
                onChange={(e) => setSlaKycHours(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Notifikasi badge merah menyala jika melebihi batas ini.</p>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Batas Putusan Mediasi Klaim (Jam)</label>
              <input
                type="number"
                value={slaMediasiHours}
                onChange={(e) => setSlaMediasiHours(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Waktu bagi kedua pihak mengunggah bukti tambahan.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={waNotification}
                onChange={() => setWaNotification(!waNotification)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <span>Aktifkan WhatsApp Gateway Otomatis untuk Notifikasi Dana Escrow Masuk &amp; Rilis</span>
            </label>
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Sistem</span>
          </button>
        </div>
      </form>
    </div>
  );
}
