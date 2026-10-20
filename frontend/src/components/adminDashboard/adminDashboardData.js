/**
 * Konstanta & helper untuk Dashboard Admin HQ.
 *
 * Catatan: seluruh data pengajuan TIDAK lagi hard-coded di file ini.
 * Daftar & detail pengajuan diambil dari backend MySQL lewat
 * `GET /api/admin/submissions` (lihat `adminApi.js`).
 *
 * File ini hanya menyimpan:
 *  - konstanta status & metadata tampilan
 *  - template 5 langkah registrasi
 *  - pemetaan `kycData` (JSON dari database) → 5 kartu langkah
 *  - checklist admin & alasan cepat pada modal
 */

export const STATUS_MENUNGGU = 'MENUNGGU'
export const STATUS_PERLU_PERBAIKAN = 'PERLU_PERBAIKAN'
export const STATUS_DISETUJUI = 'DISETUJUI'
export const STATUS_DITOLAK = 'DITOLAK'

/**
 * Meta tampilan (warna semantik + label) untuk tiap status pengajuan.
 *
 * `badge` memakai gaya badge shadcn/ui: warna solid lembut tanpa garis tepi
 * dan tanpa titik penanda. Warna "perlu perbaikan" dan "disetujui" memakai
 * palet halus (amber/emerald) karena belum punya token semantik khusus.
 */
