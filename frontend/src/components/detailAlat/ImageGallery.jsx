import React, { useState } from 'react'
import { MapPin } from 'lucide-react'

// Import extracted detail images
import detail1 from '../../assets/detail/item_1.jpg'
import detail2 from '../../assets/detail/item_2.jpg'
import detail3 from '../../assets/detail/item_3.jpg'
import detail4 from '../../assets/detail/item_4.jpg'
import detail5 from '../../assets/detail/item_5.jpg'

const DEFAULT_IMAGES = [detail1, detail2, detail3, detail4, detail5]

export default function ImageGallery({
  images = DEFAULT_IMAGES,
  status = 'Tersedia',
  distance = '6.5 km'
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const currentImage = images[selectedIndex] || images[0]

  return (
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-3 justify-start items-start">
      {/* Main Large Photo */}
      <div className="box-border w-full h-70 sm:h-95 shrink-0 rounded-2xl overflow-hidden relative bg-slate-100 shadow-2xs">
        <img
          src={currentImage}
          alt={`Foto Alat ${selectedIndex + 1}`}
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
            {selectedIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2.5 justify-start items-start overflow-x-auto scrollbar-none py-1">
        {images.map((img, idx) => {
          const isSelected = selectedIndex === idx
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`box-border flex-1 min-w-17.5 h-17 shrink-0 rounded-[10px] overflow-hidden cursor-pointer transition-all p-0 border-0 bg-slate-100 ${
                isSelected
                  ? 'ring-2 ring-blue-600 ring-offset-1 scale-[1.02]'
                  : 'opacity-70 hover:opacity-100 hover:ring-1 hover:ring-slate-300'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
