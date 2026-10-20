import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { config } from '../config.js'

export const authRouter = Router()

/**
 * Normalisasi role ke ENUM Prisma: PENYEWA | PEMILIK
 */
function normalizeRole(role) {
  if (!role) return 'PENYEWA'
  const upper = String(role).toUpperCase().trim()
  if (upper === 'PEMILIK') return 'PEMILIK'
  return 'PENYEWA'
}

/**
 * POST /api/auth/register
 * Mendaftarkan akun baru (Penyewa UMKM atau Pemilik Alat)
 */
authRouter.post('/register', async (req, res, next) => {
  try {
    const {
      email,
      password,
      role,
      fullName,
      ktpName,
      businessName,
      phone,
      whatsapp,
      // Mock uploads & extra data yang diterima tapi tidak disimpan ke kolom dasar user
      ktpFile,
      selfieFile,
      frontPhoto,
      productionPhoto
    } = req.body

    const cleanEmail = email ? String(email).trim().toLowerCase() : ''
    if (!cleanEmail) {
      return res.status(400).json({
        error: { code: 'EMAIL_REQUIRED', message: 'Alamat email wajib diisi' }
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        error: { code: 'INVALID_EMAIL', message: 'Format email tidak valid' }
      })
    }

    if (!password || String(password).length < 6) {
      return res.status(400).json({
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Kata sandi wajib diisi dan minimal terdiri dari 6 karakter'
        }
      })
    }

    // Cek apakah email sudah terdaftar sebelumnya
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    })

    if (existingUser) {
      return res.status(409).json({
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.'
        }
      })
    }

    const targetRole = normalizeRole(role)
    const resolvedName =
      (fullName && String(fullName).trim()) ||
      (ktpName && String(ktpName).trim()) ||
      (businessName && String(businessName).trim()) ||
      (targetRole === 'PEMILIK' ? 'Pemilik Alat' : 'Penyewa UMKM')

    const resolvedPhone =
      (phone && String(phone).trim()) ||
      (whatsapp && String(whatsapp).trim()) ||
      '-'

    // Hash kata sandi dengan bcrypt (saltRounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Simpan ke database melalui Prisma
    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        password: hashedPassword,
        role: targetRole,
        fullName: resolvedName,
        phone: resolvedPhone
      }
    })

    // Buat token JWT
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role, email: newUser.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    )

    // Response tanpa mengekspos field password
    return res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/auth/login
 * Masuk dengan email & password, mengembalikan JWT token dan info user
 */
authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    const cleanEmail = email ? String(email).trim().toLowerCase() : ''
    if (!cleanEmail || !password) {
      return res.status(400).json({
        error: {
          code: 'MISSING_CREDENTIALS',
          message: 'Email dan kata sandi wajib diisi'
        }
      })
    }

    // Cari user di database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    })

    if (!user) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email atau kata sandi tidak valid'
        }
      })
    }

    // Verifikasi password menggunakan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email atau kata sandi tidak valid'
        }
      })
    }

    // Khusus role ADMIN: Tidak langsung memberikan JWT token, wajib 2-Step OTP
    if (user.role === 'ADMIN') {
      return res.json({
        message: 'Kredensial valid. Verifikasi 2 langkah diperlukan.',
        step: 'OTP_REQUIRED',
        email: user.email
      })
    }

    // Generate JWT token untuk role selain ADMIN (PENYEWA, PEMILIK)
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    )

    return res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/auth/verify-admin-otp
 * Verifikasi 2-Step OTP 6-Digit khusus Admin
 */
authRouter.post('/verify-admin-otp', async (req, res, next) => {
  try {
    const { email, otp } = req.body

    const cleanEmail = email ? String(email).trim().toLowerCase() : ''
    const cleanOtp = otp ? String(otp).trim() : ''

    if (!cleanEmail || !cleanOtp) {
      return res.status(400).json({
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email dan kode OTP wajib diisi'
        }
      })
    }

    // Cari user di database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    })

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({
        error: {
          code: 'ACCESS_DENIED',
          message: 'Akun tidak ditemukan atau tidak memiliki hak akses admin'
        }
      })
    }

    // Validasi kode OTP (MVP: hardcoded '123456')
    if (cleanOtp !== '123456') {
      return res.status(400).json({
        error: {
          code: 'INVALID_OTP',
          message: 'Kode verifikasi tidak valid. Masukkan 6 digit yang benar.'
        }
      })
    }

    // Generate JWT token untuk Admin setelah OTP terverifikasi
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    )

    return res.json({
      message: 'Verifikasi admin berhasil',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/auth/me
 * Memeriksa profil user saat ini dari JWT token
 */
authRouter.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Token tidak disertakan' }
      })
    }

    const token = authHeader.split(' ')[1]
    let decoded
    try {
      decoded = jwt.verify(token, config.jwtSecret)
    } catch (jwtErr) {
      return res.status(401).json({
        error: { code: 'INVALID_TOKEN', message: 'Token tidak valid atau telah kedaluwarsa' }
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return res.status(404).json({
        error: { code: 'USER_NOT_FOUND', message: 'Pengguna tidak ditemukan' }
      })
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
})
