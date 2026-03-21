import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SearchInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  const { t, i18n } = useTranslation()
  return (
    <div style={{ position: 'relative', minWidth: 200 }}>
      <Search
        size={15}
        style={{
          position: 'absolute',
          top: '50%', transform: 'translateY(-50%)',
          [i18n.dir() === 'rtl' ? 'right' : 'left']: 12,
          color: 'var(--text-secondary)', pointerEvents: 'none',
        }}
      />
      <input
        className="form-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? t('common.search')}
        style={{
          height: 38,
          [i18n.dir() === 'rtl' ? 'paddingRight' : 'paddingLeft']: 36,
          fontSize: 13,
        }}
      />
    </div>
  )
}
