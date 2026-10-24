import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  CircleCheck,
  CircleAlert,
  ExternalLink,
  MapPin,
  Clock,
  AlertTriangle,
  RotateCcw,
  UserCheck
} from 'lucide-react';

// Data Mock Antrean KYC Realistis UMKM Indonesia
const initialQueueData = [
  {
    id: 1,
    name: 'Dapur Roti Andini',
    initial: 'DA',
    role: 'Penyewa UMKM',
    time: '2 jam lalu',
    status: 'Menunggu',
    category: 'Kuliner & Bakery',
    nik: '3174 0921 8845 0003',
    ownerName: 'Andini Prasetyo',
    power: '1300 Watt',
    nib: '9120 4471 8830',
    documents: [
      {
        title: 'Foto KTP',
        img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Selfie + KTP',
        img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Foto Tempat Usaha',
        img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Foto Area Produksi',
        img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80'
      }
    ],
    checklist: [
      { id: 'c1', text: 'NIK & nama sesuai data e-KTP Dukcapil', valid: true },
      { id: 'c2', text: 'Selfie wajah jelas dan identik dengan foto KTP', valid: true },
      { id: 'c3', text: 'Alamat tempat usaha terverifikasi titik GPS operasional', valid: true },
      { id: 'c4', text: 'Kapasitas daya listrik tempat usaha mencukupi untuk mesin sewa', valid: true },
      { id: 'c5', text: 'Foto tempat usaha menunjukkan aktivitas produksi nyata', valid: false }
    ]
  },
  {
    id: 2,
    name: 'Kopi Senja Mitra',
    initial: 'KO',
    role: 'Penyewa UMKM',
    time: '5 jam lalu',
    status: 'Menunggu',
    category: 'F&B & Kafe',
    nik: '3273 1102 9901 0004',
    ownerName: 'Senja Pratama',
    power: '2200 Watt',
    nib: '9120 3381 7712',
    documents: [
      {
        title: 'Foto KTP',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Selfie + KTP',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Foto Tempat Usaha',
        img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Foto Area Produksi',
        img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80'
      }
    ],
    checklist: [
      { id: 'c1', text: 'NIK & nama sesuai data e-KTP Dukcapil', valid: true },
      { id: 'c2', text: 'Selfie wajah jelas dan identik dengan foto KTP', valid: true },
      { id: 'c3', text: 'Alamat tempat usaha terverifikasi titik GPS operasional', valid: true },
      { id: 'c4', text: 'Kapasitas daya listrik tempat usaha mencukupi untuk mesin sewa', valid: true },
      { id: 'c5', text: 'Foto tempat usaha menunjukkan aktivitas produksi nyata', valid: true }
    ]
  },
  {
    id: 3,
    name: 'Konveksi Sinar Jaya',
    initial: 'KS',
    role: 'Pemilik Alat',
    time: '8 jam lalu',
    status: 'Menunggu',
    category: 'Tekstil & Pakaian',
    nik: '3578 0104 8502 0001',
    ownerName: 'Jaya Santoso',
    power: '4400 Watt',
    nib: '9120 5519 3321',
    documents: [
      {
        title: 'Foto KTP',
        img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Selfie + KTP',
        img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Foto Tempat Gudang',
        img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Foto Mesin Siap Sewa',
        img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'
      }
    ],
    checklist: [
      { id: 'c1', text: 'NIK & nama sesuai data e-KTP Dukcapil', valid: true },
      { id: 'c2', text: 'Selfie wajah jelas dan identik dengan foto KTP', valid: true },
      { id: 'c3', text: 'Alamat gudang terverifikasi titik GPS operasional', valid: true },
      { id: 'c4', text: 'Surat pernyataan kepemilikan alat ditandatangani', valid: true },
      { id: 'c5', text: 'Rekening pencairan bank sesuai nama identitas pemohon', valid: true }
    ]
  },
  {
    id: 4,
    name: 'Warung Sate Pak Kumis',
    initial: 'WA',
    role: 'Penyewa UMKM',
    time: '11 jam lalu',
    status: 'Menunggu',
    category: 'Kuliner Tradisional',
    nik: '3171 0511 7803 0005',
    ownerName: 'Bambang Sudirjo',
    power: '900 Watt',
    nib: '9120 8820 1109',
    documents: [
      {
        title: 'Foto KTP',
        img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Selfie + KTP',
        img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Foto Tempat Usaha',
        img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Foto Area Produksi',
        img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'
      }
    ],
    checklist: [
      { id: 'c1', text: 'NIK & nama sesuai data e-KTP Dukcapil', valid: true },
      { id: 'c2', text: 'Selfie wajah jelas dan identik dengan foto KTP', valid: true },
      { id: 'c3', text: 'Alamat tempat usaha terverifikasi titik GPS operasional', valid: true },
      { id: 'c4', text: 'Kapasitas daya listrik tempat usaha mencukupi untuk mesin sewa', valid: false },
      { id: 'c5', text: 'Foto tempat usaha menunjukkan aktivitas produksi nyata', valid: true }
    ]
  },
  {
    id: 5,
    name: 'PackPro Design & Print',
    initial: 'PA',
    role: 'Pemilik Alat',
    time: '1 hari lalu',
    status: 'Dokumen kurang',
    category: 'Percetakan & Kemasan',
    nik: '3175 0812 9002 0008',
    ownerName: 'Doni Firmansyah',
    power: '3500 Watt',
    nib: '9120 7711 0023',
    documents: [
      {
        title: 'Foto KTP',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Selfie + KTP',
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Foto Tempat Usaha',
        img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Foto Area Produksi',
        img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80'
      }
    ],
    checklist: [
      { id: 'c1', text: 'NIK & nama sesuai data e-KTP Dukcapil', valid: true },
      { id: 'c2', text: 'Selfie wajah buram atau terpotong', valid: false },
      { id: 'c3', text: 'Alamat tempat usaha terverifikasi titik GPS operasional', valid: true },
      { id: 'c4', text: 'Surat pernyataan kepemilikan alat ditandatangani', valid: false },
      { id: 'c5', text: 'Rekening pencairan bank sesuai nama identitas pemohon', valid: true }
    ]
  }
];

