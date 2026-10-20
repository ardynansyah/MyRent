/**
 * Helper normalisasi data KYC (Step 1 - Step 5) yang dikirim frontend.
 *
 * Prinsip utama: backend TIDAK MENOLAK format file apa pun.
 * Frontend boleh mengirim:
 *  - string nama file            → "ktp-budi.jpg"
 *  - objek metadata              → { name, size, type, preview }
 *  - data URL (base64)           → "data:image/png;base64,...."
 *  - data URL di dalam preview   → { name, size, type, preview: "data:..." }
 *
 * Semua bentuk di atas dinormalisasi menjadi satu bentuk seragam:
 *   { name, size, type, preview, lastModified? }
 *
 * `preview` (data URL) tetap disimpan agar admin bisa melihat pratinjau,
 * tetapi dibatasi panjangnya supaya kolom JSON MySQL tidak membengkak.
 */

/** Batas panjang pratinjau inline (data URL) yang disimpan ke database (~300 KB). */
export const MAX_INLINE_PREVIEW_LENGTH = 400_000

/** Kunci form yang secara semantik berisi berkas unggahan. */
const KNOWN_FILE_KEYS = new Set([
  'ktpFile',
  'selfieFile',
  'frontPhoto',
  'productionPhoto',
  'businessPhoto',
  'gudangPhoto',
  'sitePhoto',
  'ktpPhoto',
  'selfiePhoto',
  'fotoKtp',
  'fotoSelfie',
  'fotoTempatUsaha',
  'fotoGudang',
  'fotoLokasi',
  'fileKtp',
  'fileSelfie',
  'document',
  'dokumen'
])

/** Field bertipe password / kredensial yang tidak boleh masuk ke kycData. */
const SENSITIVE_KEYS = new Set(['password', 'confirmPassword', 'konfirmasi', 'passwordHash'])

/** Field tingkat atas yang bukan bagian dari data formulir. */
const NON_FORM_KEYS = new Set(['role'])

const isPlainObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Ambil mime type dari data URL, mis. "data:image/png;base64,..." → "image/png". */
function mimeFromDataUrl(dataUrl) {
  const match = /^data:([^;,]+)/i.exec(String(dataUrl))
  return match ? match[1] : null
}

/**
 * Deteksi apakah sebuah nilai terlihat seperti hasil unggahan berkas.
 * @param {unknown} value
 * @returns {boolean}
 */
function looksLikeFileValue(value) {
  if (typeof value === 'string') return value.startsWith('data:')
  if (isPlainObject(value)) {
    return (
      'name' in value ||
      'fileName' in value ||
      'preview' in value ||
      'dataUrl' in value ||
      'size' in value ||
      'type' in value
    )
  }
  return false
}

/**
 * Normalisasi satu nilai berkas menjadi bentuk seragam.
 * Nilai yang tidak dikenali dikembalikan apa adanya (tidak pernah ditolak).
 *
 * @param {unknown} value
 * @returns {unknown}
 */
export function normalizeFileValue(value) {
  if (value === null || value === undefined || value === '') return null

  // Bentuk 1: data URL
  if (typeof value === 'string' && value.startsWith('data:')) {
    const preview =
      value.length <= MAX_INLINE_PREVIEW_LENGTH
        ? value
        : `${value.slice(0, MAX_INLINE_PREVIEW_LENGTH)}`
    return {
      name: 'unggahan.jpg',
      size: value.length,
      type: mimeFromDataUrl(value),
      preview,
      previewTruncated: value.length > MAX_INLINE_PREVIEW_LENGTH
    }
  }

  // Bentuk 2: string nama file biasa
  if (typeof value === 'string') {
    return { name: value, size: null, type: null }
  }

  // Bentuk 3: objek metadata
  if (isPlainObject(value)) {
    const name = value.name ?? value.fileName ?? value.file_name ?? 'dokumen'
    const size = value.size ?? value.fileSize ?? value.file_size ?? null
    const type = value.type ?? value.mimeType ?? value.mime_type ?? null
    const rawPreview = value.preview ?? value.dataUrl ?? value.data_url ?? null

    const result = {
      name: String(name),
      size: size === null || size === undefined ? null : Number(size),
      type: type ? String(type) : null
    }

    if (value.lastModified) result.lastModified = Number(value.lastModified)
    if (value.uploadedAt) result.uploadedAt = String(value.uploadedAt)

    if (typeof rawPreview === 'string' && rawPreview.length > 0) {
      result.preview =
        rawPreview.length <= MAX_INLINE_PREVIEW_LENGTH
          ? rawPreview
          : rawPreview.slice(0, MAX_INLINE_PREVIEW_LENGTH)
      if (rawPreview.length > MAX_INLINE_PREVIEW_LENGTH) result.previewTruncated = true
    }

    return result
  }

  // Bentuk lain (angka, boolean, array) → biarkan apa adanya.
  return value
}

