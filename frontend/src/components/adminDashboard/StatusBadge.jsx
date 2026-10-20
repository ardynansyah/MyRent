import React from 'react'
import { cn } from '../../lib/utils'
import { STATUS_MENUNGGU, STATUS_META } from './adminDashboardData'

/**
 * Badge status pengajuan dengan gaya shadcn/ui.
 *
 * Desainer:
 * - pil penuh (rounded-full) tanpa garis tepi warna → `border-transparent`
 * - tanpa titik/dot penanda di dalam teks
 * - warna semantik datar: netral, amber, emerald, atau destructive
 *
 * Dipakai bersama oleh tabel dashboard dan header detail pengajuan agar
 * tampilannya selalu identik.
 *
 * @param {object} props
 * @param {string} props.status - salah satu konstanta STATUS_*
 * @param {string} [props.className] - class tambahan
 */
export default function StatusBadge({ status, className }) {
  const meta = STATUS_META[status] || STATUS_META[STATUS_MENUNGGU]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors',
        meta.badge,
        className
      )}
    >
      {meta.label}
    </span>
  )
}
