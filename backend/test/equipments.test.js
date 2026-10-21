import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { after, before } from 'node:test'
import { createApp } from '../src/app.js'
import { prisma } from '../src/lib/prisma.js'

/**
 * Test endpoint katalog alat:
 *   GET /api/equipments     → daftar alat TERSEDIA + info pemilik
 *   GET /api/equipments/:id → detail satu alat
 *
 * Data uji dibuat sendiri (bukan mengandalkan seeder) supaya test tetap valid
 * walaupun database sedang berisi data lain.
 */

const OWNER_EMAIL = 'equipments_test_owner@myrent.id'
const EQUIPMENT_ID = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'
const HIDDEN_EQUIPMENT_ID = 'ffffffff-ffff-4fff-8fff-ffffffffffff'

let server
let baseUrl
let ownerId

before(async () => {
  server = createApp().listen(0, '127.0.0.1')
  await once(server, 'listening')
  baseUrl = `http://127.0.0.1:${server.address().port}`

  const owner = await prisma.user.upsert({
    where: { email: OWNER_EMAIL },
    update: {},
    create: {
      email: OWNER_EMAIL,
      password: 'Password123!',
      role: 'PEMILIK',
      fullName: 'Pemilik Uji Coba',
      phone: '081200000001',
      verificationStatus: 'DISETUJUI'
    }
  })

  ownerId = owner.id

  await prisma.equipment.upsert({
    where: { id: EQUIPMENT_ID },
    update: {},
    create: {
      id: EQUIPMENT_ID,
      ownerId,
      name: 'Espresso Machine Uji Coba',
      category: 'Mesin Kopi',
      description: 'Mesin espresso untuk pengujian endpoint katalog.',
      pricePerDay: 150000,
      deposit: 500000,
      powerWatt: 1300,
      weightKg: 45,
      dimensions: '58 x 49 x 41 cm',
      maintenanceBufferDays: 1,
      location: 'Kec. Cilandak, Jakarta Selatan',
      distance: 2.4,
      status: 'TERSEDIA',
      images: ['https://example.test/mesin-kopi.jpg']
    }
  })

  // Alat berstatus DISEWA harus disembunyikan dari daftar katalog.
  await prisma.equipment.upsert({
    where: { id: HIDDEN_EQUIPMENT_ID },
    update: {},
    create: {
      id: HIDDEN_EQUIPMENT_ID,
      ownerId,
      name: 'Oven Uji Coba (Disewa)',
      category: 'Oven & Bakery',
      description: 'Alat status DISEWA, tidak boleh muncul di katalog.',
      pricePerDay: 210000,
      deposit: 750000,
      powerWatt: 2200,
      weightKg: 85,
      dimensions: '90 x 70 x 60 cm',
      maintenanceBufferDays: 2,
      location: 'Kec. Kebayoran Baru, Jakarta Selatan',
      distance: 3.1,
      status: 'DISEWA',
      images: []
    }
  })
})

after(async () => {
  try {
    await prisma.equipment.deleteMany({
      where: { id: { in: [EQUIPMENT_ID, HIDDEN_EQUIPMENT_ID] } }
    })
    await prisma.user.deleteMany({ where: { email: OWNER_EMAIL } })
  } catch {
    // ignore
  } finally {
    server.close()
    await prisma.$disconnect()
  }
})

const api = (path) => fetch(`${baseUrl}${path}`)

test('GET /api/equipments hanya mengembalikan alat berstatus TERSEDIA', async () => {
  const res = await api('/api/equipments')
  assert.equal(res.status, 200)

  const body = await res.json()
  assert.ok(Array.isArray(body.data))

  const ids = body.data.map((item) => item.id)
  assert.ok(ids.includes(EQUIPMENT_ID))
  assert.ok(!ids.includes(HIDDEN_EQUIPMENT_ID))
  assert.ok(body.data.every((item) => item.status === 'TERSEDIA'))
})

test('GET /api/equipments menyertakan data field database dan info pemilik', async () => {
  const res = await api('/api/equipments')
  const body = await res.json()

  const equipment = body.data.find((item) => item.id === EQUIPMENT_ID)
  assert.ok(equipment)

  assert.equal(equipment.name, 'Espresso Machine Uji Coba')
  assert.equal(equipment.category, 'Mesin Kopi')
  assert.equal(equipment.pricePerDay, 150000)
  assert.equal(equipment.deposit, 500000)
  assert.equal(equipment.powerWatt, 1300)
  assert.equal(equipment.weightKg, 45)
  assert.equal(equipment.maintenanceBufferDays, 1)
  assert.equal(equipment.location, 'Kec. Cilandak, Jakarta Selatan')
  assert.equal(equipment.distance, 2.4)
  assert.deepEqual(equipment.images, ['https://example.test/mesin-kopi.jpg'])

  assert.equal(equipment.owner.id, ownerId)
  assert.equal(equipment.owner.email, OWNER_EMAIL)
  assert.equal(equipment.owner.role, 'PEMILIK')
})

test('GET /api/equipments/:id mengembalikan detail satu alat', async () => {
  const res = await api(`/api/equipments/${EQUIPMENT_ID}`)
  assert.equal(res.status, 200)

  const body = await res.json()
  assert.equal(body.data.id, EQUIPMENT_ID)
  assert.equal(body.data.powerWatt, 1300)
  assert.equal(body.data.owner.id, ownerId)
})

test('GET /api/equipments/:id tetap bisa mengambil alat berstatus DISEWA', async () => {
  const res = await api(`/api/equipments/${HIDDEN_EQUIPMENT_ID}`)
  assert.equal(res.status, 200)

  const body = await res.json()
  assert.equal(body.data.status, 'DISEWA')
})

test('GET /api/equipments/:id mengembalikan 404 untuk id yang tidak dikenal', async () => {
  const res = await api('/api/equipments/00000000-0000-4000-8000-000000000000')
  assert.equal(res.status, 404)

  const body = await res.json()
  assert.equal(body.error.code, 'EQUIPMENT_NOT_FOUND')
})
