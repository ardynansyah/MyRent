import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { config } from '../config.js'

export const ordersRouter = Router()

/**
 * Middleware: ambil userId dari JWT token.
 * Dipakai di semua endpoint /api/orders.
 */
function authenticate(req, res, next) {
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

// Semua endpoint memerlukan autentikasi.
ordersRouter.use(authenticate)

/**
 * Helper: Generate nomor invoice unik.
 */
function generateInvoiceNumber() {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 900) + 100)
  return `INV-${yy}${mm}-${seq}`
}

// ─── GET /api/orders ──────────────────────────────────────────────────────────
// Daftar pesanan milik user yang sedang login.
ordersRouter.get('/', async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        equipment: {
          include: { owner: { select: { id: true, fullName: true, email: true, phone: true, kycData: true } } }
        }
      }
    })

    // Sort di level aplikasi (JavaScript) agar aman dari batas sort_buffer_size MySQL saat ada field JSON besar
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Jangan kirim base64 photos raksasa di daftar ringkasan pesanan (hemat bandwidth & memory)
    const sanitized = orders.map((o) => {
      if (o.returnData && typeof o.returnData === 'object' && o.returnData.photos) {
        const { photos, ...restReturnData } = o.returnData
        return {
          ...o,
          returnData: {
            ...restReturnData,
            hasPhotos: true,
            photoCount: Object.values(photos || {}).filter(Boolean).length
          }
        }
      }
      return o
    })

    return res.json({ data: sanitized })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────
// Detail pesanan berdasarkan id ATAU invoiceNumber.
ordersRouter.get('/:id', async (req, res, next) => {
  try {
    const identifier = req.params.id
    const order = await prisma.order.findFirst({
      where: {
        AND: [
          { userId: req.userId },
          {
            OR: [
              { id: identifier },
              { invoiceNumber: identifier }
            ]
          }
        ]
      },
      include: {
        equipment: {
          include: { owner: { select: { id: true, fullName: true, email: true, phone: true, kycData: true } } }
        },
        user: { select: { id: true, fullName: true, email: true, phone: true, kycData: true } }
      }
    })

    if (!order) {
      return res.status(404).json({
        error: { code: 'ORDER_NOT_FOUND', message: 'Pesanan tidak ditemukan' }
      })
    }

    return res.json({ data: order })
  } catch (error) {
    next(error)
  }
})

// ─── POST /api/orders ─────────────────────────────────────────────────────────
// Buat pesanan baru (dari halaman Detail Alat → "Ajukan Sewa Sekarang").
ordersRouter.post('/', async (req, res, next) => {
  try {
    const {
      equipmentId, startDate, endDate, rentalDays,
      deliveryMethod, rentalCost, shippingCost, depositAmount, totalPaid
    } = req.body ?? {}

    if (!equipmentId || !startDate || !endDate || !rentalDays) {
      return res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'Data pesanan tidak lengkap' }
      })
    }

    // Pastikan alat masih tersedia.
    const equipment = await prisma.equipment.findUnique({ where: { id: equipmentId } })
    if (!equipment) {
      return res.status(404).json({
        error: { code: 'EQUIPMENT_NOT_FOUND', message: 'Alat tidak ditemukan' }
      })
    }

    const invoiceNumber = generateInvoiceNumber()

    const order = await prisma.order.create({
      data: {
        invoiceNumber,
        userId: req.userId,
        equipmentId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rentalDays: Number(rentalDays),
        deliveryMethod: deliveryMethod || 'COURIER',
        rentalCost: Number(rentalCost) || 0,
        shippingCost: Number(shippingCost) || 0,
        depositAmount: Number(depositAmount) || 0,
        totalPaid: Number(totalPaid) || 0,
        status: 'MENUNGGU_KONFIRMASI'
      },
      include: {
        equipment: {
          include: { owner: { select: { id: true, fullName: true, email: true } } }
        }
      }
    })

    return res.status(201).json({ data: order })
  } catch (error) {
    next(error)
  }
})

// ─── PATCH /api/orders/:id/cancel ─────────────────────────────────────────────
// Batalkan pesanan yang masih MENUNGGU_KONFIRMASI.
ordersRouter.patch('/:id/cancel', async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.userId }
    })

    if (!order) {
      return res.status(404).json({
        error: { code: 'ORDER_NOT_FOUND', message: 'Pesanan tidak ditemukan' }
      })
    }

    if (order.status !== 'MENUNGGU_KONFIRMASI') {
      return res.status(400).json({
        error: { code: 'INVALID_STATUS', message: 'Hanya pesanan berstatus Menunggu Konfirmasi yang bisa dibatalkan' }
      })
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: 'DIBATALKAN' }
    })

    return res.json({ data: updated })
  } catch (error) {
    next(error)
  }
})

