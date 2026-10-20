import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Gabungkan class name secara aman (standar shadcn/ui).
 * Dipakai untuk class kondisional agar tidak perlu template literal manual.
 *
 * @param {...unknown} inputs - class name, object, atau array
 * @returns {string} daftar class final
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
