import React from 'react'
import { Outlet } from 'react-router-dom'
import NavbarPenyewa from '../common/NavbarPenyewa'

export const UNIVERSAL_LAYOUT_WRAPPER = 'w-full max-w-[1600px] mx-auto px-4 md:px-12 lg:px-20'

/**
 * Universal Wide Layout wrapper standard:
 * - Menggunakan format lebar penuh dengan padding responsif yang konsisten:
 *   w-full max-w-[1600px] mx-auto px-4 md:px-12 lg:px-20
 * - Garis tepi kiri dan kanan Navbar sejajar lurus 100% dengan garis tepi kiri-kanan konten halaman.
 */
export default function MainLayout({ children, ...props }) {
  return (
    <div className="box-border w-full min-h-screen flex flex-col justify-start items-start bg-slate-50 font-sans">
      <NavbarPenyewa {...props} />
      <main className={`box-border flex-1 ${UNIVERSAL_LAYOUT_WRAPPER}`}>
        {children || <Outlet />}
      </main>
    </div>
  )
}
