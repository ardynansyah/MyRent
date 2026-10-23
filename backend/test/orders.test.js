import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { after, before } from 'node:test'
import jwt from 'jsonwebtoken'
import { createApp } from '../src/app.js'
import { prisma } from '../src/lib/prisma.js'
import { config } from '../src/config.js'

const TEST_RENTER_EMAIL = 'renter_orders_test@myrent.id'
const TEST_OWNER_EMAIL = 'owner_orders_test@myrent.id'
const TEST_EQUIPMENT_ID = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'

let server
let baseUrl
let renterToken
let renterId
let equipmentId
let createdOrderId

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
      fullName: 'Penyewa Uji Coba',
      phone: '081299990001',
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
      fullName: 'Pemilik Uji Coba Orders',
      phone: '081299990002',
      verificationStatus: 'DISETUJUI'
    }
  })

  const equipment = await prisma.equipment.upsert({
    where: { id: TEST_EQUIPMENT_ID },
    update: {},
    create: {
      id: TEST_EQUIPMENT_ID,
      ownerId: owner.id,
      name: 'Planetary Mixer Orders Test',
      category: 'Food Processing',
      description: 'Mixer untuk test order checkout.',
      pricePerDay: 75000,
      deposit: 300000,
      powerWatt: 550,
      weightKg: 25,
      dimensions: '40 x 30 x 50 cm',
      maintenanceBufferDays: 1,
      distance: 3.5,
      location: 'Jakarta Barat',
      status: 'TERSEDIA'
    }
  })
  equipmentId = equipment.id
})

after(async () => {
  if (createdOrderId) {
    await prisma.order.deleteMany({ where: { id: createdOrderId } })
  }
  await prisma.equipment.deleteMany({ where: { id: TEST_EQUIPMENT_ID } })
  await prisma.user.deleteMany({ where: { email: { in: [TEST_RENTER_EMAIL, TEST_OWNER_EMAIL] } } })
  if (server) {
    server.close()
  }
})

test('POST /api/orders/validate-promo validasi kode promo', async () => {
  const resValid = await fetch(`${baseUrl}/api/orders/validate-promo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${renterToken}`
    },
    body: JSON.stringify({ code: 'UMKMAJU', subtotal: 300000 })
  })
  const jsonValid = await resValid.json()
  assert.equal(resValid.status, 200)
  assert.equal(jsonValid.data.code, 'UMKMAJU')
  assert.equal(jsonValid.data.discountAmount, 50000)

  const resInvalid = await fetch(`${baseUrl}/api/orders/validate-promo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${renterToken}`
    },
    body: JSON.stringify({ code: 'INVALIDCODE', subtotal: 300000 })
  })
  assert.equal(resInvalid.status, 404)
})

test('POST /api/orders membuat order dengan status MENUNGGU_PEMBAYARAN dan metadata lengkap', async () => {
  const startDate = new Date()
  const endDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

  const payload = {
    equipmentId,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    rentalDays: 3,
    deliveryMethod: 'COURIER',
    rentalCost: 225000,
    shippingCost: 45000,
    depositAmount: 300000,
    totalPaid: 525000,
    addons: [{ id: 'insurance', label: 'Asuransi Kerusakan', price: 45000 }],
    addonsCost: 45000,
    promoCode: 'UMKMAJU',
    discountAmount: 50000,
    renterNotes: 'Mohon dikirim pagi hari jam 10.',
    contractAgreedAt: new Date().toISOString()
  }

  const res = await fetch(`${baseUrl}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${renterToken}`
    },
    body: JSON.stringify(payload)
  })

  const json = await res.json()
  assert.equal(res.status, 201)
  assert.ok(json.data.id)
  assert.ok(json.data.invoiceNumber.startsWith('INV-'))
  assert.equal(json.data.status, 'MENUNGGU_PEMBAYARAN')
  assert.equal(json.data.renterNotes, payload.renterNotes)
  assert.equal(json.data.promoCode, 'UMKMAJU')
  assert.equal(json.data.discountAmount, 50000)
  assert.ok(json.data.paymentDeadline)

  createdOrderId = json.data.id
})

test('GET /api/orders/:id mengambil detail order', async () => {
  const res = await fetch(`${baseUrl}/api/orders/${createdOrderId}`, {
    headers: { Authorization: `Bearer ${renterToken}` }
  })
  const json = await res.json()
  assert.equal(res.status, 200)
  assert.equal(json.data.id, createdOrderId)
  assert.equal(json.data.status, 'MENUNGGU_PEMBAYARAN')
  assert.ok(json.data.equipment)
})

test('PATCH /api/orders/:id/mock-pay simulasi mock payment', async () => {
  const res = await fetch(`${baseUrl}/api/orders/${createdOrderId}/mock-pay`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${renterToken}`
    },
    body: JSON.stringify({ paymentMethod: 'QRIS' })
  })

  const json = await res.json()
  assert.equal(res.status, 200)
  assert.equal(json.data.status, 'MENUNGGU_KONFIRMASI')
  assert.equal(json.data.paymentMethod, 'QRIS')
  assert.ok(json.data.paidAt)

  // Coba bayar ulang harus ditolak karena status bukan MENUNGGU_PEMBAYARAN lagi
  const resRetry = await fetch(`${baseUrl}/api/orders/${createdOrderId}/mock-pay`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${renterToken}`
    },
    body: JSON.stringify({ paymentMethod: 'VA_BCA' })
  })
  assert.equal(resRetry.status, 400)
})
