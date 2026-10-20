import { useState } from 'react'
import { Warehouse, MapPin, Timer, CircleCheck, ImagePlus } from 'lucide-react'
import RegisterFormCard from './RegisterFormCard'
import { TextField, TextAreaField, FieldRow, UploadBox, CheckItem } from './FormControls'
import { fileToPreviewDataUrl, formatFileSize } from '../../lib/registration'

export default function Step3GudangOperasional({
  formData = {},
  onChange,
  onBack,
  onNext,
  onSaveDraft,
  onNotify
}) {
  const [namaLokasi, setNamaLokasi] = useState(formData.namaLokasi ?? 'Lokasi Cilandak')
  const [alamat, setAlamat] = useState(
    formData.alamat ??
      'Jl. Cilandak Tengah No. 24, RT 04/RW 06, Cilandak Barat, Jakarta Selatan 12430'
  )
  const [kota, setKota] = useState(formData.kota ?? 'Jakarta Selatan')
  const [kodePos, setKodePos] = useState(formData.kodePos ?? '12430')
  const [gps, setGps] = useState(formData.gps ?? '(-6.2891, 106.8001)')
  const [hariOperasional, setHariOperasional] = useState(formData.hariOperasional ?? 'Senin - Sabtu')
  const [jamBuka, setJamBuka] = useState(formData.jamBuka ?? '08:00')
  const [jamTutup, setJamTutup] = useState(formData.jamTutup ?? '18:00')
  const [fasilitasJaga, setFasilitasJaga] = useState(formData.fasilitasJaga ?? true)
  const [fasilitasParkir, setFasilitasParkir] = useState(formData.fasilitasParkir ?? true)
  const [fasilitasDalamRuangan, setFasilitasDalamRuangan] = useState(
    formData.fasilitasDalamRuangan ?? true
  )
  const [errors, setErrors] = useState({})
  const [frontPhoto, setFrontPhoto] = useState(formData.frontPhoto ?? null)
  const [storagePhoto, setStoragePhoto] = useState(formData.storagePhoto ?? null)
  const [rackPhoto, setRackPhoto] = useState(formData.rackPhoto ?? null)

  const handleFile = async (field, setter, file) => {
    const preview = await fileToPreviewDataUrl(file)
    const value = {
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      preview: preview || null,
      lastModified: file.lastModified
    }
    setter(value)
    onChange?.(field, value)
  }

  const handleFieldChange = (field, value, setter) => {
    setter(value)
    onChange?.(field, value)
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handlePerbaruiGps = () => {
    const lat = (-6.2891 - Math.random() * 0.01).toFixed(4)
    const lng = (106.8001 + Math.random() * 0.01).toFixed(4)
    const coords = `(${lat}, ${lng})`
    setGps(coords)
    onChange?.('gps', coords)
    onNotify?.('Titik GPS lokasi berhasil diperbarui.')
  }

  const validateAndProceed = () => {
    const newErrors = {}

    if (!namaLokasi || !namaLokasi.trim()) {
      newErrors.namaLokasi = 'Nama lokasi wajib diisi'
    }

    if (!alamat || !alamat.trim()) {
      newErrors.alamat = 'Alamat lengkap lokasi wajib diisi'
    }

    if (!kota || !kota.trim()) {
      newErrors.kota = 'Kota / Kabupaten wajib diisi'
    }

    if (!kodePos || !kodePos.trim()) {
      newErrors.kodePos = 'Kode Pos wajib diisi'
    }

    if (!hariOperasional || !hariOperasional.trim()) {
      newErrors.hariOperasional = 'Hari operasional wajib diisi'
    }

    if (!jamBuka) {
      newErrors.jamBuka = 'Jam buka wajib diisi'
    }

    if (!jamTutup) {
      newErrors.jamTutup = 'Jam tutup wajib diisi'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert('Harap lengkapi seluruh kolom wajib pada Lokasi Operasional.')
      return
    }

    setErrors({})
    onNext?.({
      namaLokasi: namaLokasi.trim(),
      alamat: alamat.trim(),
      kota: kota.trim(),
      kodePos: kodePos.trim(),
      gps,
      hariOperasional: hariOperasional.trim(),
      jamBuka,
      jamTutup,
      fasilitasJaga,
      fasilitasParkir,
      fasilitasDalamRuangan,
      frontPhoto,
      storagePhoto,
      rackPhoto
    })
  }

  return (
    <RegisterFormCard
      step={3}
      title="Lokasi operasional"
      subtitle="Alamat ini tampil di halaman detail alat Anda."
      backLabel="Kembali"
      nextLabel="Lanjut ke Rekening"
      onBack={onBack}
      onNext={validateAndProceed}
      onSaveDraft={onSaveDraft}
    >
      <div className="w-full flex flex-col gap-3.5">
        <TextField
          label="Nama lokasi / tempat pengambilan *"
          icon={Warehouse}
          value={namaLokasi}
          onChange={(val) => handleFieldChange('namaLokasi', val, setNamaLokasi)}
          error={errors.namaLokasi}
          placeholder="Contoh: Lokasi Cilandak"
        />

        <TextAreaField
          label="Alamat lengkap lokasi *"
          value={alamat}
          onChange={(val) => handleFieldChange('alamat', val, setAlamat)}
          error={errors.alamat}
          placeholder="Nama jalan, nomor gudang, RT/RW, kelurahan"
        />

        <FieldRow>
          <TextField
            label="Kota / Kabupaten *"
            value={kota}
            onChange={(val) => handleFieldChange('kota', val, setKota)}
            error={errors.kota}
            placeholder="Jakarta Selatan"
          />
          <TextField
            label="Kode Pos *"
            value={kodePos}
            onChange={(val) => handleFieldChange('kodePos', val, setKodePos)}
            error={errors.kodePos}
            placeholder="12430"
          />
        </FieldRow>

        {/* Titik lokasi GPS */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">Titik koordinat lokasi *</div>
          <div className="w-full flex flex-row items-center gap-2.5 p-3 bg-[#EFF6FF] rounded-[10px]">
            <MapPin className="w-[15px] h-[15px] text-[#1D4ED8] shrink-0" strokeWidth={2.2} />
            <div className="flex-1 min-w-0 flex flex-col gap-px">
              <span className="text-[11px] font-bold text-[#1D4ED8]">
                Titik terambil {gps}
              </span>
              <span className="text-[9px] text-[#94A3B8]">
                Dipakai penyewa untuk estimasi jarak &amp; tarif kurir
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

        {/* Hari Operasional */}
        <TextField
          label="Hari Operasional *"
          placeholder="Contoh: Senin - Sabtu"
          value={hariOperasional}
          onChange={(val) => handleFieldChange('hariOperasional', val, setHariOperasional)}
          error={errors.hariOperasional}
        />

        {/* Jam Buka & Jam Tutup */}
        <FieldRow>
          <TextField
            label="Jam Buka *"
            type="time"
            icon={Timer}
            value={jamBuka}
            onChange={(val) => handleFieldChange('jamBuka', val, setJamBuka)}
            error={errors.jamBuka}
          />
          <TextField
            label="Jam Tutup *"
            type="time"
            icon={Timer}
            value={jamTutup}
            onChange={(val) => handleFieldChange('jamTutup', val, setJamTutup)}
            error={errors.jamTutup}
          />
        </FieldRow>

        {/* Foto lokasi */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">
            Foto lokasi / tempat penyimpanan alat *
          </div>
          <div className="w-full flex flex-row gap-2.5">
            <UploadBox
              icon={CircleCheck}
              title="Tampak Depan"
              subtitle={
                frontPhoto ? `${frontPhoto.name} · ${formatFileSize(frontPhoto.size)}` : 'Klik untuk unggah'
              }
              uploaded={Boolean(frontPhoto)}
              onFileSelect={(file) => handleFile('frontPhoto', setFrontPhoto, file)}
            />
            <UploadBox
              icon={CircleCheck}
              title="Area Penyimpanan"
              subtitle={
                storagePhoto
                  ? `${storagePhoto.name} · ${formatFileSize(storagePhoto.size)}`
                  : 'Klik untuk unggah'
              }
              uploaded={Boolean(storagePhoto)}
              onFileSelect={(file) => handleFile('storagePhoto', setStoragePhoto, file)}
            />
            <UploadBox
              icon={ImagePlus}
              title="Rak / Etalase"
              subtitle={rackPhoto ? rackPhoto.name : 'Opsional'}
              uploaded={Boolean(rackPhoto)}
              onFileSelect={(file) => handleFile('rackPhoto', setRackPhoto, file)}
            />
          </div>
        </div>

        {/* Fasilitas lokasi */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="text-[12px] font-semibold text-[#475569]">Fasilitas di lokasi</div>
          <div className="w-full flex flex-col gap-2">
            <CheckItem
              checked={fasilitasJaga}
              onToggle={() => {
                const nextVal = !fasilitasJaga
                setFasilitasJaga(nextVal)
                onChange?.('fasilitasJaga', nextVal)
              }}
            >
              Ada orang jaga saat jam operasional
            </CheckItem>
            <CheckItem
              checked={fasilitasParkir}
              onToggle={() => {
                const nextVal = !fasilitasParkir
                setFasilitasParkir(nextVal)
                onChange?.('fasilitasParkir', nextVal)
              }}
            >
              Parkir kendaraan pengangkut tersedia
            </CheckItem>
            <CheckItem
              checked={fasilitasDalamRuangan}
              onToggle={() => {
                const nextVal = !fasilitasDalamRuangan
                setFasilitasDalamRuangan(nextVal)
                onChange?.('fasilitasDalamRuangan', nextVal)
              }}
            >
              Alat disimpan di dalam ruangan (tidak terkena hujan)
            </CheckItem>
          </div>
        </div>
      </div>
    </RegisterFormCard>
  )
}
