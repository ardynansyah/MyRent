import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { prisma } from '../lib/prisma.js'

/**
 * Middleware JWT khusus Admin HQ.
 *
 * Semua endpoint di bawah `/api/admin` memakai middleware ini.
 * Sesi admin di frontend memakai key localStorage terpisah (`admin_token`),
 * sehingga token penyewa tidak pernah bisa menyentuh endpoint admin.
 */
export async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Token admin wajib disertakan' }
      })
    }

    const token = authHeader.slice('Bearer '.length).trim()

    let decoded
    try {
      decoded = jwt.verify(token, config.jwtSecret)
    } catch {
      return res.status(401).json({
        error: { code: 'INVALID_TOKEN', message: 'Token tidak valid atau telah kedaluwarsa' }
      })
    }

    if (String(decoded.role || '').toUpperCase() !== 'ADMIN') {
      return res.status(403).json({
        error: { code: 'ACCESS_DENIED', message: 'Hanya akun admin yang boleh mengakses resource ini' }
      })
    }

    const admin = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, fullName: true, role: true }
    })

    if (!admin || admin.role !== 'ADMIN') {
      return res.status(403).json({
        error: { code: 'ACCESS_DENIED', message: 'Akun admin tidak ditemukan atau sudah tidak aktif' }
      })
    }

    req.admin = admin
    return next()
  } catch (error) {
    return next(error)
  }
}
