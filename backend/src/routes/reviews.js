import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { config } from '../config.js'

export const reviewsRouter = Router()

/**
 * Middleware autentikasi opsional untuk GET /api/reviews
 */
function optionalAuth(req, _res, next) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], config.jwtSecret)
      req.userId = decoded.userId
      req.userRole = String(decoded.role || '').toUpperCase()
    } catch {
      // Token tidak valid diabaikan untuk endpoint publik
    }
  }
  next()
}

/**
 * Middleware autentikasi wajib untuk POST review
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Token tidak disertakan' }
    })
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], config.jwtSecret)
    req.userId = decoded.userId
    req.userRole = String(decoded.role || '').toUpperCase()
    next()
  } catch {
    return res.status(401).json({
      error: { code: 'INVALID_TOKEN', message: 'Token tidak valid atau telah kedaluwarsa' }
    })
  }
}

/**
 * GET /api/reviews
 * Mengambil daftar ulasan toko/alat beserta kalkulasi rating.
 * Parameter query opsional:
 * - equipmentId : ID alat tertentu
 * - ownerId     : ID pemilik alat
 * - rating      : filter nilai bintang (1-5)
 */
reviewsRouter.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { equipmentId, ownerId, rating } = req.query

    const where = {}

    if (equipmentId) {
      where.equipmentId = String(equipmentId)
    } else if (ownerId) {
      where.equipment = { ownerId: String(ownerId) }
    } else if (req.userId && (req.userRole === 'PEMILIK' || req.query.as === 'owner')) {
      where.equipment = { ownerId: req.userId }
    }

    if (rating && !isNaN(Number(rating))) {
      where.rating = Number(rating)
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            kycData: true
          }
        },
        equipment: {
          select: {
            id: true,
            name: true,
            category: true,
            images: true,
            ownerId: true
          }
        },
        order: {
          select: {
            id: true,
            invoiceNumber: true,
            startDate: true,
            endDate: true,
            rentalDays: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Kalkulasi metadata statistik rating
    const total = reviews.length
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let sumRating = 0

    for (const r of reviews) {
      const star = Math.min(Math.max(Number(r.rating) || 5, 1), 5)
      distribution[star] = (distribution[star] || 0) + 1
      sumRating += star
    }

    const averageRating = total > 0 ? Number((sumRating / total).toFixed(1)) : 5.0

    return res.json({
      data: reviews,
      meta: {
        total,
        averageRating,
        distribution
      }
    })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/reviews
 * Menyimpan ulasan baru untuk pesanan yang telah SELESAI
 */
reviewsRouter.post('/', requireAuth, async (req, res, next) => {
  try {
    const { orderId, rating, comment } = req.body ?? {}

    if (!orderId) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Order ID wajib disertakan' }
      })
    }

    const numRating = Number(rating)
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Rating harus bernilai angka antara 1 sampai 5' }
      })
    }

    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Komentar ulasan tidak boleh kosong' }
      })
    }

    const order = await prisma.order.findUnique({
      where: { id: String(orderId) },
      include: { review: true }
    })

    if (!order) {
      return res.status(404).json({
        error: { code: 'ORDER_NOT_FOUND', message: 'Pesanan tidak ditemukan' }
      })
    }

    if (order.userId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Anda hanya dapat memberikan ulasan untuk pesanan Anda sendiri' }
      })
    }

    if (order.status !== 'SELESAI') {
      return res.status(400).json({
        error: { code: 'INVALID_STATUS', message: 'Ulasan hanya dapat diberikan untuk pesanan yang sudah berstatus SELESAI' }
      })
    }

    if (order.review) {
      return res.status(400).json({
        error: { code: 'ALREADY_REVIEWED', message: 'Pesanan ini sudah pernah diulas sebelumnya' }
      })
    }

    const review = await prisma.review.create({
      data: {
        orderId: order.id,
        equipmentId: order.equipmentId,
        userId: req.userId,
        rating: Math.round(numRating),
        comment: comment.trim()
      },
      include: {
        user: { select: { id: true, fullName: true, kycData: true } },
        equipment: { select: { id: true, name: true, category: true } }
      }
    })

    return res.status(201).json({
      data: review,
      message: 'Ulasan Anda berhasil dikirim. Terima kasih atas masukan Anda!'
    })
  } catch (error) {
    next(error)
  }
})
