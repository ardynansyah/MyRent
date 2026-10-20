import { Check, ChevronDown } from 'lucide-react'

/** Label kecil di atas tiap field */
export function FieldLabel({ children }) {
  return <div className="text-xs font-semibold text-slate-600">{children}</div>
}

/** Baris berisi beberapa field berdampingan (menumpuk di layar kecil) */
export function FieldRow({ children }) {
  return <div className="w-full flex flex-col sm:flex-row gap-3">{children}</div>
}

/** Input teks dengan ikon leading opsional dan elemen trailing opsional */
export function TextField({ label, icon: Icon, value, onChange, placeholder, type = 'text', trailing, error, inputClassName = '' }) {
  return (
    <div className="w-full min-w-0 flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <div className={`w-full h-11 flex flex-row items-center gap-2.5 px-3 bg-white border ${
        error ? 'border-red-400 focus-within:ring-red-200' : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-blue-600/15'
      } rounded-[10px] transition-all focus-within:ring-2`}>
        {Icon && <Icon className={`w-4 h-4 ${error ? 'text-red-400' : 'text-slate-400'} shrink-0`} strokeWidth={2} />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 min-w-0 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none ${inputClassName}`}
        />
        {trailing}
      </div>
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
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
          error ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/15'
        } rounded-[10px] text-[13px] leading-5 text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 transition-all`}
      />
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
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
          className="w-full h-11 appearance-none px-3 pr-9 bg-white border border-slate-200 rounded-[10px] text-[13px] text-slate-900 cursor-pointer focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
            className={`flex-1 py-2.5 flex flex-row justify-center rounded-[9px] text-xs whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-blue-50 border border-blue-600 text-blue-700 font-bold'
                : 'bg-white border border-slate-200 text-slate-600 font-medium hover:border-slate-300'
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
      ? 'bg-blue-50 border border-blue-300'
      : 'bg-slate-50 border border-slate-200 hover:border-slate-300'
  }`

  const content = (
    <>
      <Icon
        className={`w-4 h-4 shrink-0 ${uploaded ? 'text-green-700' : 'text-slate-400'}`}
        strokeWidth={2}
      />
      <span className="text-xs font-semibold text-slate-900 whitespace-nowrap">{title}</span>
      <span className="text-[11px] text-slate-500 whitespace-nowrap">{subtitle}</span>
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
        className={`w-4 h-4 shrink-0 rounded flex items-center justify-center transition-colors ${
          checked ? 'bg-blue-600' : 'border border-slate-300 bg-white'
        }`}
      >
        {checked && <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />}
      </span>
      <span className="flex-1 text-left text-xs leading-[18px] text-slate-600">{children}</span>
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
