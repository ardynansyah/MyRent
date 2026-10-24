import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { ApiError } from '../lib/errors.js'
import { config } from '../config.js'

export const equipmentsRouter = Router()

/**
 * Bentuk alat yang dikembalikan ke frontend.
 *
 * `images` disimpan di database sebagai JSON array string, tetapi bisa juga
 * berisi objek / null depending on input. Yang dipakai frontend hanya URL
 * gambar, jadi sisanya dibuang.
 *
 * @param {object} equipment - baris equipment dari Prisma (lengkap dengan owner)
 * @param {Array} [bookedRanges] - array rentang tanggal yang sudah dipesan
 * @returns {object}
 */
function presentEquipment(equipment, bookedRanges = []) {
  const rawImages = Array.isArray(equipment.images) ? equipment.images : []
  const images = rawImages
    .map((image) => (typeof image === 'string' ? image : image?.url ?? image?.src ?? null))
    .filter((url) => typeof url === 'string' && url.length > 0)

  return {
    id: equipment.id,
    name: equipment.name,
    category: equipment.category,
    description: equipment.description,
    pricePerDay: equipment.pricePerDay,
    deposit: equipment.deposit,
    powerWatt: equipment.powerWatt,
    weightKg: equipment.weightKg,
    dimensions: equipment.dimensions,
    maintenanceBufferDays: equipment.maintenanceBufferDays,
    location: equipment.location,
    distance: equipment.distance,
    status: equipment.status,
    images,
    stock: equipment.stock,
    createdAt: equipment.createdAt,
    updatedAt: equipment.updatedAt,
    owner: equipment.owner
      ? {
          id: equipment.owner.id,
          fullName: equipment.owner.fullName,
          email: equipment.owner.email,
          phone: equipment.owner.phone,
          role: equipment.owner.role,
          verificationStatus: equipment.owner.verificationStatus
        }
      : null,
    // Rentang tanggal yang sudah terisi oleh pesanan aktif/bayar
    bookedRanges
  }
}

/**
 * Bangun map dayStatus dari daftar pesanan aktif pada alat ini.
 * Status 'terisi' akan ditandai untuk setiap hari dalam rentang sewa,
 * ditambah buffer maintenance setelah selesai.
 *
 * @param {Array} orders - daftar order dengan startDate, endDate
 * @param {number} bufferDays - jeda perawatan setelah sewa selesai
 * @returns {object} { 'YYYY-MM-DD': 'terisi'|'buffer' }
 */
function buildDayStatusFromOrders(orders, bufferDays = 1) {
  const dayStatus = {}

  for (const order of orders) {
    const start = new Date(order.startDate)
    const end = new Date(order.endDate)

    // Tandai hari sewa sebagai 'terisi'
    const cur = new Date(start)
    while (cur <= end) {
      const key = cur.toISOString().slice(0, 10)
      dayStatus[key] = 'terisi'
      cur.setDate(cur.getDate() + 1)
    }

    // Tandai hari buffer setelah sewa sebagai 'buffer'
    const bufStart = new Date(end)
    bufStart.setDate(bufStart.getDate() + 1)
    for (let i = 0; i < bufferDays; i++) {
      const key = bufStart.toISOString().slice(0, 10)
      if (!dayStatus[key]) dayStatus[key] = 'buffer'
      bufStart.setDate(bufStart.getDate() + 1)
    }
  }

  return dayStatus
}

/**
 * GET /api/equipments
 *
 * Daftar alat yang siap disewa beserta info pemiliknya.
 * Didukung filter sederhana lewat query string:
 *  - `category`  → filter kategori (case-insensitive)
 *  - `search`    → cari pada nama / kategori / deskripsi
 *  - `ownerId`   → filter berdasarkan pemilik tertentu
 *  - `status`    → filter status spesifik
 *  - `allStatus` → jika 'true', kembalikan semua status (TERSEDIA, DISEWA, MAINTENANCE)
 */