// ─── PATCH /api/orders/:id/confirm-delivery ───────────────────────────────────
// Konfirmasi Terima & BAST Awal: DIKIRIM → SEWA_AKTIF.
ordersRouter.patch('/:id/confirm-delivery', async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.userId }
    })

    if (!order) {
      return res.status(404).json({
        error: { code: 'ORDER_NOT_FOUND', message: 'Pesanan tidak ditemukan' }
      })
    }

    if (order.status !== 'DIKIRIM') {
      return res.status(400).json({
        error: { code: 'INVALID_STATUS', message: 'Pesanan belum berstatus Dikirim' }
      })
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: 'SEWA_AKTIF' }
    })

    return res.json({ data: updated })
  } catch (error) {
    next(error)
  }
})

// ─── PATCH /api/orders/:id/extend ─────────────────────────────────────────────
// Perpanjang masa sewa: tambah hari dan biaya.
ordersRouter.patch('/:id/extend', async (req, res, next) => {
  try {
    const { additionalDays } = req.body ?? {}
    if (!additionalDays || additionalDays < 1 || additionalDays > 7) {
      return res.status(400).json({
        error: { code: 'INVALID_DAYS', message: 'Tambahan hari harus antara 1–7' }
      })
    }

    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { equipment: true }
    })

    if (!order) {
      return res.status(404).json({
        error: { code: 'ORDER_NOT_FOUND', message: 'Pesanan tidak ditemukan' }
      })
    }

    if (order.status !== 'SEWA_AKTIF') {
      return res.status(400).json({
        error: { code: 'INVALID_STATUS', message: 'Hanya pesanan Sewa Aktif yang bisa diperpanjang' }
      })
    }

    const additionalCost = order.equipment.pricePerDay * Number(additionalDays)
    const newEndDate = new Date(order.endDate.getTime() + Number(additionalDays) * 86400000)

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        endDate: newEndDate,
        rentalDays: order.rentalDays + Number(additionalDays),
        rentalCost: order.rentalCost + additionalCost,
        totalPaid: order.totalPaid + additionalCost
      }
    })

    return res.json({ data: updated, additionalCost })
  } catch (error) {
    next(error)
  }
})

// ─── PATCH /api/orders/:id/return-draft ───────────────────────────────────────
// Simpan draf returnData (Step 1–3) tanpa mengubah status.
ordersRouter.patch('/:id/return-draft', async (req, res, next) => {
  try {
    const { returnData } = req.body ?? {}

    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.userId }
    })

    if (!order) {
      return res.status(404).json({
        error: { code: 'ORDER_NOT_FOUND', message: 'Pesanan tidak ditemukan' }
      })
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { returnData: returnData ?? {} }
    })

    return res.json({ data: updated })
  } catch (error) {
    next(error)
  }
})

// ─── POST /api/orders/:id/return-submit ───────────────────────────────────────
// Submit final BAST Akhir: simpan returnData lengkap, ubah status ke INSPEKSI.
ordersRouter.post('/:id/return-submit', async (req, res, next) => {
  try {
    const { returnData } = req.body ?? {}

    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.userId }
    })

    if (!order) {
      return res.status(404).json({
        error: { code: 'ORDER_NOT_FOUND', message: 'Pesanan tidak ditemukan' }
      })
    }

    if (order.status !== 'SEWA_AKTIF') {
      return res.status(400).json({
        error: { code: 'INVALID_STATUS', message: 'BAST Akhir hanya bisa dikirim untuk pesanan Sewa Aktif' }
      })
    }

    // Hitung denda keterlambatan jika ada.
    const now = new Date()
    let lateFee = 0
    if (returnData?.lateFee) {
      lateFee = Number(returnData.lateFee)
    }

    // Generate kode PIN serah terima unik 6-digit jika belum ada
    const generateHandoverPin = () => String(Math.floor(100000 + Math.random() * 900000))
    const handoverPin = returnData?.handoverPin || generateHandoverPin()

    const finalReturnData = {
      ...returnData,
      handoverPin,
      bastSubmittedAt: now.toISOString(),
      handedOverAt: returnData?.handedOverAt || null,
      unitReceivedAt: returnData?.unitReceivedAt || null,
      inspectionDeadline: returnData?.inspectionDeadline || null
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        returnData: finalReturnData,
        status: 'INSPEKSI',
        lateFee
      }
    })

    return res.json({ data: updated })
  } catch (error) {
    next(error)
  }
})

