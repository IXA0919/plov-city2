import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, Flame } from 'lucide-react'
import { useCart } from '@context/CartContext'
import { useLanguage } from '@context/LanguageContext'
import { formatPrice, scrollToId } from '@utils'

export default function Navbar() {
  const { totalItems, subtotal, openCart, total } = useCart()
  const { t, lang, setLang, languages } = useLanguage()

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('menu-section')

  // Navigatsiya havolalari ro'yxati
  const navLinks = [
    { id: 'promo-section',    label: t('nav.promo') },
    { id: 'menu-section',     label: t('nav.menu') },
    { id: 'about-section',    label: t('nav.about') },
    { id: 'branches-section', label: t('nav.branches') },
  ]

  // Scroll hodisasi — soyani kuchaytirish va faol bo'limni aniqlash
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)

      // Faol bo'limni aniqlash
      const scrollPos = window.scrollY + 120
      for (const link of navLinks) {
        const el = document.getElementById(link.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(link.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [navLinks])

  // Havolaga bosganda silliq o'tish
  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
    scrollToId(sectionId, 76)
  }

  return (
    <>
      {/* ─── 1. ASOSIY STICKY NAVBAR ─── */}
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-md bg-[#FAF7F2]/90 border-b border-[#EDE6DC] transition-shadow duration-300 ${
          scrolled ? 'shadow-warm-sm' : ''
        }`}
      >
        <div className="pc-container">
          <div className="flex items-center justify-between h-[72px] gap-4">

            {/* ─── 2. CHAP TOMON: BRAND LOGOTIPI & MAXSUS SVG QOZON/OLOV ─── */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="flex items-center gap-2.5 flex-shrink-0 group cursor-pointer"
            >
              <img
                src="/logo.jpg"
                alt="Plov City"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#E69D24] shadow-sm group-hover:scale-105 transition-transform"
              />

              <div className="leading-tight">
                <div className="text-xl font-display font-extrabold tracking-tight text-[#1F1A17] flex items-center gap-1">
                  <span>PLOV</span>
                  <span className="text-[#D94E1F]">CITY</span>
                </div>
                <div className="text-[10px] text-[#E69D24] font-extrabold tracking-wider uppercase -mt-0.5">
                  Taste The Heritage
                </div>
              </div>
            </a>

            {/* ─── 3. MARKAZDA: NAVIGATSIYA HAVOLALARI & AKTIV OLOVRANG CHIZIQ ─── */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer ${
                      isActive
                        ? 'text-[#D94E1F]'
                        : 'text-[#1F1A17] hover:text-[#D94E1F] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{link.label}</span>

                    {/* Aktiv bo'lim ostida olovrang chiziqcha */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#D94E1F] rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* ─── 4. O'NG TOMON: TIL PILL-SWITCHER & SAVATCHA TUGMASI ─── */}
            <div className="flex items-center gap-2.5 sm:gap-3">

              {/* Chiroyli pill-ko'rinishidagi til almashtirgich (UZ | RU | EN) */}
              <div className="hidden sm:flex items-center p-1 bg-[#FAF7F2] border border-[#EDE6DC] rounded-full shadow-warm-xs">
                {languages.map((l) => {
                  const isSelected = lang === l.code
                  return (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`relative px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'text-white'
                          : 'text-[#6B5E55] hover:text-[#1F1A17]'
                      }`}
                    >
                      {/* Faol til orqasidagi olovrang pill foni */}
                      {isSelected && (
                        <motion.div
                          layoutId="lang-pill"
                          className="absolute inset-0 bg-[#D94E1F] rounded-full shadow-warm-xs"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{l.short}</span>
                    </button>
                  )
                })}
              </div>

              {/* Olovrang (#D94E1F) Savatcha tugmasi (Icon + Badge + Summa) */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-[#D94E1F] hover:bg-[#B83D14] text-white shadow-brand-sm hover:shadow-brand-md active:scale-95 transition-all duration-150 cursor-pointer select-none"
                aria-label="Savatchani ochish"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingCart size={19} strokeWidth={2.2} />

                  {/* Mahsulotlar soni nishoni (Badge) */}
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-[#E69D24] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-warm-xs"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </div>

                {/* Joriy summa */}
                <div className="hidden xs:flex flex-col text-left leading-none pl-0.5">
                  <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider">
                    {t('cart.title')}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-white">
                    {subtotal > 0 ? `${formatPrice(subtotal)} ${t('units.currency')}` : `0 ${t('units.currency')}`}
                  </span>
                </div>
              </button>

              {/* Mobil menyu tugmasi (Hamburger) */}
              <button
                onClick={() => setMobileMenuOpen(v => !v)}
                className="md:hidden p-2 rounded-xl text-[#1F1A17] hover:bg-[#EDE6DC]/60 transition-colors cursor-pointer"
                aria-label="Mobil menyu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </div>

        {/* ─── 5. MOBIL HAMBURGER MENYU DRAWER ─── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="md:hidden overflow-hidden bg-[#FAF7F2] border-t border-[#EDE6DC] shadow-warm-lg"
            >
              <div className="pc-container py-4 flex flex-col gap-1.5">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-[#D94E1F]/10 text-[#D94E1F]'
                          : 'text-[#1F1A17] hover:bg-[#EDE6DC]/50'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-[#D94E1F]" />}
                    </button>
                  )
                })}

                {/* Mobilda til tanlash qatori */}
                <div className="pt-3 mt-2 border-t border-[#EDE6DC] flex items-center justify-between px-2">
                  <span className="text-xs font-semibold text-[#6B5E55]">
                    Tilni tanlang:
                  </span>
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-[#EDE6DC]">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                          lang === l.code
                            ? 'bg-[#D94E1F] text-white'
                            : 'text-[#6B5E55]'
                        }`}
                      >
                        {l.flag} {l.short}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── 5. MOBIL EKRANLAR UCHUN SUZIB YURUVCHI (FLOATING) SAVATCHA TUGMASI ─── */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="md:hidden fixed bottom-6 left-4 right-4 z-40 flex justify-center pointer-events-none"
          >
            <button
              onClick={openCart}
              className="pointer-events-auto w-full max-w-sm flex items-center justify-between p-3.5 px-5 bg-gradient-to-r from-[#D94E1F] to-[#B83D14] text-white rounded-2xl shadow-warm-xl border border-white/20 active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <ShoppingCart size={20} />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#E69D24] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-warm-xs">
                    {totalItems}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-xs font-medium text-white/85">
                    {t('cart.title')}
                  </div>
                  <div className="text-sm font-extrabold">
                    {formatPrice(subtotal)} {t('units.currency')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold bg-white text-[#D94E1F] px-3.5 py-2 rounded-xl shadow-warm-xs">
                <span>{t('cart.orderBtn')}</span>
                <span className="text-sm">→</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
