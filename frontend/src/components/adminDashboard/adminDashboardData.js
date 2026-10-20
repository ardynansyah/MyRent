/**
 * Data dummy untuk Dashboard Admin HQ.
 *
 * Sumber: konversi dari `frontend/assetAdmin/AdminPanel-export.html`
 * (halaman detail pengajuan) dan `frontend/assetAdmin/VerifikasiAdmin-export.html`.
 *
 * Catatan: endpoint backend untuk daftar & detail pengajuan belum tersedia,
 * jadi data di bawah dipakai sebagai data sementara. Struktur datanya sudah
 * disiapkan agar mudah ditukar dengan respons API tanpa mengubah UI.
 */

export const STATUS_MENUNGGU = 'MENUNGGU'
export const STATUS_PERLU_PERBAIKAN = 'PERLU_PERBAIKAN'
export const STATUS_DISETUJUI = 'DISETUJUI'
export const STATUS_DITOLAK = 'DITOLAK'

/** Meta tampilan (warna + label) untuk tiap status pengajuan. */
export const STATUS_META = {
  [STATUS_MENUNGGU]: {
    label: 'Menunggu tinjauan',
    chip: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    dot: 'bg-[#B45309]'
  },
  [STATUS_PERLU_PERBAIKAN]: {
    label: 'Perlu perbaikan',
    chip: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    dot: 'bg-[#1D4ED8]'
  },
  [STATUS_DISETUJUI]: {
    label: 'Disetujui',
    chip: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
    dot: 'bg-[#15803D]'
  },
  [STATUS_DITOLAK]: {
    label: 'Ditolak',
    chip: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
    dot: 'bg-[#B91C1C]'
  }
}

/** Tab filter pada tabel daftar pengajuan. */
export const TAB_PENGAJUAN = [
  { key: 'SEMUA', label: 'Semua' },
  { key: STATUS_MENUNGGU, label: 'Menunggu' },
  { key: STATUS_PERLU_PERBAIKAN, label: 'Perlu perbaikan' },
  { key: STATUS_DISETUJUI, label: 'Disetujui' },
  { key: STATUS_DITOLAK, label: 'Ditolak' }
]

/**
 * Daftar pengajuan yang menunggu verifikasi.
 * `langkah` menunjukkan step registrasi terakhir yang sudah lengkap.
 */
export const DAFTAR_PENGAJUAN = [
  {
    id: 'VR-2041',
    nama: 'Dapur Roti Andini',
    inisial: 'DA',
    tipe: 'Penyewa UMKM',
    email: 'dapur.andini@gmail.com',
    lokasi: 'Makassar, Sulawesi Selatan',
    diajukan: '2 jam lalu',
    status: STATUS_MENUNGGU,
    kanal: 'Email',
    langkah: 'Step 1–5 lengkap',
    catatan: 'NIB perlu dicek ulang di OSS sebelum disetujui.'
  },
  {
    id: 'VR-2042',
    nama: 'Kripik Bu Sari',
    inisial: 'KS',
    tipe: 'Penyewa UMKM',
    email: 'kripikbusari@gmail.com',
    lokasi: 'Bandung, Jawa Barat',
    diajukan: '5 jam lalu',
    status: STATUS_MENUNGGU,
    kanal: 'WhatsApp',
    langkah: 'Step 1–4 lengkap',
    catatan: 'Foto gudang operasional belum diunggah.'
  },
  {
    id: 'VR-2043',
    nama: 'Konveksi Jaya Makmur',
    inisial: 'KJ',
    tipe: 'Pemilik Alat',
    email: 'admin@konveksijaya.id',
    lokasi: 'Surabaya, Jawa Timur',
    diajukan: '1 hari lalu',
    status: STATUS_MENUNGGU,
    kanal: 'Email',
    langkah: 'Step 1–5 lengkap',
    catatan: 'Rekening pencairan atas nama badan usaha, perlu cek NPWP.'
  },
  {
    id: 'VR-2044',
    nama: 'Bengkel Jaya',
    inisial: 'BJ',
    tipe: 'Pemilik Alat',
    email: 'bengkeljaya@mail.com',
    lokasi: 'Semarang, Jawa Tengah',
    diajukan: '2 hari lalu',
    status: STATUS_PERLU_PERBAIKAN,
    kanal: 'Email',
    langkah: 'Step 1–3 lengkap',
    catatan: 'Foto rak gudang buram, minta unggah ulang.'
  },
  {
    id: 'VR-2038',
    nama: 'Ayam Geprek Mamah',
    inisial: 'AM',
    tipe: 'Penyewa UMKM',
    email: 'ayamgeprekmamah@gmail.com',
    lokasi: 'Yogyakarta, DI Yogyakarta',
    diajukan: '3 hari lalu',
    status: STATUS_DISETUJUI,
    kanal: 'Email',
    langkah: 'Step 1–5 lengkap',
    catatan: 'Disetujui pukul 09.20 WITA.'
  },
  {
    id: 'VR-2035',
    nama: 'Percetakan Sinar Abadi',
    inisial: 'PS',
    tipe: 'Pemilik Alat',
    email: 'halo@sinarabadi.co',
    lokasi: 'Jakarta Selatan, DKI Jakarta',
    diajukan: '4 hari lalu',
    status: STATUS_DISETUJUI,
    kanal: 'WhatsApp',
    langkah: 'Step 1–5 lengkap',
    catatan: 'Disetujui pukul 14.05 WIB.'
  },
  {
    id: 'VR-2030',
    nama: 'Warung Kopi Senja',
    inisial: 'WS',
    tipe: 'Penyewa UMKM',
    email: 'kopisenja88@gmail.com',
    lokasi: 'Malang, Jawa Timur',
    diajukan: '6 hari lalu',
    status: STATUS_DITOLAK,
    kanal: 'Email',
    langkah: 'Step 1–2 lengkap',
    catatan: 'NIK tidak ditemukan di Dukcapil.'
  }
]

