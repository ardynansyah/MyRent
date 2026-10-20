import { prisma } from './prisma.js'

/**
 * Normalisasi nomor telepon / WhatsApp ke format standar angka (contoh: 081234567890).
 * Menghilangkan spasi, tanda hubung, dan mengubah prefix internasional 62 atau +62 menjadi 0.
 *
 * @param {string|number|unknown} raw
 * @returns {string} nomor telepon yang telah dinormalisasi
 */
export function normalizePhone(raw) {
  if (!raw) return ''
  const digits = String(raw).replace(/\D/g, '')
  if (digits.startsWith('62')) {
    return '0' + digits.slice(2)
  }
  return digits
}

/**
 * Normalisasi NIK (tepat 16 digit angka).
 *
 * @param {string|number|unknown} raw
 * @returns {string} NIK murni angka
 */
export function normalizeNik(raw) {
  if (!raw) return ''
  return String(raw).replace(/\D/g, '')
}

/**
 * Normalisasi nomor rekening bank.
 *
 * @param {string|number|unknown} raw
 * @returns {string} nomor rekening murni angka
 */
export function normalizeBankAccount(raw) {
  if (!raw) return ''
  return String(raw).replace(/\D/g, '')
}

/**
 * Cari pengguna berdasarkan nomor telepon dengan normalisasi menyeluruh.
 *
 * @param {string} phone
 * @param {string|null} [excludeUserId]
 * @returns {Promise<object|null>}
 */
export async function findUserByPhone(phone, excludeUserId = null) {
  const clean = normalizePhone(phone)
  if (!clean || clean.length < 9) return null

  const rawClean = clean.startsWith('0') ? clean.slice(1) : clean
  const candidates = [
    clean,
    '0' + rawClean,
    '62' + rawClean,
    '+62' + rawClean,
    String(phone).trim()
  ]

  // Coba pencarian cepat dengan kandidat variasi format
  const quickMatch = await prisma.user.findFirst({
    where: {
      phone: { in: candidates },
      ...(excludeUserId ? { id: { not: excludeUserId } } : {})
    }
  })

  if (quickMatch) return quickMatch

  // Fallback: pindai seluruh pengguna jika tersimpan dengan variasi spasi / strip
  const allUsers = await prisma.user.findMany({
    where: excludeUserId ? { id: { not: excludeUserId } } : {},
    select: { id: true, phone: true, email: true, fullName: true }
  })

  return allUsers.find((u) => normalizePhone(u.phone) === clean) || null
}

/**
 * Cari pengguna berdasarkan NIK yang tersimpan di kolom JSON kycData.
 *
 * @param {string} nik
 * @param {string|null} [excludeUserId]
 * @returns {Promise<object|null>}
 */
export async function findUserByNik(nik, excludeUserId = null) {
  const cleanNik = normalizeNik(nik)
  if (!cleanNik || cleanNik.length !== 16) return null

  const allUsers = await prisma.user.findMany({
    where: excludeUserId ? { id: { not: excludeUserId } } : {},
    select: { id: true, email: true, fullName: true, kycData: true }
  })

  return (
    allUsers.find((u) => {
      const kyc = u.kycData && typeof u.kycData === 'object' ? u.kycData : null
      if (!kyc) return false
      const existingNik = normalizeNik(kyc.nik || kyc.nikKtp)
      return existingNik === cleanNik
    }) || null
  )
}

/**
 * Cari pengguna berdasarkan nomor rekening yang tersimpan di kolom JSON kycData.
 *
 * @param {string} account
 * @param {string|null} [excludeUserId]
 * @returns {Promise<object|null>}
 */
export async function findUserByBankAccount(account, excludeUserId = null) {
  const cleanAcc = normalizeBankAccount(account)
  if (!cleanAcc || cleanAcc.length < 5) return null

  const allUsers = await prisma.user.findMany({
    where: excludeUserId ? { id: { not: excludeUserId } } : {},
    select: { id: true, email: true, fullName: true, kycData: true }
  })

  return (
    allUsers.find((u) => {
      const kyc = u.kycData && typeof u.kycData === 'object' ? u.kycData : null
      if (!kyc) return false
      const existingAcc = normalizeBankAccount(kyc.bankAccount || kyc.nomorRekening)
      return existingAcc === cleanAcc
    }) || null
  )
}
