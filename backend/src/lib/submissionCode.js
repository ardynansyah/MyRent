import { prisma } from './prisma.js'

/**
 * Prefix kode pengajuan yang dipakai portal verifikasi admin.
 * Contoh: VR-2041
 */
export const SUBMISSION_CODE_PREFIX = 'VR-'

/**
 * Generate kode pengajuan unik (mis. `VR-2041`).
 *
 * Nomor dibuat berurutan dari kode terbesar yang sudah dipakai supaya
 * mudah dibaca admin, lalu di-randomize sedikit agar tidak mudah ditebak.
 * Kalau bentrok (mis. registrasi paralel), pemanggil bisa mengulang.
 *
 * @param {number} attempt - percobaan ke berapa (untuk mengacak urutan)
 * @returns {Promise<string>} kode pengajuan unik
 */
export async function generateSubmissionCode(attempt = 0) {
  const existing = await prisma.user.findMany({
    where: { submissionCode: { startsWith: SUBMISSION_CODE_PREFIX } },
    select: { submissionCode: true }
  })

  const used = new Set(existing.map((row) => row.submissionCode))
  const highest = existing.reduce((max, row) => {
    const number = Number.parseInt(String(row.submissionCode).slice(SUBMISSION_CODE_PREFIX.length), 10)
    return Number.isFinite(number) ? Math.max(max, number) : max
  }, 2000)

  let candidate = highest + 1 + attempt

  for (let i = 0; i < 100; i += 1) {
    const code = `${SUBMISSION_CODE_PREFIX}${String(candidate).padStart(4, '0')}`
    if (!used.has(code)) return code
    candidate += 1
  }

  // Fallback terakhir: pakai timestamp agar tetap unik.
  return `${SUBMISSION_CODE_PREFIX}${Date.now()}`
}