/**
 * Ubah status pengajuan pada data dummy.
 * Dipakai supaya keputusan admin (setujui / minta perbaikan / tolak)
 * langsung tercermin di tabel dashboard.
 *
 * @param {string} id - nomor pengajuan (mis. VR-2041)
 * @param {string} status - salah satu konstanta STATUS_*
 * @returns {object|undefined} entri pengajuan yang diperbarui
 */
export function setStatusPengajuan(id, status) {
  const item = DAFTAR_PENGAJUAN.find((row) => row.id === id)
  if (item) item.status = status
  return item
}

/** Pengajuan aktif yang sedang dibuka di halaman detail. */
export const PENGAJUAN_AKTIF = {
  id: 'VR-2041',
  nama: 'Dapur Roti Andini',
  inisial: 'DA',
  tipe: 'Penyewa UMKM',
  status: STATUS_MENUNGGU,
  email: 'dapur.andini@gmail.com',
  lokasi: 'Makassar, Sulawesi Selatan',
  diajukan: '2 jam lalu',
  total: 7,
  posisi: 1
}

/**
 * Lima langkah registrasi sesuai alur MyRent:
 * 1. Identitas & KTP, 2. Profil & Daya Listrik, 3. Gudang/Lokasi Operasional,
 * 4. Alamat & Rekening, 5. Review.
 *
 * Step 1, 2 dan 4 diambil dari HTML export, step 3 dan 5 memakai data dummy
 * sampai endpoint detail pengajuan tersedia di backend.
 */
