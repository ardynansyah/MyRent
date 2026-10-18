import { useState } from 'react'
import { Warehouse, MapPin, Timer, CircleCheck, ImagePlus } from 'lucide-react'
import RegisterFormCard from './RegisterFormCard'
import { TextField, TextAreaField, FieldRow, PillGroup, UploadBox, CheckItem } from './FormControls'

export default function Step3GudangOperasional({ onBack, onNext, onSaveDraft, onNotify }) {
  const [namaGudang, setNamaGudang] = useState('Gudang Cilandak')
  const [alamat, setAlamat] = useState(
    'Jl. Cilandak Tengah No. 24, RT 04/RW 06, Cilandak Barat, Jakarta Selatan 12430'
  )
  const [kota, setKota] = useState('Jakarta Selatan')
  const [kodePos, setKodePos] = useState('12430')
  const [gps, setGps] = useState('(-6.2891, 106.8001)')
  const [jamOperasional, setJamOperasional] = useState('Sen–Jum 08–18')
  const [jamBuka, setJamBuka] = useState('08:00')
  const [jamTutup, setJamTutup] = useState('18:00')
  const [fasilitasJaga, setFasilitasJaga] = useState(true)
  const [fasilitasParkir, setFasilitasParkir] = useState(true)
  const [fasilitasDalamRuangan, setFasilitasDalamRuangan] = useState(true)

  const handlePerbaruiGps = () => {
    setGps('(-6.2891, 106.8001)')
    onNotify?.('Titik GPS gudang berhasil diperbarui.')
  }

  return (
    <RegisterFormCard
      step={3}
      title="Gudang & operasional"
      subtitle="Alamat ini tampil di halaman detail alat Anda."
      backLabel="Kembali"
      nextLabel="Lanjut ke Rekening"
      onBack={onBack}
      onNext={onNext}
      onSaveDraft={onSaveDraft}
    >
      <div className="w-full flex flex-col gap-3.5">
        <TextField
          label="Nama gudang / lokasi pengambilan *"
          icon={Warehouse}
          value={namaGudang}
          onChange={setNamaGudang}
        />

        <TextAreaField label="Alamat lengkap gudang *" value={alamat} onChange={setAlamat} />

        <FieldRow>
          <TextField label="Kota / Kabupaten *" value={kota} onChange={setKota} />
          <TextField label="Kode Pos *" value={kodePos} onChange={setKodePos} />
        </FieldRow>

        {/* Titik lokasi GPS */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">Titik lokasi gudang *</div>
          <div className="w-full flex flex-row items-center gap-2.5 p-3 bg-[#EFF6FF] rounded-[10px]">
            <MapPin className="w-[15px] h-[15px] text-[#1D4ED8] shrink-0" strokeWidth={2.2} />
            <div className="flex-1 min-w-0 flex flex-col gap-px">
              <span className="text-[11px] font-bold text-[#1D4ED8]">
                Titik terambil {gps}
              </span>
              <span className="text-[9px] text-[#94A3B8]">
                Dipakai penyewa untuk estimasi jarak & tarif kurir
              </span>
            </div>
            <button
              type="button"
              onClick={handlePerbaruiGps}
              className="shrink-0 px-[18px] py-[11px] bg-white border border-[#E2E8F0] rounded-[10px] text-[12px] font-semibold text-[#0F172A] hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Perbarui GPS
            </button>
          </div>
        </div>

        {/* Jam operasional */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">Jam operasional pengambilan *</div>
          <PillGroup
            options={['Sen–Jum 08–18', 'Sabtu 08–15', 'Minggu tutup']}
            value={jamOperasional}
            onChange={setJamOperasional}
          />
        </div>

        <FieldRow>
          <TextField label="Jam buka *" icon={Timer} value={jamBuka} onChange={setJamBuka} />
          <TextField label="Jam tutup *" icon={Timer} value={jamTutup} onChange={setJamTutup} />
        </FieldRow>

        {/* Foto gudang */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">
            Foto gudang / tempat penyimpanan alat *
          </div>
          <div className="w-full flex flex-row gap-2.5">
            <UploadBox icon={CircleCheck} title="Tampak Depan" subtitle="Sudah diunggah" uploaded />
            <UploadBox
              icon={CircleCheck}
              title="Area Penyimpanan"
              subtitle="Sudah diunggah"
              uploaded
            />
            <UploadBox icon={ImagePlus} title="Rak / Etalase" subtitle="Belum diunggah" />
          </div>
        </div>

        {/* Fasilitas gudang */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">Fasilitas di gudang</div>
          <div className="w-full flex flex-col gap-2">
            <CheckItem checked={fasilitasJaga} onToggle={() => setFasilitasJaga((v) => !v)}>
              Ada orang jaga saat jam operasional
            </CheckItem>
            <CheckItem checked={fasilitasParkir} onToggle={() => setFasilitasParkir((v) => !v)}>
              Parkir kendaraan pengangkut tersedia
            </CheckItem>
            <CheckItem
              checked={fasilitasDalamRuangan}
              onToggle={() => setFasilitasDalamRuangan((v) => !v)}
            >
              Alat disimpan di dalam ruangan (tidak terkena hujan)
            </CheckItem>
          </div>
        </div>
      </div>
    </RegisterFormCard>
  )
}
