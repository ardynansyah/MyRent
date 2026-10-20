import { Router } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAdmin } from '../middleware/adminAuth.js'
import { summarizeKyc } from '../lib/kyc.js'

export const adminRouter = Router()

// Seluruh endpoint di bawah wajib lewat verifikasi JWT admin.
adminRouter.use(requireAdmin)

const SUBMISSION_SELECT = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  role: true,
  submissionCode: true,
  verificationStatus: true,
  revisionSteps: true,
  adminNote: true,
  kycData: true,
  createdAt: true,
  updatedAt: true
}

const ROLE_LABEL = {
  PENYEWA: 'Penyewa UMKM',
  PEMILIK: 'Pemilik Alat'
}

/**
 * Ubah baris user di database menjadi bentuk yang dipakai frontend.
 *
 * @param {object} user - baris user dari Prisma
 * @returns {object} representasi pengajuan
 */
function presentSubmission(user) {
  const kycData = user.kycData && typeof user.kycData === 'object' ? user.kycData : {}
  const summary = summarizeKyc(kycData, user.role)

  return {
    id: user.id,
    submissionCode: user.submissionCode,
    email: user.email,
    fullName: user.fullName,
    nama: summary.nama || user.fullName,
    inisial: summary.inisial,
    role: user.role,
    tipe: ROLE_LABEL[user.role] ?? user.role,
    phone: user.phone,
    lokasi: summary.lokasi,
    langkah: summary.langkah,
    verificationStatus: user.verificationStatus,
    revisionSteps: Array.isArray(user.revisionSteps) ? user.revisionSteps : [],
    adminNote: user.adminNote ?? null,
    kycData,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

/**
 * Cari pengajuan berdasarkan id (uuid) maupun submissionCode (mis. VR-2041).
 *
 * @param {string} identifier
 * @returns {Promise<object|null>}
 */
async function findSubmission(identifier) {
  const byId = await prisma.user.findFirst({
    where: { id: identifier, role: { in: ['PENYEWA', 'PEMILIK'] } },
    select: SUBMISSION_SELECT
  })

  if (byId) return byId

  return prisma.user.findFirst({
    where: { submissionCode: identifier, role: { in: ['PENYEWA', 'PEMILIK'] } },
    select: SUBMISSION_SELECT
  })
}

/**
 * GET /api/admin/submissions
 * Daftar seluruh pengajuan (Penyewa & Pemilik), terbaru lebih dulu.
 */
adminRouter.get('/submissions', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ['PENYEWA', 'PEMILIK'] } },
      orderBy: { createdAt: 'desc' },
      select: SUBMISSION_SELECT
    })

    return res.json({
      message: 'Daftar pengajuan berhasil dimuat',
      total: users.length,
      submissions: users.map(presentSubmission)
    })
  } catch (error) {
    return next(error)
  }
})

/**
 * GET /api/admin/submissions/:id
 * Detail satu pengajuan (id atau submissionCode).
 */
adminRouter.get('/submissions/:id', async (req, res, next) => {
  try {
    const submission = await findSubmission(req.params.id)

    if (!submission) {
      return res.status(404).json({
        error: { code: 'SUBMISSION_NOT_FOUND', message: 'Pengajuan tidak ditemukan' }
      })
    }

    return res.json({
      message: 'Detail pengajuan berhasil dimuat',
      submission: presentSubmission(submission)
    })
  } catch (error) {
    return next(error)
  }
})

/**
 * PATCH /api/admin/submissions/:id/approve
 * Setujui pengajuan → status DISETUJUI, catatan & daftar step perbaikan dibersihkan.
 */
adminRouter.patch('/submissions/:id/approve', async (req, res, next) => {
  try {
    const submission = await findSubmission(req.params.id)

    if (!submission) {
      return res.status(404).json({
        error: { code: 'SUBMISSION_NOT_FOUND', message: 'Pengajuan tidak ditemukan' }
      })
    }

    const updated = await prisma.user.update({
      where: { id: submission.id },
      data: {
        verificationStatus: 'DISETUJUI',
        revisionSteps: Prisma.DbNull,
        adminNote: null
      },
      select: SUBMISSION_SELECT
    })

    return res.json({
      message: `Pengajuan ${updated.submissionCode ?? updated.id} disetujui`,
      submission: presentSubmission(updated)
    })
  } catch (error) {
    return next(error)
  }
})

/**
 * PATCH /api/admin/submissions/:id/revision
 * Minta perbaikan → status PERLU_PERBAIKAN + daftar step + catatan admin.
 *
 * Body: { selectedSteps: number[], note: string }
 */
adminRouter.patch('/submissions/:id/revision', async (req, res, next) => {
  try {
    const submission = await findSubmission(req.params.id)

    if (!submission) {
      return res.status(404).json({
        error: { code: 'SUBMISSION_NOT_FOUND', message: 'Pengajuan tidak ditemukan' }
      })
    }

    const { selectedSteps, note } = req.body ?? {}

    if (!Array.isArray(selectedSteps) || selectedSteps.length === 0) {
      return res.status(400).json({
        error: {
          code: 'INVALID_SELECTED_STEPS',
          message: 'Pilih minimal satu step yang perlu diperbaiki'
        }
      })
    }

    const steps = selectedSteps
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= 5)

    if (steps.length === 0) {
      return res.status(400).json({
        error: {
          code: 'INVALID_SELECTED_STEPS',
          message: 'Nomor step harus berupa angka antara 1 sampai 5'
        }
      })
    }

    const adminNote = typeof note === 'string' ? note.trim() : ''

    const updated = await prisma.user.update({
      where: { id: submission.id },
      data: {
        verificationStatus: 'PERLU_PERBAIKAN',
        revisionSteps: [...new Set(steps)].sort((a, b) => a - b),
        adminNote: adminNote.length > 0 ? adminNote : null
      },
      select: SUBMISSION_SELECT
    })

    return res.json({
      message: `Permintaan perbaikan dikirim untuk step ${[...new Set(steps)].join(', ')}`,
      submission: presentSubmission(updated)
    })
  } catch (error) {
    return next(error)
  }
})

/**
 * PATCH /api/admin/submissions/:id/reject
 * Tolak pengajuan → status DITOLAK + alasan/catatan admin.
 *
 * Body: { reason: string, note: string }
 */
adminRouter.patch('/submissions/:id/reject', async (req, res, next) => {
  try {
    const submission = await findSubmission(req.params.id)

    if (!submission) {
      return res.status(404).json({
        error: { code: 'SUBMISSION_NOT_FOUND', message: 'Pengajuan tidak ditemukan' }
      })
    }

    const { reason, note } = req.body ?? {}
    const reasonText = typeof reason === 'string' ? reason.trim() : ''
    const noteText = typeof note === 'string' ? note.trim() : ''

    if (reasonText.length === 0 && noteText.length === 0) {
      return res.status(400).json({
        error: {
          code: 'MISSING_REASON',
          message: 'Alasan penolakan wajib diisi'
        }
      })
    }

    const adminNote = [reasonText, noteText].filter(Boolean).join(' — ')

    const updated = await prisma.user.update({
      where: { id: submission.id },
      data: {
        verificationStatus: 'DITOLAK',
        revisionSteps: Prisma.DbNull,
        adminNote
      },
      select: SUBMISSION_SELECT
    })

    return res.json({
      message: `Pengajuan ${updated.submissionCode ?? updated.id} ditolak`,
      submission: presentSubmission(updated)
    })
  } catch (error) {
    return next(error)
  }
})