export const STATUS_META = {
  [STATUS_MENUNGGU]: {
    label: 'Menunggu tinjauan',
    badge: 'bg-secondary text-secondary-foreground'
  },
  [STATUS_PERLU_PERBAIKAN]: {
    label: 'Perlu perbaikan',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500'
  },
  [STATUS_DISETUJUI]: {
    label: 'Disetujui',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-500'
  },
  [STATUS_DITOLAK]: {
    label: 'Ditolak',
    badge: 'bg-destructive/10 text-destructive dark:bg-destructive/20'
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

/** Template 5 langkah registrasi untuk Penyewa UMKM. */
export const STEP_TEMPLATE_PENYEWA = [
  { nomor: 1, judul: 'Akun & Kredensial', sub: 'Data akun dan kontak penanggung jawab usaha' },
  { nomor: 2, judul: 'Identitas & KTP', sub: 'Data identitas sesuai dokumen resmi' },
  { nomor: 3, judul: 'Profil UMKM & Daya Listrik', sub: 'Profil usaha, NIB, dan kapasitas daya listrik' },
  { nomor: 4, judul: 'Alamat & Rekening', sub: 'Alamat operasional dan rekening refund' },
  { nomor: 5, judul: 'Review & Persetujuan', sub: 'Ringkasan dan persetujuan pengajuan' }
]

/** Template 5 langkah registrasi untuk Pemilik Alat. */
export const STEP_TEMPLATE_PEMILIK = [
  { nomor: 1, judul: 'Akun & Kredensial', sub: 'Data akun dan kontak pemilik alat' },
  { nomor: 2, judul: 'Identitas & KTP', sub: 'Data identitas, bentuk usaha, dan NPWP' },
  { nomor: 3, judul: 'Lokasi & Gudang Operasional', sub: 'Alamat, jadwal operasional, dan fasilitas lokasi' },
  { nomor: 4, judul: 'Rekening Pencairan', sub: 'Rekening tujuan pencairan sewa' },
  { nomor: 5, judul: 'Review & Persetujuan', sub: 'Ringkasan dan persetujuan pengajuan' }
]

/**
 * Ambil template langkah sesuai role pemohon.
 * @param {string} role - 'PENYEWA' | 'PEMILIK'
 */
export function getStepTemplate(role) {
  return String(role || '').toUpperCase() === 'PEMILIK' ? STEP_TEMPLATE_PEMILIK : STEP_TEMPLATE_PENYEWA
}

/** Checklist manual yang harus dicek admin sebelum menyetujui. */
export const CHECKLIST_VERIFIKASI = [
  { label: 'Foto KTP jelas & tidak terpotong', checked: true },
  { label: 'Nama KTP = nama rekening bank', checked: true },
  { label: 'NIB aktif di sistem OSS', checked: true },
  { label: 'Foto tempat usaha sesuai alamat', checked: false }
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

// ── Helper pemetaan kycData → kartu langkah ────────────────────────────────

const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Ubah nilai mentah dari database menjadi teks yang rapi.
 * @param {unknown} value
 * @returns {string}
 */
export function formatFieldValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.join(', ')
  if (isPlainObject(value)) {
    if (value.name) return String(value.name)
    return JSON.stringify(value)
  }
  return String(value)
}

/**
 * Ubah nilai berkas (nama file / metadata / data URL) menjadi dokumen siap tampil.
 *
 * @param {unknown} value
 * @param {string} label - keterangan jenis dokumen
 * @returns {{ nama: string, meta: string, preview: string|null }|null}
 */
export function formatDocument(value, label) {
  if (!value) return null

  if (typeof value === 'string') {
    if (value.startsWith('data:')) {
      return { nama: `${label} (data URL)`, meta: label, preview: value }
    }
    return { nama: value, meta: label, preview: null }
  }

  if (!isPlainObject(value)) return null

  const nama = value.name || value.fileName || `${label} (tanpa nama)`
  const parts = [label]

  if (value.size) {
    const bytes = Number(value.size)
    if (Number.isFinite(bytes) && bytes > 0) {
      if (bytes < 1024) parts.push(`${bytes} B`)
      else if (bytes < 1024 * 1024) parts.push(`${(bytes / 1024).toFixed(1)} KB`)
      else parts.push(`${(bytes / (1024 * 1024)).toFixed(1)} MB`)
    }
  }

  if (value.type) parts.push(String(value.type).replace('image/', '').toUpperCase())

  return {
    nama: String(nama),
    meta: parts.join(' · '),
    preview: typeof value.preview === 'string' ? value.preview : null
  }
}

/**
 * Susun daftar field (label → value) dari kycData.
 *
 * @param {object} data
 * @param {Array<[string, string]>} pairs - pasangan [key, label]
 * @returns {Array<{label: string, value: string}>}
 */
function buildFields(data, pairs) {
  return pairs.map(([key, label]) => ({
    label,
    value: formatFieldValue(data?.[key])
  }))
}

/**
 * Susun daftar dokumen dari kycData.
 *
 * @param {object} data
 * @param {Array<[string, string]>} pairs - pasangan [key, label]
 * @returns {Array<{nama: string, meta: string, preview: string|null}>}
 */
function buildDocuments(data, pairs) {
  return pairs
    .map(([key, label]) => formatDocument(data?.[key], label))
    .filter(Boolean)
}

/**
 * Bangun 5 kartu langkah dari data KYC pada database.
 *
 * @param {object} kycData - objek JSON `kycData` dari API
 * @param {string} role - 'PENYEWA' | 'PEMILIK'
 * @param {object} fallback - data akun dari tabel user (fullName, email, phone)
 * @returns {Array<object>} lima langkah siap render
 */
export function buildStepsFromKycData(kycData, role, fallback = {}) {
  const kyc = isPlainObject(kycData) ? kycData : {}
  const data = {
    ...fallback,
    ...Object.fromEntries(Object.entries(kyc).filter(([, value]) => value !== undefined))
  }
  const isPemilik = String(role || '').toUpperCase() === 'PEMILIK'
  const template = getStepTemplate(role)

  let content

  if (isPemilik) {
    content = [
      {
        fields: buildFields(data, [
          ['email', 'Email'],
          ['whatsapp', 'Nomor WhatsApp'],
          ['namaLokasi', 'Nama Lokasi / Toko'],
          ['badanUsaha', 'Bentuk Badan Usaha']
        ]),
        documents: buildDocuments(data, [
          ['ktpFile', 'Foto KTP'],
          ['selfieFile', 'Selfie + KTP']
        ])
      },
      {
        fields: buildFields(data, [
          ['nik', 'NIK'],
          ['namaKtp', 'Nama sesuai KTP'],
          ['tempatLahir', 'Tempat Lahir'],
          ['tanggalLahir', 'Tanggal Lahir'],
          ['badanUsaha', 'Status Badan Usaha'],
          ['npwp', 'NPWP']
        ]),
        documents: buildDocuments(data, [['ktpFile', 'Foto KTP']])
      },
      {
        fields: buildFields(data, [
          ['namaLokasi', 'Nama Lokasi'],
          ['alamat', 'Alamat Lokasi'],
          ['kota', 'Kota / Kabupaten'],
          ['kodePos', 'Kode Pos'],
          ['gps', 'Koordinat GPS'],
          ['hariOperasional', 'Hari Operasional'],
          ['jamBuka', 'Jam Buka'],
          ['jamTutup', 'Jam Tutup'],
          ['fasilitasJaga', 'Ada orang jaga'],
          ['fasilitasParkir', 'Parkir kendaraan pengangkut'],
          ['fasilitasDalamRuangan', 'Alat disimpan dalam ruangan']
        ]),
        documents: buildDocuments(data, [
          ['frontPhoto', 'Tampak depan lokasi'],
          ['storagePhoto', 'Area penyimpanan'],
          ['rackPhoto', 'Rak / etalase']
        ])
      },
      {
        fields: buildFields(data, [
          ['bank', 'Bank'],
          ['nomorRekening', 'Nomor Rekening'],
          ['namaRekening', 'Nama Pemilik Rekening'],
          ['konfirmasiKepemilikan', 'Rekening atas nama sendiri'],
          ['konfirmasiKomisi', 'Setujui komisi platform']
        ]),
        documents: []
      },
      {
        fields: buildFields(data, [
          ['agreeTruth', 'Pernyataan kebenaran data'],
          ['agreeTerms', 'Persetujuan Syarat & Ketentuan'],
          ['agreeEscrow', 'Persetujuan Escrow Deposit']
        ]),
        documents: []
      }
    ]
  } else {
    content = [
      {
        fields: buildFields(data, [
          ['fullName', 'Nama Penanggung Jawab'],
          ['email', 'Email'],
          ['phone', 'Nomor WhatsApp'],
          ['businessName', 'Nama UMKM'],
          ['businessSector', 'Kategori Usaha'],
          ['customSector', 'Kategori Usaha (custom)']
        ]),
        documents: []
      },
      {
        fields: buildFields(data, [
          ['nik', 'NIK'],
          ['ktpName', 'Nama sesuai KTP'],
          ['birthPlace', 'Tempat Lahir'],
          ['birthDate', 'Tanggal Lahir']
        ]),
        documents: buildDocuments(data, [
          ['ktpFile', 'Foto KTP'],
          ['selfieFile', 'Selfie + KTP']
        ])
      },
      {
        fields: buildFields(data, [
          ['businessName', 'Nama UMKM'],
          ['businessSector', 'Kategori Usaha'],
          ['customSector', 'Kategori Usaha (custom)'],
          ['nib', 'NIB'],
          ['startYear', 'Tahun Berdiri'],
          ['isManualPower', 'Daya listrik diisi manual'],
          ['businessDesc', 'Deskripsi Usaha']
        ]),
        daya: data.powerCapacity || data.customPower || null,
        documents: buildDocuments(data, [
          ['frontPhoto', 'Tampak depan tempat usaha'],
          ['productionPhoto', 'Area produksi']
        ])
      },
      {
        fields: buildFields(data, [
          ['address', 'Alamat Usaha'],
          ['district', 'Kecamatan'],
          ['city', 'Kota / Kabupaten'],
          ['postalCode', 'Kode Pos'],
          ['landmark', 'Patokan / Landmark'],
          ['gpsCoords', 'Koordinat GPS'],
          ['bankName', 'Bank'],
          ['bankAccount', 'Nomor Rekening'],
          ['bankAccountHolder', 'Nama Pemilik Rekening'],
          ['confirmAccountOwner', 'Rekening atas nama sendiri'],
          ['confirmDeduction', 'Setujui kebijakan deposit']
        ]),
        documents: []
      },
      {
        fields: buildFields(data, [
          ['agreeTruth', 'Pernyataan kebenaran data'],
          ['agreeTerms', 'Persetujuan Syarat & Ketentuan'],
          ['confirmAccountOwner', 'Pernyataan rekening milik sendiri'],
          ['confirmDeduction', 'Persetujuan deposit']
        ]),
        documents: []
      }
    ]
  }

  return template.map((step, index) => {
    const stepContent = content[index] || { fields: [], documents: [] }
    const fields = stepContent.fields || []
    const documents = stepContent.documents || []

    const terisi = fields.filter((field) => field.value && field.value !== '—').length
    const lengkap = terisi >= Math.max(1, Math.ceil(fields.length * 0.6))

    return {
      nomor: step.nomor,
      judul: step.judul,
      sub: `${step.sub} · ${terisi} data, ${documents.length} dokumen`,
      badge: lengkap ? 'Lengkap' : 'Perlu dilengkapi',
      tone: lengkap ? 'sukses' : 'peringatan',
      fields,
      daya: stepContent.daya || null,
      documents
    }
  })
}

/**
 * Susun riwayat pengajuan dari data yang benar-benar ada di database.
 *
 * @param {object} submission - objek pengajuan dari API
 * @returns {Array<{judul: string, waktu: string, aktif: boolean}>}
 */
export function buildRiwayatPengajuan(submission) {
  if (!submission) return []

  const items = [
    {
      judul: 'Akun dibuat & pengajuan dikirim',
      waktu: new Date(submission.createdAt).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      aktif: true
    }
  ]

  if (submission.verificationStatus === STATUS_PERLU_PERBAIKAN) {
    items.push({
      judul: `Diminta perbaikan pada step ${(submission.revisionSteps || []).join(', ') || '-'}`,
      waktu: new Date(submission.updatedAt).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      aktif: true
    })
  }

  if (submission.verificationStatus === STATUS_DISETUJUI) {
    items.push({
      judul: 'Disetujui admin — akun aktif',
      waktu: new Date(submission.updatedAt).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      aktif: true
    })
  }

  if (submission.verificationStatus === STATUS_DITOLAK) {
    items.push({
      judul: 'Ditolak admin',
      waktu: new Date(submission.updatedAt).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      aktif: true
    })
  }

  items.push({
    judul: 'Menunggu keputusan admin',
    waktu: '—',
    aktif: false
  })

  return items
}