// ─── PATCH /api/orders/:id/mark-handed-over ──────────────────────────────────
// Dipanggil oleh Penyewa saat unit fisik telah diserahkan ke kurir atau toko.
ordersRouter.patch('/:id/mark-handed-over', async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.userId }
    })

    if (!order) {
      return res.status(404).json({
        error: { code: 'ORDER_NOT_FOUND', message: 'Pesanan tidak ditemukan' }
      })
    }

    if (order.status !== 'INSPEKSI') {
      return res.status(400).json({
        error: { code: 'INVALID_STATUS', message: 'Hanya pesanan tahap inspeksi yang bisa ditandai telah diserahkan' }
      })
    }

    const now = new Date()
    const currentReturnData = (order.returnData && typeof order.returnData === 'object') ? order.returnData : {}
    const updatedReturnData = {
      ...currentReturnData,
      handedOverAt: now.toISOString()
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { returnData: updatedReturnData }
    })

    return res.json({
      data: updated,
      message: 'Status penyerahan fisik berhasil dicatat. Pemilik akan segera mengonfirmasi penerimaan.'
    })
  } catch (error) {
    next(error)
  }
})

// ─── PATCH /api/orders/:id/confirm-return-receipt ────────────────────────────
// Dipanggil oleh Pemilik Alat (pada Dashboard Pemilik) untuk mengonfirmasi penerimaan fisik unit
// menggunakan Kode PIN Serah Terima 6-digit dari penyewa.
ordersRouter.patch('/:id/confirm-return-receipt', async (req, res, next) => {
  try {
    const { handoverPin } = req.body ?? {}

    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { equipment: true }
    })

    if (!order) {
      return res.status(404).json({
        error: { code: 'ORDER_NOT_FOUND', message: 'Pesanan tidak ditemukan' }
      })
    }

    // Pastikan yang memanggil adalah pemilik alat terkait atau admin
    if (order.equipment.ownerId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Hanya pemilik alat yang berhak mengonfirmasi serah terima fisik unit' }
      })
    }

    if (order.status !== 'INSPEKSI') {
      return res.status(400).json({
        error: { code: 'INVALID_STATUS', message: 'Pesanan belum dalam status inspeksi/pengembalian' }
      })
    }

    const expectedPin = order.returnData?.handoverPin
    if (!handoverPin || String(handoverPin).trim() !== String(expectedPin).trim()) {
      return res.status(400).json({
        error: {
          code: 'INVALID_HANDOVER_PIN',
          message: 'Kode PIN serah terima salah atau tidak sesuai. Masukkan PIN 6-digit yang tertera di aplikasi penyewa.'
        }
      })
    }

    const receivedAt = new Date()
    // Timer batas inspeksi 2x24 jam (48 jam) resmi dimulai dari saat fisik diterima
    const inspectionDeadline = new Date(receivedAt.getTime() + 2 * 24 * 60 * 60 * 1000)

    const currentReturnData = (order.returnData && typeof order.returnData === 'object') ? order.returnData : {}
    const updatedReturnData = {
      ...currentReturnData,
      unitReceivedAt: receivedAt.toISOString(),
      inspectionDeadline: inspectionDeadline.toISOString()
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { returnData: updatedReturnData }
    })

    return res.json({
      data: updated,
      message: 'Fisik unit berhasil dikonfirmasi diterima. Masa inspeksi 2×24 jam telah dimulai.'
    })
  } catch (error) {
    next(error)
  }
})

// ─── PATCH /api/orders/:id/complete-inspection ───────────────────────────────
// Dipanggil oleh Pemilik Alat setelah selesai melakukan inspeksi fisik
// untuk menyetujui pelepasan refund deposit (mengubah status ke SELESAI).
ordersRouter.patch('/:id/complete-inspection', async (req, res, next) => {
  try {
    const { damageFee = 0, ownerNotes = '', approveRefund = true } = req.body ?? {}

    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { equipment: true }
    })

    if (!order) {
      return res.status(404).json({
        error: { code: 'ORDER_NOT_FOUND', message: 'Pesanan tidak ditemukan' }
      })
    }

    if (order.equipment.ownerId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Hanya pemilik alat yang berhak menyelesaikan inspeksi' }
      })
    }

    const now = new Date()
    const currentReturnData = (order.returnData && typeof order.returnData === 'object') ? order.returnData : {}
    const updatedReturnData = {
      ...currentReturnData,
      inspectedAt: now.toISOString(),
      ownerNotes,
      damageFeeClaimed: Number(damageFee) || 0
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: approveRefund ? 'SELESAI' : 'DISPUTE',
        damageFee: Number(damageFee) || 0,
        returnData: updatedReturnData
      }
    })

    return res.json({
      data: updated,
      message: approveRefund
        ? 'Inspeksi fisik disetujui. Dana deposit telah diteruskan ke dompet penyewa.'
        : 'Klaim diajukan ke status dispute untuk mediasi admin.'
    })
  } catch (error) {
    next(error)
  }
})
