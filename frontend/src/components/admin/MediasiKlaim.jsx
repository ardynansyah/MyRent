import React, { useState } from 'react';
import {
  Scale,
  Wrench,
  CircleCheck,
  Pencil,
  MessageSquare,
  Calculator,
  AlertCircle,
  FileText,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

const DUMMY_KLAIM_LIST = [
  {
    id: 'KLAIM-2406-002',
    invoice: 'INV-2405-092',
    alat: 'Mesin Jahit Industri Juki High Speed',
    pemilik: 'Konveksi Sinar Jaya',
    penyewa: 'Kopi Senja Mitra',
    depositTotal: 1200000,
    tuntutanPemilik: 850000,
    alasan: 'Dinamo motor terbakar dan bodi samping lecet setelah pemakaian lembur 3 shift berturut-turut.',
    jawabanPenyewa: 'Mesin sudah panas berlebih sejak hari kedua pemakaian. Sudah dilaporkan via chat tetapi lambat direspons.',
    status: 'Dalam Mediasi'
  },
  {
    id: 'KLAIM-2406-003',
    invoice: 'INV-2406-088',
    alat: 'Mesin Espresso Komersial 2 Group',
    pemilik: 'Barista Tools Indo',
    penyewa: 'Kopi Senja Mitra',
    depositTotal: 2000000,
    tuntutanPemilik: 1200000,
    alasan: 'Gasket group head bocor dan tekanan boiler tidak stabil saat unit dikembalikan.',
    jawabanPenyewa: 'Kualitas air sudah difilter sesuai SOP kafe kami, dugaan kerak dari penggunaan pemilik sebelumnya.',
    status: 'Menunggu Putusan'
  }
];

export default function MediasiKlaim() {
  const [selectedKlaimId, setSelectedKlaimId] = useState(DUMMY_KLAIM_LIST[0].id);
  const selectedKlaim = DUMMY_KLAIM_LIST.find((k) => k.id === selectedKlaimId) || DUMMY_KLAIM_LIST[0];

  // State nominal kompensasi yang dialokasikan ke pemilik alat
  const [ownerCompensation, setOwnerCompensation] = useState(600000);
  const tenantRefund = selectedKlaim.depositTotal - ownerCompensation;

  // State percakapan mediasi 3 arah
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Konveksi Sinar Jaya',
      role: 'Pemilik Alat',
      text: 'Motor mesin terbakar setelah dipakai lembur 3 shift. Kami minta ganti rugi servis Rp 850.000.',
      isRight: false,
      bgColor: 'bg-white',
      borderColor: 'border-slate-200'
    },
    {
      id: 2,
      sender: 'Kopi Senja Mitra',
      role: 'Penyewa UMKM',
      text: 'Mesin sudah panas sejak hari kedua. Kami laporkan ke pemilik lewat chat tapi tidak ditanggapi.',
      isRight: true,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 3,
      sender: 'Rani Admin',
      role: 'Admin MyRent',
      text: 'Mohon kedua pihak unggah log chat dan nota servis bengkel resmi. Keputusan alokasi deposit akan ditentukan berdasarkan bukti faktual.',
      isRight: false,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'Rani Admin',
      role: 'Admin MyRent',
      text: inputMsg,
      isRight: false,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  const formatRupiah = (val) => {
    return 'Rp ' + Number(val).toLocaleString('id-ID');
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

      {/* HEADER PENJELASAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Mediasi Sengketa Klaim Deposit Escrow</h2>
          <p className="text-xs text-slate-500">
            Fasilitasi komunikasi dan tetapkan alokasi pembagian dana jaminan sewa secara adil bagi pemilik &amp; penyewa.
          </p>
        </div>
        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
          2 Sengketa Aktif
        </span>
      </div>

      {/* GRID 12 KOLOM: TIKET SENGKETA KIRI & LEMBAR MEDIASI KANAN */}
      <div className="grid grid-cols-12 gap-6">
        {/* KOLOM KIRI (4 col): DAFTAR KASUS */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kasus Sengketa Aktif</span>
            <span className="text-xs text-slate-400">Prioritas Tinggi</span>
          </div>

          <div className="space-y-2.5">
            {DUMMY_KLAIM_LIST.map((c) => {
              const isSelected = c.id === selectedKlaimId;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedKlaimId(c.id);
                    setOwnerCompensation(Math.round(c.depositTotal / 2));
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono font-bold text-slate-700">{c.id}</span>
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      {c.status}
                    </span>
                  </div>
                  <h4 className="mt-2 font-bold text-slate-900 text-xs leading-snug">{c.alat}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {c.pemilik} vs {c.penyewa}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[11px]">
                    <span className="text-slate-400">Deposit:</span>
                    <strong className="text-blue-600">{formatRupiah(c.depositTotal)}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KOLOM KANAN (8 col): LEMBAR KEPUTUSAN MEDIASI & CHAT */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            {/* Header Klaim Terpilih */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] text-blue-600 font-mono font-bold uppercase">
                  {selectedKlaim.id} · {selectedKlaim.invoice}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedKlaim.alat}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pemilik: <strong>{selectedKlaim.pemilik}</strong> vs Penyewa: <strong>{selectedKlaim.penyewa}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Escrow Ditahan</span>
                <span className="text-base font-black text-blue-600">{formatRupiah(selectedKlaim.depositTotal)}</span>
              </div>
            </div>

            {/* Rincian Aduan & Tuntutan */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-rose-800">
                  <span>Tuntutan Ganti Rugi Pemilik: {formatRupiah(selectedKlaim.tuntutanPemilik)}</span>
                  <span className="text-[10px] bg-rose-100 px-2 py-0.5 rounded text-rose-700">Nota Terlampir</span>
                </div>
                <p className="text-rose-900/80 leading-relaxed text-[11px]">"{selectedKlaim.alasan}"</p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-blue-800">
                  <span>Sanggahan dari Pihak Penyewa (UMKM)</span>
                  <span className="text-[10px] bg-blue-100 px-2 py-0.5 rounded text-blue-700">Minta Refund Penuh</span>
                </div>
                <p className="text-blue-900/80 leading-relaxed text-[11px]">"{selectedKlaim.jawabanPenyewa}"</p>
              </div>
            </div>

            {/* Diskusi Mediasi Interaktif (Chat 3 Pihak) */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ruang Diskusi Mediasi 3 Pihak</span>
                </h4>
                <span className="text-[10px] text-slate-400">Dipantau langsung oleh Admin MyRent</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 max-h-56 overflow-y-auto">
                {messages.map((m) => (
                  <div key={m.id} className={`flex flex-col gap-1 ${m.isRight ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[10px] font-bold text-slate-800">{m.sender}</span>
                      <span className="text-[9px] text-slate-400">({m.role})</span>
                    </div>
                    <div className={`max-w-md p-3 rounded-xl border text-xs leading-relaxed shadow-2xs ${m.bgColor} ${m.borderColor}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ketik arahan atau putusan admin ke kedua pihak..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Kirim
                </button>
              </div>
            </div>

            {/* Slider & Kalkulator Alokasi Deposit (Escrow Allocation) */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Kalkulator Penetapan Alokasi Dana Jaminan
                </h4>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">Geser Alokasi Kompensasi ke Pemilik:</span>
                  <span className="font-extrabold text-rose-600 text-sm">{formatRupiah(ownerCompensation)}</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={selectedKlaim.depositTotal}
                  step="50000"
                  value={ownerCompensation}
                  onChange={(e) => setOwnerCompensation(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                  <div className="bg-rose-50/70 p-3 rounded-lg border border-rose-200">
                    <span className="text-[10px] text-rose-700 font-bold uppercase">Dicairkan ke Rekening Pemilik</span>
                    <p className="text-sm font-black text-rose-600 mt-0.5">{formatRupiah(ownerCompensation)}</p>
                  </div>
                  <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase">Refund Kembali ke Rekening Penyewa</span>
                    <p className="text-sm font-black text-emerald-600 mt-0.5">{formatRupiah(tenantRefund)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Eksekusi Putusan */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Putusan bersifat mengikat dan otomatis memicu mutasi rekening escrow.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showNotification('Notifikasi permintaan bukti tambahan dikirim ke kedua pihak.')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Minta Bukti Tambahan
                </button>
                <button
                  onClick={() =>
                    showNotification(
                      `Sengketa ${selectedKlaim.id} SELESAI. Kompensasi ${formatRupiah(ownerCompensation)} ditransfer ke pemilik dan refund ${formatRupiah(tenantRefund)} ditransfer ke penyewa.`
                    )
                  }
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Eksekusi &amp; Rilis Dana Escrow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