/**
 * Bersihkan & normalisasi seluruh isi form registrasi menjadi objek kycData.
 *
 * `kycData` memirror payload formulir apa adanya (Step 1-5), termasuk
 * `email` dan nomor whatsapp/telepon, sehingga portal admin bisa memetakan
 * data sesuai step aslinya. Yang dibuang hanya kredensial (password).
 *
 * @param {object} raw - payload mentah dari frontend
 * @returns {object} kycData siap disimpan ke kolom JSON
 */
export function buildKycData(raw) {
  if (!isPlainObject(raw)) return {}

  const kycData = {}

  for (const [key, value] of Object.entries(raw)) {
    if (SENSITIVE_KEYS.has(key)) continue
    if (NON_FORM_KEYS.has(key)) continue
    if (value === undefined) continue

    const isFileKey = KNOWN_FILE_KEYS.has(key) || looksLikeFileValue(value)
    kycData[key] = isFileKey ? normalizeFileValue(value) : value
  }

  return kycData
}

/**
 * Ambil sumber data form dari payload registrasi.
 * Frontend boleh mengirim data datar (spread) atau dibungkus `formData`/`kycData`.
 *
 * @param {object} body
 * @returns {object}
 */
export function extractFormPayload(body) {
  if (!isPlainObject(body)) return {}

  // Bentuk bersarang: apa adanya yang dikirim formulir.
  if (isPlainObject(body.formData)) return body.formData
  if (isPlainObject(body.kycData)) return body.kycData

  // Bentuk datar: buang field kredensial & email tingkat atas (sudah disimpan
  // di kolom User), sisanya tetap dianggap data formulir.
  const { email, password, role, ...rest } = body
  return rest
}

/**
 * Ringkasan singkat isi kycData untuk ditampilkan di tabel dashboard admin.
 *
 * @param {object|null} kycData
 * @param {string} role - 'PENYEWA' | 'PEMILIK'
 * @returns {{ lokasi: string, langkah: string, inisial: string }}
 */
export function summarizeKyc(kycData, role) {
  const data = isPlainObject(kycData) ? kycData : {}

  const kota = data.city || data.kota || ''
  const provinsi = data.provinsi || data.province || ''
  const lokasi =
    [kota, provinsi].filter(Boolean).join(', ') ||
    data.alamat ||
    data.address ||
    'Lokasi belum diisi'

  const jumlahDokumen = Object.values(data).filter((value) => {
    if (!isPlainObject(value)) return false
    return typeof value.name === 'string' && value.name.length > 0
  }).length

  const langkah =
    jumlahDokumen > 0 ? `Step 1-5 lengkap · ${jumlahDokumen} dokumen` : 'Step 1-5 lengkap'

  const sumberNama = data.businessName || data.namaLokasi || data.badanUsaha || ''
  const nama = sumberNama || (role === 'PEMILIK' ? 'Pemilik Alat' : 'Penyewa UMKM')

  const inisial = nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')

  return { lokasi, langkah, inisial, nama }
}
