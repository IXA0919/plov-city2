import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Clock, Award, Star, Flame, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@context/LanguageContext'
import { scrollToId } from '@utils'

export default function Hero() {
  const { t, lang } = useLanguage()

  // Sarlavha va matnlarning ko'p tilli variantlari
  const titles = {
    uz: {
      badge: 'Toshkentning №1 Osh Markazi • 100% Halol',
      headlineStart: 'Haqiqiy O‘zbek Oshi — ',
      headlineAccent: 'Issiqina Qozondan ',
      headlineEnd: 'Dasturxoningizga',
      desc: 'Cho‘yan qozonda, tog‘ zirasining ifori va sarxil yosh qo‘zi go‘shti bilan damlangan afsonaviy milliy osh. Buyurtma bering — 35 daqiqada eshigingizda qaynoq bo‘ladi!',
      btnMenu: 'Menyuni ko‘rish',
      btnPromo: 'Aksiyalar bilan tanishish',
      trust1: '35-45 daqiqada yetkazish',
      trust1Sub: 'issiq termo-qutilarda',
      trust2: 'Har kuni yangi so‘yilgan go‘sht',
      trust2Sub: '100% Halol sertifikatlangan',
      trust3: '4.9 ★ mijozlar bahosi',
      trust3Sub: '2,400+ haqiqiy sharhlar',
      liveBadgeStatus: 'Hozir qozonda qaynamoqda',
      liveBadgePlov: 'To‘y oshi tayyor!',
      liveBadgeTime: 'Dam yeyishiga 5 daqiqa qoldi',
    },
    ru: {
      badge: 'Центр плова №1 в Ташкенте • 100% Халяль',
      headlineStart: 'Настоящий Узбекский Плов — ',
      headlineAccent: 'Прямо из Казана ',
      headlineEnd: 'к Вашему Столу',
      desc: 'Легендарный плов, томленый на живом огне в чугунном казане со сладкой желтой морковью и отборной бараниной. Доставим обжигающе горячим за 35-45 минут!',
      btnMenu: 'Смотреть меню',
      btnPromo: 'Ознакомиться с акциями',
      trust1: 'Доставка за 35-45 минут',
      trust1Sub: 'в термоизолированных боксах',
      trust2: 'Ежедневно свежее парное мясо',
      trust2Sub: '100% Халяль стандарт',
      trust3: '4.9 ★ оценка гостей',
      trust3Sub: '2,400+ честных отзывов',
      liveBadgeStatus: 'Сейчас в казане',
      liveBadgePlov: 'Свадебный плов готов!',
      liveBadgeTime: 'Снят с огня 5 минут назад',
    },
    en: {
      badge: 'Tashkent’s #1 Plov Center • 100% Halal',
      headlineStart: 'Authentic Uzbek Plov — ',
      headlineAccent: 'From Sizzling Cauldron ',
      headlineEnd: 'Directly to Your Table',
      desc: 'Legendary wood-fired feast prepared in iron cauldrons with tender spring lamb, raisins, and mountain cumin. Delivered steaming hot within 35-45 minutes!',
      btnMenu: 'Explore Full Menu',
      btnPromo: 'View Special Deals',
      trust1: '35-45 min express delivery',
      trust1Sub: 'packed in thermal containers',
      trust2: 'Daily fresh-butchered meat',
      trust2Sub: '100% Halal certified',
      trust3: '4.9 ★ Customer Rating',
      trust3Sub: '2,400+ genuine reviews',
      liveBadgeStatus: 'Simmering right now',
      liveBadgePlov: 'Wedding Plov is Ready!',
      liveBadgeTime: 'Steamed to perfection',
    },
  }

  const content = titles[lang] || titles.uz

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2] to-[#F5EFE6]/50">
      
      {/* ─── Orqa fon nurlanish effektlari (Ambient Glows) ─── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#D94E1F]/10 via-[#E69D24]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 right-0 w-[450px] h-[450px] bg-[#E69D24]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="pc-container">
        {/* ─── 1. IKKI USTUNLI (SPLIT-SCREEN) KOMPOZITSIYA ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* ══════════════════════════════════════════════════
              CHAP USTUN: Sarlavha, Tavsif, Tugmalar & Trust
          ══════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Oltin rangli nishon */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E69D24]/12 border border-[#E69D24]/30 shadow-warm-xs">
              <Sparkles size={14} className="text-[#E69D24] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#97510E]">
                {content.badge}
              </span>
            </div>

            {/* Yirik va ta'sirchan sarlavha */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F1A17] tracking-tight leading-[1.12]">
              {content.headlineStart}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D94E1F] via-[#E85820] to-[#E69D24] font-heading font-black italic">
                {content.headlineAccent}
              </span>
              {content.headlineEnd}
            </h1>

            {/* Qisqa ishtaha ochuvchi tavsif */}
            <p className="text-base sm:text-lg text-[#6B5E55] leading-relaxed max-w-xl mx-auto lg:mx-0">
              {content.desc}
            </p>

            {/* Ikkita harakatga chorlovchi tugma */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => scrollToId('menu-section', 76)}
                className="btn-primary btn-xl w-full sm:w-auto shadow-brand-md gap-2.5 text-base group cursor-pointer"
              >
                <span>{content.btnMenu}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollToId('promo-section', 76)}
                className="btn-surface btn-xl w-full sm:w-auto border-[#EDE6DC] text-[#1F1A17] hover:border-[#D94E1F]/40 hover:text-[#D94E1F] gap-2 text-base cursor-pointer shadow-warm-xs"
              >
                <Flame size={17} className="text-[#D94E1F]" />
                <span>{content.btnPromo}</span>
              </button>
            </div>

            {/* 3 ta ishonch ko'rsatkichi (Trust indicators) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-[#EDE6DC] text-left">
              {/* 1. Tez yetkazish */}
              <div className="flex items-center sm:items-start gap-3 p-2.5 rounded-2xl bg-white/60 border border-[#EDE6DC]/70 shadow-warm-xs">
                <div className="w-9 h-9 rounded-xl bg-[#D94E1F]/10 text-[#D94E1F] flex items-center justify-center flex-shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1F1A17] leading-tight">
                    {content.trust1}
                  </div>
                  <div className="text-[11px] text-[#6B5E55] mt-0.5">
                    {content.trust1Sub}
                  </div>
                </div>
              </div>

              {/* 2. Yangi so'yilgan go'sht */}
              <div className="flex items-center sm:items-start gap-3 p-2.5 rounded-2xl bg-white/60 border border-[#EDE6DC]/70 shadow-warm-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#1B5E20] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1F1A17] leading-tight">
                    {content.trust2}
                  </div>
                  <div className="text-[11px] text-[#6B5E55] mt-0.5">
                    {content.trust2Sub}
                  </div>
                </div>
              </div>

              {/* 3. Reyting va baholar */}
              <div className="flex items-center sm:items-start gap-3 p-2.5 rounded-2xl bg-white/60 border border-[#EDE6DC]/70 shadow-warm-xs">
                <div className="w-9 h-9 rounded-xl bg-[#E69D24]/15 text-[#E69D24] flex items-center justify-center flex-shrink-0">
                  <Star size={18} className="fill-[#E69D24]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1F1A17] leading-tight flex items-center gap-1">
                    <span>4.9</span>
                    <span className="text-[#E69D24]">★★★★★</span>
                  </div>
                  <div className="text-[11px] text-[#6B5E55] mt-0.5">
                    {content.trust3Sub}
                  </div>
                </div>
              </div>
            </div>

          </motion.div>


          {/* ══════════════════════════════════════════════════
              O‘NG USTUN: Osh rasmi, Oltin-Olovrang Nurlanish &
              Suzib yuruvchi jonli kartochka (Live Badge)
          ══════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Yumshoq Oltin-Olovrang nurlanish foni (Glow Halo) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D94E1F]/25 via-[#E69D24]/30 to-amber-300/20 rounded-[40px] blur-2xl transform scale-105 pointer-events-none -z-10" />

            {/* Asosiy Rasm ramkasi */}
            <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-square rounded-[32px] overflow-hidden border-2 border-[#EDE6DC] bg-white shadow-warm-xl group">
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=85"
                alt="Plov City To'y Oshi"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Rasm ustidagi nozik tumanli gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

              {/* Chap yuqori nishon: 100% Halol */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-700/90 text-white text-xs font-bold backdrop-blur-md shadow-warm-sm">
                  <ShieldCheck size={13} />
                  <span>100% HALOL</span>
                </span>
              </div>

              {/* O'ng yuqori qism: Qaynoq bug' ramzi */}
              <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white text-lg">
                ♨️
              </div>

              {/* Rasm tagidagi qisqa nom */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white text-left">
                <div className="text-xs uppercase tracking-wider font-semibold text-[#E69D24]">
                  Shohona Lazzat
                </div>
                <div className="text-lg font-bold">
                  Besh Qozon Maxsus To‘y Oshi
                </div>
              </div>
            </div>

            {/* ─── SUZIB TURUVCHI JONLI KARTOCHKA (Floating Live Badge) ─── */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-5 sm:-bottom-6 -left-3 sm:-left-6 z-20 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#EDE6DC] shadow-warm-lg max-w-[260px] sm:max-w-[280px]"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D94E1F] to-[#E69D24] text-white flex items-center justify-center text-xl flex-shrink-0 shadow-brand-sm">
                  🍲
                </div>
                <div className="text-left">
                  {/* Jonli pulsatsion yashil indikator */}
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      {content.liveBadgeStatus}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-extrabold text-[#1F1A17] leading-tight">
                    {content.liveBadgePlov}
                  </div>
                  <div className="text-[11px] text-[#6B5E55] mt-0.5">
                    {content.liveBadgeTime}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* O'ng burchakdagi kichik chegirma nishoni */}
            <motion.div
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-3 -right-3 z-20 bg-[#E69D24] text-white px-3 py-1.5 rounded-2xl font-extrabold text-xs shadow-warm-md flex items-center gap-1 border-2 border-white"
            >
              <span>🔥 4+1 Bonus</span>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}
