import { Check, ChevronDown } from 'lucide-react'

/** Label kecil di atas tiap field */
export function FieldLabel({ children }) {
  return <div className="text-[12px] font-semibold text-[#475569]">{children}</div>
}

/** Baris berisi beberapa field berdampingan (menumpuk di layar kecil) */
export function FieldRow({ children }) {
  return <div className="w-full flex flex-col sm:flex-row gap-3">{children}</div>
}

/** Input teks dengan ikon leading opsional dan elemen trailing opsional */
export function TextField({ label, icon: Icon, value, onChange, placeholder, type = 'text', trailing, error }) {
  return (
    <div className="w-full min-w-0 flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <div className={`w-full h-[44px] flex flex-row items-center gap-2.5 px-3 bg-white border ${
        error ? 'border-red-400 focus-within:ring-red-200' : 'border-[#E2E8F0] focus-within:border-[#2563EB] focus-within:ring-[#2563EB]/15'
      } rounded-[10px] transition-all focus-within:ring-2`}>
        {Icon && <Icon className={`w-4 h-4 ${error ? 'text-red-400' : 'text-[#94A3B8]'} shrink-0`} strokeWidth={2} />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-transparent text-[13px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none"
        />
        {trailing}
      </div>
      {error && <span className="text-[10px] text-red-500">{error}</span>}
    </div>
  )
}

/** Textarea untuk alamat / catatan panjang */
export function TextAreaField({ label, value, onChange, placeholder, rows = 2, error }) {
  return (
    <div className="w-full min-w-0 flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full min-h-[58px] py-[9px] px-[11px] bg-white border ${
          error ? 'border-red-400 focus:ring-red-200' : 'border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/15'
        } rounded-[10px] text-[12px] leading-[19px] text-[#0F172A] placeholder-[#94A3B8] resize-none focus:outline-none focus:ring-2 transition-all`}
      />
      {error && <span className="text-[10px] text-red-500">{error}</span>}
    </div>
  )
}


/** Dropdown dengan gaya yang sama seperti input teks */
export function SelectField({ label, value, onChange, options }) {
  return (
    <div className="w-full min-w-0 flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-[44px] appearance-none px-3 pr-9 bg-white border border-[#E2E8F0] rounded-[10px] text-[13px] text-[#0F172A] cursor-pointer focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  )
}

/** Grup pilihan berbentuk pil (single select) */
export function PillGroup({ options, value, onChange }) {
  return (
    <div className="w-full flex flex-row gap-2">
      {options.map((option) => {
        const isActive = option === value
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange?.(option)}
            className={`flex-1 py-2.5 flex flex-row justify-center rounded-[9px] text-[12px] whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-[#EFF6FF] border border-[#2563EB] text-[#1D4ED8] font-bold'
                : 'bg-white border border-[#E2E8F0] text-[#475569] font-medium hover:border-slate-300'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Kotak unggah berkas (foto KTP, Lokasi, buku tabungan, dsb).
 *
 * Bila `onFileSelect` diberikan, kotak berubah menjadi label berisi input file
 * sehingga pengguna bebas memilih file gambar apa pun dari komputer.
 */
export function UploadBox({
  icon: Icon,
  title,
  subtitle,
  uploaded = false,
  onClick,
  onFileSelect,
  accept = 'image/*'
}) {
  const classes = `flex-1 min-w-0 h-[100px] flex flex-col items-center justify-center gap-1 rounded-[10px] transition-all cursor-pointer ${
    uploaded
      ? 'bg-[#EFF6FF] border border-[#93C5FD]'
      : 'bg-[#F8FAFC] border border-[#E2E8F0] hover:border-slate-300'
  }`

  const content = (
    <>
      <Icon
        className={`w-4 h-4 shrink-0 ${uploaded ? 'text-[#15803D]' : 'text-[#94A3B8]'}`}
        strokeWidth={2}
      />
      <span className="text-[10px] font-semibold text-[#0F172A] whitespace-nowrap">{title}</span>
      <span className="text-[9px] text-[#94A3B8] whitespace-nowrap">{subtitle}</span>
    </>
  )

  if (onFileSelect) {
    return (
      <label className={classes}>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onFileSelect(file)
            event.target.value = ''
          }}
        />
        {content}
      </label>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  )
}

/** Baris checkbox centang biru; non-interaktif jika onToggle tidak diberikan */
export function CheckItem({ checked = false, onToggle, children }) {
  const content = (
    <>
      <span
        className={`w-4 h-4 shrink-0 rounded-[4px] flex items-center justify-center transition-colors ${
          checked ? 'bg-[#2563EB]' : 'border border-[#CBD5E1] bg-white'
        }`}
      >
        {checked && <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />}
      </span>
      <span className="flex-1 text-left text-[11px] leading-[17px] text-[#475569]">{children}</span>
    </>
  )

  if (!onToggle) {
    return <div className="w-full flex flex-row gap-2 items-start">{content}</div>
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex flex-row gap-2 items-start text-left cursor-pointer"
    >
      {content}
    </button>
  )
}
