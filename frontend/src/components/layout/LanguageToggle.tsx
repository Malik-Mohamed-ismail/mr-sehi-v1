import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(nextLang)
  }

  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={toggleLanguage}
      aria-label="تغيير اللغة"
      title={i18n.language === 'ar' ? 'English' : 'عربي'}
      style={{ width: 36, height: 36, padding: 0, justifyContent: 'center' }}
    >
      <Globe size={16} />
      <span style={{ fontSize: 11, fontWeight: 700, marginTop: 1, marginLeft: 2, marginRight: 2 }}>
        {i18n.language === 'ar' ? 'EN' : 'AR'}
      </span>
    </button>
  )
}
