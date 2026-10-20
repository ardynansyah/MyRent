import test from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from '../src/app.js'
import { prisma } from '../src/lib/prisma.js'

test('Auth API Flow', async (t) => {
  const app = createApp()
  const server = app.listen(0)
  const port = server.address().port
  const baseUrl = `http://127.0.0.1:${port}`

  const testEmail = 'auth_test_user@myrent.id'

  t.after(async () => {
    try {
      await prisma.user.deleteMany({ where: { email: testEmail } })
    } catch {
      // ignore
    } finally {
      server.close()
      await prisma.$disconnect()
    }
  })

  // Clean initial
  try {
    await prisma.user.deleteMany({ where: { email: testEmail } })
  } catch {
    // ignore
  }

  await t.test('POST /api/auth/register menolak email kosong', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'Password123!', role: 'PENYEWA' })
    })
    assert.equal(res.status, 400)
    const data = await res.json()
    assert.equal(data.error?.code, 'EMAIL_REQUIRED')
  })

  await t.test('POST /api/auth/register menolak password < 6 karakter', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: '123', role: 'PENYEWA' })
    })
    assert.equal(res.status, 400)
    const data = await res.json()
    assert.equal(data.error?.code, 'INVALID_PASSWORD')
  })

  await t.test('POST /api/auth/register berhasil mendaftarkan user baru dan me-return token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123!',
        role: 'PENYEWA',
        fullName: 'Budi Test Penyewa',
        phone: '081299887766'
      })
    })
    assert.equal(res.status, 201)
    const data = await res.json()
    assert.ok(data.token)
    assert.equal(data.user.email, testEmail)
    assert.equal(data.user.role, 'PENYEWA')
    assert.equal(data.user.fullName, 'Budi Test Penyewa')
  })

  await t.test('POST /api/auth/register menolak email duplikat', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123!',
        role: 'PENYEWA'
      })
    })
    assert.equal(res.status, 409)
    const data = await res.json()
    assert.equal(data.error?.code, 'EMAIL_ALREADY_EXISTS')
  })

  await t.test('POST /api/auth/login menolak password salah', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword!'
      })
    })
    assert.equal(res.status, 401)
    const data = await res.json()
    assert.equal(data.error?.code, 'INVALID_CREDENTIALS')
  })

  await t.test('POST /api/auth/login berhasil dengan kredensial benar', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123!'
      })
    })
    assert.equal(res.status, 200)
    const data = await res.json()
    assert.ok(data.token)
    assert.equal(data.user.email, testEmail)
    assert.equal(data.user.role, 'PENYEWA')
  })

  await t.test('POST /api/auth/login untuk role ADMIN mengembalikan OTP_REQUIRED tanpa JWT token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@myrent.com',
        password: 'Admin#Sewa2026'
      })
    })
    assert.equal(res.status, 200)
    const data = await res.json()
    assert.equal(data.step, 'OTP_REQUIRED')
    assert.equal(data.token, undefined)
    assert.equal(data.email, 'admin@myrent.com')
  })

  await t.test('POST /api/auth/verify-admin-otp menolak OTP yang salah', async () => {
    const res = await fetch(`${baseUrl}/api/auth/verify-admin-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@myrent.com',
        otp: '000000'
      })
    })
    assert.equal(res.status, 400)
    const data = await res.json()
    assert.equal(data.error?.code, 'INVALID_OTP')
  })

  await t.test('POST /api/auth/verify-admin-otp menerima OTP 123456 dan mengembalikan token JWT', async () => {
    const res = await fetch(`${baseUrl}/api/auth/verify-admin-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@myrent.com',
        otp: '123456'
      })
    })
    assert.equal(res.status, 200)
    const data = await res.json()
    assert.ok(data.token)
    assert.equal(data.user.email, 'admin@myrent.com')
    assert.equal(data.user.role, 'ADMIN')
  })
})
