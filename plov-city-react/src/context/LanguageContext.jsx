import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations } from '@locales/translations'

/* ─── Qo'llab-quvvatlanadigan tillar ─── */
export const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha", short: 'UZ', flag: '🇺🇿' },
  { code: 'ru', label: 'Русский',   short: 'RU', flag: '🇷🇺' },
  { code: 'en', label: 'English',   short: 'EN', flag: '🇬🇧' },
]

const STORAGE_KEY = 'plov_city_lang'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  // 1. Dastlabki tilni localStorage yoki brauzer tilidan olish
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && LANGUAGES.some(l => l.code === saved)) {
        return saved
      }
      // Agar saqlanmagan bo'lsa brauzer tili tekshiriladi
      const navLang = navigator.language?.slice(0, 2)?.toLowerCase()
      if (navLang === 'ru') return 'ru'
      if (navLang === 'en') return 'en'
    } catch {
      // localStorage cheklovi bo'lsa fallback
    }
    return 'uz' // standart til
  })

  // Til o'zgarganda html tegining lang atributini va localStorage ni yangilash
  const setLang = useCallback((newLang) => {
    if (!LANGUAGES.some(l => l.code === newLang)) return
    setLangState(newLang)
    try {
      localStorage.setItem(STORAGE_KEY, newLang)
    } catch (e) {
      console.warn('localStorage ga yozishda xatolik:', e)
    }
    document.documentElement.lang = newLang
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  /**
   * Tarjima funksiyasi: t('nav.menu') yoki t('checkout.minOrderError', { min: '30 000' })
   */
  const t = useCallback((key, params = {}) => {
    if (!key) return ''
    const keys = key.split('.')

    // Tanlangan tildagi obyekt
    let result = translations[lang]
    for (const k of keys) {
      result = result?.[k]
      if (result === undefined) break
    }

    // Agar tanlangan tilda topilmasa, O'zbekcha fallback
    if (result === undefined) {
      result = translations['uz']
      for (const k of keys) {
        result = result?.[k]
        if (result === undefined) break
      }
    }

    // Hech qaysi tilda topilmasa keyning o'zi qaytadi
    if (result === undefined) return key

    // Agar parametrlar uzatilgan bo'lsa {name} o'rniga qiymat qo'yish
    if (typeof result === 'string' && Object.keys(params).length > 0) {
      return Object.entries(params).reduce((acc, [paramKey, paramVal]) => {
        return acc.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramVal))
      }, result)
    }

    return result
  }, [lang])

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  const value = {
    lang,
    setLang,
    changeLang: setLang, // orqaga moslik uchun
    t,
    currentLang,
    languages: LANGUAGES,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

/* ─── Custom Hooklar ─── */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage hooki faqat LanguageProvider ichida ishlatilishi kerak!')
  }
  return context
}

// Orqaga moslik uchun qisqa alias
export const useLang = useLanguage

export default LanguageContext
