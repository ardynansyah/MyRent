import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { ApiError } from '../lib/errors.js'

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
 * Daftar alat yang siap disewa (status TERSEDIA) beserta info pemiliknya.
 * Didukung filter sederhana lewat query string:
 *  - `category`  → filter kategori (case-insensitive)
 *  - `search`    → cari pada nama / kategori / deskripsi
 *  - `ownerId`   → filter berdasarkan pemilik tertentu
 */
equipmentsRouter.get('/', async (req, res, next) => {
  try {
    const { category, search, ownerId } = req.query ?? {}

    const where = {
      status: 'TERSEDIA'
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