equipmentsRouter.get('/', async (req, res, next) => {
  try {
    const { category, search, ownerId, status, allStatus } = req.query ?? {}

    const where = {}

    if (status) {
      where.status = String(status)
    } else if (allStatus !== 'true' && !ownerId) {
      where.status = 'TERSEDIA'
    }

    if (category) {
      where.category = String(category)
    }

    if (ownerId) {
      where.ownerId = String(ownerId)
    }

    if (search) {
      const keyword = String(search).trim()
      if (keyword) {
        where.OR = [
          { name: { contains: keyword } },
          { category: { contains: keyword } },
          { description: { contains: keyword } }
        ]
      }
    }

    const equipments = await prisma.equipment.findMany({
      where,
      include: { owner: true },
      orderBy: [{ distance: 'asc' }, { createdAt: 'desc' }]
    })

    res.json({ data: equipments.map(e => presentEquipment(e)) })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/equipments
 *
 * Tambah alat baru oleh pemilik (autentikasi JWT).
 */
equipmentsRouter.post('/', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Token otentikasi wajib disertakan' }
      })
    }

    let ownerId
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], config.jwtSecret)
      ownerId = decoded.userId
    } catch {
      return res.status(401).json({
        error: { code: 'INVALID_TOKEN', message: 'Token tidak valid atau kedaluwarsa' }
      })
    }

    const {
      name,
      category,
      description = '',
      pricePerDay,
      deposit,
      powerWatt = 0,
      weightKg = 10,
      dimensions = '40 × 30 × 30 cm',
      maintenanceBufferDays = 1,
      location = 'Jakarta',
      distance = 2.0,
      images = []
    } = req.body ?? {}

    if (!name || !category || !pricePerDay || !deposit) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Nama, kategori, tarif sewa, dan deposit wajib diisi' }
      })
    }

    const created = await prisma.equipment.create({
      data: {
        ownerId,
        name: String(name).trim(),
        category: String(category).trim(),
        description: String(description).trim(),
        pricePerDay: Number(pricePerDay),
        deposit: Number(deposit),
        powerWatt: Number(powerWatt) || 0,
        weightKg: Number(weightKg) || 10,
        dimensions: String(dimensions),
        maintenanceBufferDays: Number(maintenanceBufferDays) || 1,
        location: String(location),
        distance: Number(distance) || 2.0,
        status: 'TERSEDIA',
        images: Array.isArray(images) && images.length > 0 ? images : [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
        ]
      },
      include: { owner: true }
    })

    return res.status(201).json({
      data: presentEquipment(created),
      message: 'Alat berhasil ditambahkan ke katalog.'
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/equipments/:id
 *
 * Detail satu alat. Alat yang sedang DISEWA atau MAINTENANCE tetap bisa
 * diambil lewat endpoint ini (dipakai halaman detail), hanya katalog daftar
 * yang menyaring status TERSEDIA.
 *
 * Juga menyertakan `dayStatus` dan `bookedRanges` berdasarkan pesanan
 * aktif (MENUNGGU_KONFIRMASI, DIKIRIM, SEWA_AKTIF, INSPEKSI)
 * sehingga AvailabilityCalendar bisa otomatis menandai tanggal terisi.
 */
equipmentsRouter.get('/:id', async (req, res, next) => {
  try {
    const id = String(req.params.id ?? '').trim()
    if (!id) {
      throw new ApiError(400, 'INVALID_ID', 'ID alat wajib diisi')
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        owner: true,
        orders: {
          where: {
            status: {
              in: ['MENUNGGU_PEMBAYARAN', 'MENUNGGU_KONFIRMASI', 'DIKIRIM', 'SEWA_AKTIF', 'INSPEKSI']
            }
          },
          select: { id: true, startDate: true, endDate: true, status: true }
        }
      }
    })

    if (!equipment) {
      throw new ApiError(404, 'EQUIPMENT_NOT_FOUND', `Alat dengan id '${id}' tidak ditemukan`)
    }

    const bookedRanges = equipment.orders.map(o => ({
      id: o.id,
      startDate: o.startDate.toISOString().slice(0, 10),
      endDate: o.endDate.toISOString().slice(0, 10),
      status: o.status
    }))

    const dayStatus = buildDayStatusFromOrders(equipment.orders, equipment.maintenanceBufferDays)

    const presented = {
      ...presentEquipment(equipment, bookedRanges),
      dayStatus
    }

    res.json({ data: presented })
  } catch (error) {
    next(error)
  }
})
