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
    <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start">
      {/* Main Large Photo */}
      <div className="box-border w-full h-[280px] sm:h-[380px] shrink-0 rounded-[16px] overflow-hidden relative bg-slate-100 shadow-2xs">
        <img
          src={currentImage}
          alt={`Foto Alat ${selectedIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Status Badge */}
        <div className="box-border w-fit h-fit absolute left-[16px] top-[16px] flex flex-row gap-0 py-[6px] px-[12px] justify-start items-start bg-[#FFFFFF] rounded-full shadow-2xs z-10">
          <span className="text-[12px] text-[#15803D] font-bold whitespace-nowrap">
            {status}
          </span>
        </div>

        {/* Distance Badge */}
        <div className="box-border w-fit h-fit absolute left-[16px] bottom-[16px] flex flex-row gap-[5px] py-[5px] px-[10px] justify-start items-center bg-[#FFFFFF]/95 backdrop-blur rounded-full shadow-2xs z-10">
          <MapPin className="w-[12px] h-[12px] text-[#475569]" />
          <span className="text-[11px] text-[#475569] font-semibold tabular-nums whitespace-nowrap">
            {distance}
          </span>
        </div>

        {/* Photo Counter */}
        <div className="box-border w-fit h-fit absolute right-[16px] bottom-[16px] flex flex-row gap-0 py-[5px] px-[10px] justify-start items-center bg-[#0F172A]/85 backdrop-blur rounded-full z-10 select-none">
          <span className="text-[11px] text-[#FFFFFF] font-semibold whitespace-nowrap">
            {selectedIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[10px] justify-start items-start overflow-x-auto scrollbar-none py-1">
        {images.map((img, idx) => {
          const isSelected = selectedIndex === idx
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`box-border flex-1 min-w-[70px] h-[68px] shrink-0 rounded-[10px] overflow-hidden cursor-pointer transition-all p-0 border-0 bg-slate-100 ${
                isSelected
                  ? 'ring-2 ring-[#2563EB] ring-offset-1 scale-[1.02]'
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
