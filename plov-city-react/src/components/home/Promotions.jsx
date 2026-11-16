import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingBag, CheckCircle2, Sparkles, Tag, Users, Flame } from 'lucide-react'
import { useCart } from '@context/CartContext'
import { useLanguage } from '@context/LanguageContext'
import { formatPrice } from '@utils'

export default function Promotions() {
  const { addItem } = useCart()
  const { lang, t } = useLanguage()

  // Slayder konteyneri uchun ref
  const sliderRef = useRef(null)

  // Pastki bildirishnoma (Toast notification) holati
  const [toastMessage, setToastMessage] = useState(null)

  // Chapga/o'ngga silliq surish
  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 380
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  // Aksiya setlari (Besh Qozon uslubidagi boy kombo to'plamlar)
  const promoSets = [
    {
      id: 'promo-family-royal',
      badge: '-20% TEJAMKORLIK',
      badgeColor: 'bg-emerald-700 text-white',
      name: {
        uz: 'Oilaviy Bazm Seti (4-5 kishilik)',
        ru: 'Сет «Семейный Праздник» (на 4-5 персон)',
        en: 'Royal Family Feast Set (4-5 persons)',
      },
      tagline: {
        uz: 'Katta oila va aziz mehmonlar uchun eng sarxil to‘plam',
        ru: 'Богатый праздничный набор для семьи и дорогих гостей',
        en: 'Lavish festive combo platter for family and esteemed guests',
      },
      image: 'https://aboutthepoint.com/media/cache/og_prefer_1200/original-images/2025/47/yuwgBFojwiGUTRl63lU8PEdfu.jpeg',
      itemsList: {
        uz: [
          '1 kg Katta Lagan To‘y Oshi (go‘shti bilan)',
          '4 bo‘lak ot go‘shtli shohona Qazi',
          '2 ta yangi Achichuk pomidor salati',
          '2 ta tandirdan uzilgan issiq Patir non',
          '1L salqin Coca-Cola yoki Uy ayroni',
        ],
        ru: [
          '1 кг Праздничного плова на большом лягане',
          '4 кусочка деликатесного конского казы',
          '2 порции свежего салата Ачик-чучук',
          '2 горячие тандырные лепёшки патир',
          '1л охлаждённой Coca-Cola или домашнего айрана',
        ],
        en: [
          '1 kg Platter of Celebration Wedding Plov',
          '4 slices of prime horsemeat Kazy delicacy',
          '2 portions of crisp Achichuk tomato salad',
          '2 hot traditional tandoor Patyr flatbreads',
          '1L chilled Coca-Cola or homemade Ayran',
        ],
      },
      oldPrice: 248000,
      price: 198000,
      saving: 50000,
      calories: '3,200 kcal',
      prepTime: '20-25 min',
      accentGradient: 'from-[#D94E1F] via-[#E85820] to-[#E69D24]',
    },
    {
      id: 'promo-friends-combo',
      badge: 'CHOY & NON BEPUL',
      badgeColor: 'bg-[#D94E1F] text-white',
      name: {
        uz: 'Do‘stlar Tushligi (4 kishilik)',
        ru: 'Обед Друзей (на 4 персоны)',
        en: 'Friends Lunch Combo (4 persons)',
      },
      tagline: {
        uz: 'Do‘stlar davrasi va hamkasblar uchun qulay tushlik',
        ru: 'Идеальный горячий обед для компании друзей и коллег',
        en: 'Perfect wholesome lunch combo for friends and colleagues',
      },
      image: 'https://weproject.media/upload/iblock/7f0/ixj6lrm5s4tp07e9w9y8ao6y09c5jszs.jpg',
      itemsList: {
        uz: [
          '4 porsiya To‘y oshi (har biri 350g)',
          '1 choynak 95-ko‘k choy (limon va novvot bilan)',
          '2 ta yangi tandir noni (BEPUL sovga)',
          '2 ta qatiqli Suzma ko‘katlar bilan',
        ],
        ru: [
          '4 порции Свадебного плова (по 350г)',
          '1 чайник зелёного чая №95 с лимоном и навватом',
          '2 горячие тандырные лепёшки (в подарок)',
          '2 порции домашней сузьмы с зеленью',
        ],
        en: [
          '4 portions of Wedding Plov (350g each)',
          '1 teapot of #95 Green Tea with lemon & crystal sugar',
          '2 hot tandoor flatbreads (FREE gift)',
          '2 portions of strained yogurt Suzma with fresh herbs',
        ],
      },
      oldPrice: 196000,
      price: 168000,
      saving: 28000,
      calories: '3,400 kcal',
      prepTime: '15-20 min',
      accentGradient: 'from-[#E69D24] via-[#F4A623] to-[#D94E1F]',
    },
    {
      id: 'promo-office-express',
      badge: 'YETKAZISH BEPUL',
      badgeColor: 'bg-emerald-700 text-white',
      name: {
        uz: 'Ofis Tushlik Komplimenti (3 kishi+)',
        ru: 'Офисный Экспресс (3+ порции)',
        en: 'Office Express Combo (3+ persons)',
      },
      tagline: {
        uz: 'Ishxonaga tezkor, issiq va mutlaqo bepul yetkazib berish',
        ru: 'Быстрая и абсолютно бесплатная доставка горячего обеда в офис',
        en: 'Piping hot corporate lunch with 100% free doorstep delivery',
      },
      image: 'https://www.caj.uz/uploads/cities/OyDzE.webp',
      itemsList: {
        uz: [
          '3 porsiya Choyxona yoki To‘y oshi (tanlov asosida)',
          '3 ta Achichuk salati',
          'Toshkent bo‘ylab tezkor yetkazib berish (BEPUL)',
          'To‘plamda qoshiq, salfetka va termos qadoq',
        ],
        ru: [
          '3 порции Чайханского или Свадебного плова на выбор',
          '3 порции салата Ачик-чучук',
          'Экспресс-доставка по Ташкенту (БЕСПЛАТНО)',
          'Приборы, салфетки и герметичная термоупаковка',
        ],
        en: [
          '3 portions of Choykhona or Wedding Plov of your choice',
          '3 portions of Achichuk tomato salad',
          'Express delivery across Tashkent (FREE)',
          'Utensils, napkins, and thermal sealed packaging included',
        ],
      },
      oldPrice: 156000,
      price: 126000,
      saving: 30000,
      calories: '2,600 kcal',
      prepTime: '25 min',
      accentGradient: 'from-emerald-700 via-teal-700 to-emerald-900',
    },
    {
      id: 'promo-samarkand-feast',
      badge: '-15% CHEGIRMA',
      badgeColor: 'bg-[#D94E1F] text-white',
      name: {
        uz: 'Samarqand Ziq‘ir Oshi Dasturxoni',
        ru: 'Дастархан Самаркандского Зигир-Оша',
        en: 'Samarkand Flaxseed Oil Platter',
      },
      tagline: {
        uz: 'Haqiqiy zig‘ir yog‘i ifori va lazzati muxlislari uchun',
        ru: 'Для истинных ценителей целебного льняного масла зигир',
        en: 'For true connoisseurs of pure Samarkand flaxseed oil cuisine',
      },
      image: 'https://aviator.indus.travel/qstvsndfvb/uploads/2025/11/pexels-oleksandra-17274222-1024x683.jpg',
      itemsList: {
        uz: [
          '1 kg Samarqandcha qatlamli Ziq‘ir oshi',
          '4 ta qaynatilgan bedana tuxumi',
          '2 ta Chiroqchi go‘shtli salati',
          '1L muzdek tabiiy Olcha sharbati',
        ],
        ru: [
          '1 кг слоёного самаркандского зигир-оша',
          '4 отварных перепелиных яйца',
          '2 порции тёплого мясного салата Чирокчи',
          '1л прохладного натурального вишнёвого компота',
        ],
        en: [
          '1 kg layered Samarkand Flaxseed Ziqir Plov',
          '4 tender boiled quail eggs',
          '2 portions of Chirokchi warm beef salad',
          '1L natural chilled sour cherry compote',
        ],
      },
      oldPrice: 220000,
      price: 187000,
      saving: 33000,
      calories: '3,100 kcal',
      prepTime: '20 min',
      accentGradient: 'from-[#D94E1F] via-[#A8680E] to-[#E69D24]',
    },
  ]

  // Savatchaga qo'shish va bildirishnomani ko'rsatish
  const handleAddToCart = (set) => {
    const setName = set.name[lang] || set.name.uz

    addItem({
      id: set.id,
      nameUz: setName,
      name: set.name,
      price: set.price,
      weight: 'Kombo Set',
      image: set.image,
      emoji: '🎁',
    })

    // Toast xabarini chiqarish
    const successText = lang === 'ru'
      ? `«${setName}» добавлен в корзину! 🎉`
      : lang === 'en'
      ? `"${setName}" added to your cart! 🎉`
      : `«${setName}» savatchaga qo‘shildi! 🎉`

    setToastMessage(successText)

    // 3.2 soniyadan so'ng avtomatik yopish
    setTimeout(() => {
      setToastMessage(null)
    }, 3200)
  }

  const sectionTitles = {
    uz: {
      label: 'Chegirmalar & To‘plamlar',
      title: 'Maxsus Aksiyalar va Kombo Setlar',
      subtitle: 'Besh Qozon an‘anasidagi to‘kin dasturxonlar — do‘stlar, oila va hamkasblar uchun katta tejamkorlik bilan!',
      addBtn: 'Setni savatchaga qo‘shish',
      savingText: 'Tejovingiz:',
    },
    ru: {
      label: 'Скидки и наборы',
      title: 'Специальные Акции и Комбо Сеты',
      subtitle: 'Щедрые дастарханы в традициях Беш Козон с ощутимой выгодой для семейных и корпоративных застолий!',
      addBtn: 'Добавить сет в корзину',
      savingText: 'Экономия:',
    },
    en: {
      label: 'Discounts & Combos',
      title: 'Exclusive Deals & Combo Feasts',
      subtitle: 'Lavish traditional feasts in Besh Qozon style with big savings for families, friends, and teams!',
      addBtn: 'Add Combo to Cart',
      savingText: 'You Save:',
    },
  }

  const content = sectionTitles[lang] || sectionTitles.uz

  return (
    <section id="promo-section" className="pc-section relative bg-[#F5EFE6]/60 border-y border-[#EDE6DC]">
      <div className="pc-container">

        {/* ─── 1. BO'LIM SARLAVHASI VA SURISH TUGMALARI ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="pc-section-label">
              <Sparkles size={14} className="text-[#D94E1F]" />
              <span>{content.label}</span>
            </div>
            <h2 className="pc-section-title text-2xl sm:text-3xl lg:text-4xl">
              {content.title}
            </h2>
            <p className="pc-section-subtitle max-w-xl">
              {content.subtitle}
            </p>
          </div>

          {/* Slayderni chap/o'ngga surish tugmalari */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll('left')}
              className="w-11 h-11 rounded-full bg-white border border-[#EDE6DC] text-[#1F1A17] hover:bg-[#D94E1F] hover:text-white hover:border-[#D94E1F] shadow-warm-xs flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label="Oldingi aksiya"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-11 h-11 rounded-full bg-white border border-[#EDE6DC] text-[#1F1A17] hover:bg-[#D94E1F] hover:text-white hover:border-[#D94E1F] shadow-warm-xs flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label="Keyingi aksiya"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ─── 2. AKSIYA KARTOCHKALARI SLAYDERI ─── */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pt-1"
        >
          {promoSets.map((set) => {
            const setName = set.name[lang] || set.name.uz
            const setTagline = set.tagline[lang] || set.tagline.uz
            const items = set.itemsList[lang] || set.itemsList.uz

            return (
              <div
                key={set.id}
                className="snap-start flex-shrink-0 w-[310px] sm:w-[360px] md:w-[390px] rounded-3xl bg-white border border-[#EDE6DC] overflow-hidden shadow-warm hover:shadow-warm-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Rasm va Chegirma foizi nishoni */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={set.image}
                    alt={setName}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Qoraytirish gradienti */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                  {/* Chegirma foizi nishoni (Zumrad yashil yoki olovrang) */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-warm-sm ${set.badgeColor}`}>
                      <Tag size={12} />
                      <span>{set.badge}</span>
                    </span>
                  </div>

                  {/* Kaloriya va tayyorlanish vaqti */}
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-semibold text-white">
                    ⏱ {set.prepTime}
                  </div>

                  {/* Rasm ustidagi sarlavha */}
                  <div className="absolute bottom-3 left-4 right-4 z-10 text-white">
                    <h3 className="text-lg sm:text-xl font-bold leading-snug drop-shadow-sm">
                      {setName}
                    </h3>
                  </div>
                </div>

                {/* Kartochka tanasi: Set tarkibining aniq ro'yxati */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs text-[#6B5E55] mb-3 leading-relaxed">
                      {setTagline}
                    </p>

                    {/* Tarkib punktlari */}
                    <div className="space-y-2 bg-[#FAF7F2] p-3 rounded-2xl border border-[#EDE6DC]/70">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#1F1A17] flex items-center gap-1.5 mb-1.5">
                        <Flame size={13} className="text-[#D94E1F]" />
                        <span>To‘plam tarkibi:</span>
                      </div>
                      {items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#1F1A17]">
                          <CheckCircle2 size={14} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                          <span className="leading-tight font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Narxlar va Tugma */}
                  <div className="pt-2">
                    {/* Narxlar: Eski narx (ustidan chizilgan) va yangi aksiya narxi */}
                    <div className="flex items-baseline justify-between mb-3.5">
                      <div>
                        <div className="text-xs text-[#6B5E55] line-through font-semibold">
                          {formatPrice(set.oldPrice)} {t('units.currency')}
                        </div>
                        <div className="text-2xl font-black text-[#E69D24] leading-none tracking-tight">
                          {formatPrice(set.price)}{' '}
                          <span className="text-xs font-bold text-[#6B5E55]">{t('units.currency')}</span>
                        </div>
                      </div>

                      {/* Tejamkorlik summasi */}
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                          {content.savingText} -{formatPrice(set.saving)}
                        </span>
                      </div>
                    </div>

                    {/* ─── 3. SETNI SAVATCHAGA QO'SHISH TUGMASI ─── */}
                    <button
                      onClick={() => handleAddToCart(set)}
                      className="w-full btn-primary btn-md gap-2.5 justify-center shadow-brand-sm group/btn active:scale-95 cursor-pointer font-bold text-sm"
                    >
                      <ShoppingBag size={18} className="group-hover/btn:scale-110 transition-transform" />
                      <span>{content.addBtn}</span>
                    </button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

      </div>

      {/* ─── 3. TOAST NOTIFICATION (PASTKI BURCHAKDA BILDIRISHNOMA) ─── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm bg-[#1F1A17] text-white p-4 px-5 rounded-2xl shadow-warm-2xl border border-white/10 flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-warm-xs">
              <CheckCircle2 size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-0.5">
                Muvaffaqiyatli!
              </div>
              <div className="text-sm font-semibold text-white truncate">
                {toastMessage}
              </div>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
