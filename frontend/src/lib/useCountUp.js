import { useState, useEffect } from 'react'

/**
 * Hook untuk animasi angka memuat (Count-Up) dari 0 ke target nilai.
 * Menggunakan easing cubic out agar transisi terlihat mulus dan natural.
 *
 * @param {number} targetValue - Nilai akhir saldo
 * @param {number} duration - Durasi animasi dalam milidetik (default: 1200ms)
 * @param {boolean} enabled - Apakah animasi aktif (default: true)
 * @returns {number} Nilai teranimasi
 */
export function useCountUp(targetValue, duration = 1200, enabled = true) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setCount(Number(targetValue) || 0)
      return undefined
    }

    const target = Number(targetValue) || 0
    if (target === 0) {
      setCount(0)
      return undefined
    }

    let startTimestamp = null
    let animationFrameId

    // Set nilai awal 0 saat mulai animasi
    setCount(0)

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const elapsed = timestamp - startTimestamp
      const progress = Math.min(elapsed / duration, 1)

      // Easing cubic out: cepat di awal lalu melambat halus mendekati target
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(target * easeProgress)

      setCount(current)

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step)
      } else {
        setCount(target)
      }
    }

    animationFrameId = window.requestAnimationFrame(step)

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [targetValue, duration, enabled])

  return count
}
