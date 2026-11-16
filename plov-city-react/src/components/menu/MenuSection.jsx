import { useState, useMemo, useEffect } from 'react'
import { Search, UtensilsCrossed } from 'lucide-react'
import { categories, menuItems } from '@data/menuData'
import FoodCard from './FoodCard'
import FoodModal from './FoodModal'
import { useLang } from '@context/LanguageContext'
import { getMenu } from '@services/adminApi'

export default function MenuSection() {
  const { t, lang } = useLang()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('plov_city_menu_v2')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return menuItems
  })

  useEffect(() => {
    let active = true
    const loadMenu = () => getMenu().then((result) => { if (active && result.length) setItems(result) }).catch(() => {})
    loadMenu()
    window.addEventListener('plov-menu-updated', loadMenu)
    return () => { active = false; window.removeEventListener('plov-menu-updated', loadMenu) }
  }, [])

  // Filtrlangan taomlar
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (item.available === false) return false
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory
      
      const name = item.name?.[lang] || item.nameUz || ''
      const desc = item.description?.[lang] || item.descUz || ''
      
      const q = searchQuery.toLowerCase().trim()
      if (!q) return matchesCategory

      const matchesSearch = name.toLowerCase().includes(q) || desc.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [items, activeCategory, searchQuery, lang])

  return (
    <section id="menu-section" className="pc-section pt-8">
      <div className="pc-container mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="pc-section-label">Bizning menyu</div>
            <h2 className="pc-section-title">
              {t('menu.title')}
            </h2>
            <p className="pc-section-subtitle">
              {t('menu.subtitle')}
            </p>
          </div>

          {/* Qidiruv inputi */}
          <div className="w-full md:w-72 relative">
            <Search 
              size={18} 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('menu.searchPlaceholder')}
              className="pc-input pl-10 pr-4 py-2.5 text-sm rounded-2xl bg-surface border-surface-border focus:border-brand focus:ring-2 focus:ring-brand-light"
            />
          </div>
        </div>
      </div>

      {/* Yopishib turuvchi (Sticky) gorizontal kategoriya paneli */}
      <div className="sticky top-[72px] z-30 bg-bg/95 backdrop-blur-md border-y border-surface-border/80 py-3 mb-8 shadow-warm-xs">
        <div className="pc-container">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id
              const catTitle = t(`categories.${cat.id}`) || cat.nameUz
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-brand text-white shadow-brand-sm'
                      : 'bg-surface text-muted hover:text-ink hover:bg-surface-hover border border-surface-border'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{catTitle}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Taomlar ro'yxati (Desktop: 4 ustun, Mobil: 2 ustun) */}
      <div className="pc-container">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredItems.map((item) => (
              <FoodCard 
                key={item.id} 
                item={item} 
                onSelect={(selected) => setSelectedItem(selected)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface rounded-3xl border border-surface-border p-8">
            <UtensilsCrossed size={48} className="mx-auto text-muted/50 mb-3" />
            <h3 className="text-lg font-bold text-ink mb-1">
              {t('menu.empty')}
            </h3>
            <p className="text-sm text-muted">
              {t('menu.emptyHint')}
            </p>
          </div>
        )}
      </div>

      {/* Food Details Modal */}
      <FoodModal 
        key={selectedItem?.id ?? 'closed'}
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  )
}