export default function VerifikasiKYC() {
  const [selectedId, setSelectedId] = useState(1);
  const [queueList, setQueueList] = useState(initialQueueData);
  const [noteText, setNoteText] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [previewImg, setPreviewImg] = useState(null);

  const selectedItem = queueList.find((item) => item.id === selectedId) || queueList[0];

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleApprove = () => {
    setQueueList((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id ? { ...item, status: 'Terverifikasi' } : item
      )
    );
    showNotification(`Pendaftaran ${selectedItem.name} BERHASIL DISETUJUI & DIVERIFIKASI!`);
  };

  const handleReject = () => {
    setQueueList((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id ? { ...item, status: 'Ditolak' } : item
      )
    );
    showNotification(`Pendaftaran ${selectedItem.name} DITOLAK. Catatan terkirim ke WhatsApp pemohon.`);
  };

  const handleRequestDocs = () => {
    setQueueList((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id ? { ...item, status: 'Dokumen kurang' } : item
      )
    );
    showNotification(`Permintaan dokumen susulan telah dikirim ke WhatsApp ${selectedItem.ownerName}.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notifikasi */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER PENJELASAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Verifikasi Berkas KYC &amp; Legalitas UMKM</h2>
          <p className="text-xs text-slate-500">
            Validasi NIK e-KTP, kesesuaian swafoto, titik lokasi GPS usaha, dan kesiapan daya listrik operasional mesin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
            SLA Maksimal 24 Jam
          </span>
        </div>
      </div>

      {/* GRID 12 KOLOM: ANTREAN KIRI (4 col) & DETAIL KANAN (8 col) */}
      <div className="grid grid-cols-12 gap-6">
        {/* KOLOM KIRI: DAFTAR ANTREAN */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Antrean Pengajuan ({queueList.length})
            </span>
            <span className="text-xs text-slate-400">Urut: Terlama</span>
          </div>

          <div className="space-y-2.5">
            {queueList.map((item) => {
              const isSelected = item.id === selectedId;
              const isPending = item.status === 'Menunggu';
              const isApproved = item.status === 'Terverifikasi';
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.role} · {item.time}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 border ${
                      isApproved
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isPending
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* KOLOM KANAN: DETAIL PEMOHON & CHECKLIST */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            {/* Header Detail */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-base shrink-0">
                  {selectedItem.initial}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedItem.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedItem.role} · Diajukan {selectedItem.time} · Sektor Usaha: <strong>{selectedItem.category}</strong>
                  </p>
                </div>
              </div>

              <span
                className={`self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full border ${
                  selectedItem.status === 'Terverifikasi'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : selectedItem.status === 'Menunggu'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                Status: {selectedItem.status}
              </span>
            </div>

            {/* Grid 4 Kartu Data Kependudukan & Teknis */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">NIK KTP</span>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5 font-mono">{selectedItem.nik}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nama KTP</span>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5">{selectedItem.ownerName}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Daya Listrik</span>
                <p className="text-xs font-extrabold text-blue-600 mt-0.5">{selectedItem.power}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">NIB Usaha</span>
                <p className="text-xs font-extrabold text-slate-900 mt-0.5 font-mono">{selectedItem.nib}</p>
              </div>
            </div>

            {/* Galeri 4 Dokumen Lampiran */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Dokumen Identitas &amp; Tempat Usaha
                </h4>
                <span className="text-[11px] text-slate-400">Klik gambar untuk memperbesar</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedItem.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewImg(doc.img)}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-100 cursor-pointer hover:border-blue-400 transition"
                  >
                    <img
                      src={doc.img}
                      alt={doc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                      <p className="text-[10px] font-bold leading-tight">{doc.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist Verifikasi Admin */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Checklist Kepatuhan Verifikasi
              </h4>
              <div className="space-y-2 text-xs">
                {selectedItem.checklist.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2.5 text-slate-700 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={c.valid}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span>{c.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Catatan & Tombol Keputusan */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Catatan Verifikator untuk Pemohon (Opsional)
              </label>
              <textarea
                rows={2}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Contoh: Foto tempat usaha mohon perlihatkan instalasi saklar listrik PLN..."
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />

              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer"
                >
                  Tolak Pengajuan
                </button>
                <button
                  onClick={handleRequestDocs}
                  className="px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition cursor-pointer"
                >
                  Minta Dokumen Tambahan
                </button>
                <button
                  onClick={handleApprove}
                  className="px-6 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Setujui &amp; Verifikasi Akun</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX PREVIEW GAMBAR BESAR */}
      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden bg-white shadow-2xl">
            <img src={previewImg} alt="Preview Dokumen" className="w-full h-full object-contain" />
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
