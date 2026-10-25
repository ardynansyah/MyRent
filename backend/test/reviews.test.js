import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { after, before } from 'node:test'
import jwt from 'jsonwebtoken'
import { createApp } from '../src/app.js'
import { prisma } from '../src/lib/prisma.js'
import { config } from '../src/config.js'

const TEST_RENTER_EMAIL = 'renter_reviews_test@myrent.id'
const TEST_OWNER_EMAIL = 'owner_reviews_test@myrent.id'
const TEST_EQUIPMENT_ID = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'
const TEST_ORDER_ID = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'

let server
let baseUrl
let renterToken
let renterId
let ownerToken
let ownerId

before(async () => {
  server = createApp().listen(0, '127.0.0.1')
  await once(server, 'listening')
  baseUrl = `http://127.0.0.1:${server.address().port}`

  const renter = await prisma.user.upsert({
    where: { email: TEST_RENTER_EMAIL },
    update: {},
    create: {
      email: TEST_RENTER_EMAIL,
      password: 'Password123!',
      role: 'PENYEWA',
      fullName: 'Penyewa Review Test',
      phone: '081299990003',
      verificationStatus: 'DISETUJUI'
    }
  })
  renterId = renter.id
  renterToken = jwt.sign({ userId: renter.id, role: renter.role }, config.jwtSecret, { expiresIn: '1h' })

  const owner = await prisma.user.upsert({
    where: { email: TEST_OWNER_EMAIL },
    update: {},
    create: {
      email: TEST_OWNER_EMAIL,
      password: 'Password123!',
      role: 'PEMILIK',
      fullName: 'Pemilik Review Test',
      phone: '081299990004',
      verificationStatus: 'DISETUJUI'
    }
  })
  ownerId = owner.id
  ownerToken = jwt.sign({ userId: owner.id, role: owner.role }, config.jwtSecret, { expiresIn: '1h' })

  await prisma.equipment.upsert({
    where: { id: TEST_EQUIPMENT_ID },
    update: {},
    create: {
      id: TEST_EQUIPMENT_ID,
      ownerId: owner.id,
      name: 'Coffee Grinder Review Test',
      category: 'Mesin Kopi',
      description: 'Test coffee grinder for review suite',
      pricePerDay: 50000,
      deposit: 100000,
      powerWatt: 300,
      weightKg: 5,
      dimensions: '20x15x30 cm',
      location: 'Jakarta',
      distance: 1.0,
      status: 'TERSEDIA'
    }
  })

  // Hapus review lama jika ada dari run sebelumnya
  await prisma.review.deleteMany({
    where: { orderId: TEST_ORDER_ID }
  })

  // Buat order berstatus SELESAI
  await prisma.order.upsert({
    where: { id: TEST_ORDER_ID },
    update: { status: 'SELESAI' },
    create: {
      id: TEST_ORDER_ID,
      invoiceNumber: 'INV-TEST-REV-01',
      userId: renter.id,
      equipmentId: TEST_EQUIPMENT_ID,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 3),
      rentalDays: 3,
      deliveryMethod: 'PICKUP',
      rentalCost: 150000,
      shippingCost: 0,
      depositAmount: 100000,
      totalPaid: 250000,
      status: 'SELESAI'
    }
  })
})

after(async () => {
  await prisma.review.deleteMany({
    where: { orderId: TEST_ORDER_ID }
  }).catch(() => {})
  if (server) server.close()
})

test('GET /api/reviews mengembalikan daftar ulasan dan metadata rating', async () => {
  const res = await fetch(`${baseUrl}/api/reviews`)
  assert.equal(res.status, 200)

  const body = await res.json()
  assert.ok(Array.isArray(body.data))
  assert.ok(body.meta)
  assert.equal(typeof body.meta.total, 'number')
  assert.equal(typeof body.meta.averageRating, 'number')
  assert.ok(body.meta.distribution)
})

test('POST /api/orders/:id/review mengirim ulasan dan rating untuk pesanan SELESAI', async () => {
  const res = await fetch(`${baseUrl}/api/orders/${TEST_ORDER_ID}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${renterToken}`
    },
    body: JSON.stringify({
      rating: 5,
      comment: 'Pengalaman sewa sangat memuaskan, mesin bekerja optimal!'
    })
  })

  assert.equal(res.status, 201)
  const body = await res.json()
  assert.equal(body.data.rating, 5)
  assert.equal(body.data.comment, 'Pengalaman sewa sangat memuaskan, mesin bekerja optimal!')
  assert.equal(body.data.orderId, TEST_ORDER_ID)
})

test('POST /api/orders/:id/review menolak ulasan duplikat untuk pesanan yang sama', async () => {
  const res = await fetch(`${baseUrl}/api/orders/${TEST_ORDER_ID}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${renterToken}`
    },
    body: JSON.stringify({
      rating: 4,
      comment: 'Mencoba ulasan kedua kali'
    })
  })

  assert.equal(res.status, 400)
  const body = await res.json()
  assert.equal(body.error.code, 'ALREADY_REVIEWED')
})