export const LANGKAH_PENGAJUAN = [
  {
    nomor: 1,
    judul: 'Identitas & KTP',
    sub: 'Diisi 2 jam lalu · 4 data, 2 dokumen',
    badge: 'Lengkap',
    tone: 'sukses',
    fields: [
      { label: 'Nama Lengkap (KTP)', value: 'Andini Rahmawati' },
      { label: 'NIK', value: '7371 0425 8890 0003' },
      { label: 'Tempat / Tanggal Lahir', value: 'Makassar, 12 April 1994' },
      { label: 'Alamat KTP', value: 'Jl. Rappocini Raya No. 44, Makassar' }
    ],
    dokumen: [
      { nama: 'ktp-andini.jpg', meta: 'KTP · 1.8 MB' },
      { nama: 'selfie-ktp.jpg', meta: 'Selfie + KTP · 1.2 MB' }
    ]
  },
  {
    nomor: 2,
    judul: 'Profil & Daya Listrik',
    sub: 'Diisi 2 jam lalu · 5 data, 2 dokumen',
    badge: 'Lengkap',
    tone: 'sukses',
    fields: [
      { label: 'Nama UMKM', value: 'Dapur Roti Andini' },
      { label: 'Kategori Usaha', value: 'Makanan & Minuman' },
      { label: 'NIB', value: '8120019456723 (terverifikasi OSS)' },
      { label: 'Tahun Berdiri', value: '2019' }
    ],
    daya: '2.200 VA',
    dokumen: [
      { nama: 'tempat-usaha-1.jpg', meta: 'Tampak depan · 2.1 MB' },
      { nama: 'tempat-usaha-2.jpg', meta: 'Ruang produksi · 1.9 MB' }
    ]
  },
  {
    nomor: 3,
    judul: 'Gudang / Lokasi Operasional',
    sub: 'Diisi 1 jam lalu · 6 data, 2 dokumen',
    badge: 'Lengkap',
    tone: 'sukses',
    fields: [
      { label: 'Nama Lokasi', value: 'Gudang Produksi Andini' },
      { label: 'Jenis Lokasi', value: 'Gudang closed kitchen' },
      { label: 'Luas Area', value: '120 m²' },
      { label: 'Kapasitas Penyimpanan', value: '4 pallet · 16 rak' },
      { label: 'Kondisi & Akses', value: 'Lantai beton, pintu truck 4 meter, akses 24 jam' },
      { label: 'Catatan Operasional', value: 'Mesin produksi di sisi timur, jalur forklift 3 meter' }
    ],
    dokumen: [
      { nama: 'gudang-luar-1.jpg', meta: 'Tampak depan gudang · 1.6 MB' },
      { nama: 'gudang-dalam-2.jpg', meta: 'Rak & area produksi · 2.0 MB' }
    ]
  },
  {
    nomor: 4,
    judul: 'Alamat & Rekening',
    sub: 'Diisi 1 jam lalu · 6 data, 2 dokumen',
    badge: 'Lengkap',
    tone: 'sukses',
    fields: [
      { label: 'Alamat Usaha', value: 'Jl. Perintis Kemerdekaan KM 15, Ruko 8' },
      { label: 'Kelurahan / Kecamatan', value: 'Tamalanrea / Tamalanrea' },
      { label: 'Kota / Kode Pos', value: 'Makassar / 90245' },
      { label: 'Bank & No. Rekening', value: 'BCA · 8830 112 447 (a.n. Andini R.)' }
    ],
    dokumen: [
      { nama: 'buku-tabungan.jpg', meta: 'Buku tabungan · 1.1 MB' },
      { nama: 'foto-lokasi.jpg', meta: 'Foto lokasi + papan nama · 2.4 MB' }
    ]
  },
  {
    nomor: 5,
    judul: 'Review & Kirim',
    sub: 'Diisi 1 jam lalu · 4 data, 1 dokumen',
    badge: 'Terkirim',
    tone: 'info',
    fields: [
      { label: 'Waktu Pengiriman', value: '12 Feb 2026 · 10.42 WITA' },
      { label: 'Jumlah Dokumen', value: '9 file · 13,1 MB' },
      { label: 'Persetujuan Data', value: 'Data benar & syarat sewa disetujui pengaju' },
      { label: 'Kanal Verifikasi', value: 'Email + WhatsApp (0821 4455 7788)' }
    ],
    dokumen: [
      { nama: 'ringkasan-pengajuan.pdf', meta: 'Ringkasan 5 langkah · 320 KB' }
    ]
  }
]

/** Checklist manual yang harus dicek admin sebelum menyetujui. */
export const CHECKLIST_VERIFIKASI = [
  { label: 'Foto KTP jelas & tidak terpotong', checked: true },
  { label: 'Nama KTP = nama rekening bank', checked: true },
  { label: 'NIB aktif di sistem OSS', checked: true },
  { label: 'Foto tempat usaha sesuai alamat', checked: false }
]

/** Catatan internal admin (hanya terlihat oleh admin). */
export const CATATAN_INTERNAL = 'NIB perlu dicek ulang di OSS sebelum disetujui.'

/** Riwayat aktivitas pengajuan. */
export const RIWAYAT_PENGAJUAN = [
  { judul: 'Akun penyewa dibuat', waktu: '12 Feb · 09.10', aktif: true },
  { judul: 'Step 1–5 dilengkapi', waktu: '12 Feb · 10.42', aktif: true },
  { judul: 'Masuk antrean tinjauan', waktu: '12 Feb · 10.43', aktif: true },
  { judul: 'Ditugaskan ke Rani A.', waktu: '12 Feb · 10.45', aktif: false }
]

/** Alasan cepat pada modal "Minta perbaikan" (status → Perlu perbaikan). */
export const ALASAN_PERBAIKAN = [
  'Dokumen tidak terbaca',
  'Dokumen belum lengkap',
  'Data tidak sesuai',
  'Foto tidak sesuai alamat'
]

/** Alasan penolakan permanen (status → Ditolak, tidak bisa diperbaiki lagi). */
export const ALASAN_TOLAK_PERMANEN = [
  'Indikasi dokumen palsu / fraud',
  'Usaha tidak memenuhi syarat',
  'Masuk daftar hitam',
  'Data identitas tidak valid'
]
