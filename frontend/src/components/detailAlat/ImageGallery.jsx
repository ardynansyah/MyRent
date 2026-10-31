import React, { useMemo, useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'

// Import extracted detail images
import detail1 from '../../assets/detail/item_1.jpg'
import detail2 from '../../assets/detail/item_2.jpg'
import detail3 from '../../assets/detail/item_3.jpg'
import detail4 from '../../assets/detail/item_4.jpg'
import detail5 from '../../assets/detail/item_5.jpg'

const DEFAULT_IMAGES = [detail1, detail2, detail3, detail4, detail5]

export default function ImageGallery({
  images = [],
  status = 'Tersedia',
  distance = '6.5 km'
}) {
  // Fallback ke foto bawaan bila database tidak menyimpan foto alat.
  const galleryImages = useMemo(
    () => (Array.isArray(images) && images.length > 0 ? images : DEFAULT_IMAGES),
    [images]
  )

  // Gambar yang sedang ditampilkan di panel utama.
  const [activeImage, setActiveImage] = useState(galleryImages[0])

  // Pastikan foto aktif selalu sinkron bila daftar foto berubah
  useEffect(() => {
    if (!galleryImages.includes(activeImage)) {
      setActiveImage(galleryImages[0])
    }
  }, [galleryImages, activeImage])

  const activeIndex = galleryImages.indexOf(activeImage)
  const currentIndex = activeIndex >= 0 ? activeIndex : 0
  const currentImage = galleryImages[currentIndex] || galleryImages[0]
  const currentPosition = currentIndex + 1

  const handleImageError = (event) => {
    const fallback = DEFAULT_IMAGES[0]
    if (event.currentTarget.getAttribute('src') !== fallback) {
      event.currentTarget.src = fallback
    }
  }

  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-3 justify-start items-start">
      {/* Main Large Photo — Tampil full mengisi kontainer secara rapi dan bersih */}
      <div className="box-border w-full h-70 sm:h-95 shrink-0 rounded-2xl overflow-hidden relative bg-slate-100 shadow-2xs">
        <img
          src={currentImage}
          alt={`Foto Alat ${currentPosition}`}
          onError={handleImageError}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Status Badge */}
        <div className="box-border w-fit h-fit absolute left-4 top-4 flex flex-row gap-0 py-1.5 px-3 justify-start items-start bg-white rounded-full shadow-2xs z-10">
          <span className="text-xs text-green-700 font-bold whitespace-nowrap">
            {status}
          </span>
        </div>

        {/* Distance Badge */}
        <div className="box-border w-fit h-fit absolute left-4 bottom-4 flex flex-row gap-1.25 py-1.25 px-2.5 justify-start items-center bg-white/95 backdrop-blur rounded-full shadow-2xs z-10">
          <MapPin className="w-3 h-3 text-slate-600" />
          <span className="text-[11px] text-slate-600 font-semibold tabular-nums whitespace-nowrap">
            {distance}
          </span>
        </div>

        {/* Photo Counter */}
        <div className="box-border w-fit h-fit absolute right-4 bottom-4 flex flex-row gap-0 py-1.25 px-2.5 justify-start items-center bg-slate-900/85 backdrop-blur rounded-full z-10 select-none">
          <span className="text-[11px] text-white font-semibold whitespace-nowrap">
            {currentPosition} / {galleryImages.length}
          </span>
        </div>
      </div>

      {/* Thumbnails Row
          Diberi padding horizontal px-2 dan py-2 agar foto thumbnail paling kiri
          memiliki ruang cukup dan ring seleksinya TIDAK terpotong oleh sisi kiri layar/wadah. */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2.5 justify-start items-center overflow-x-auto scrollbar-none px-2 py-2">
        {galleryImages.map((img, idx) => {
          const isActive = idx === currentIndex
          return (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setActiveImage(img)}
              aria-label={`Tampilkan foto ${idx + 1}`}
              aria-current={isActive}
              className={`box-border w-20 h-20 shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all p-0 border-0 bg-slate-100 ${
                isActive
                  ? 'ring-2 ring-blue-600 ring-offset-2'
                  : 'opacity-70 hover:opacity-100 hover:ring-1 hover:ring-slate-300'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
