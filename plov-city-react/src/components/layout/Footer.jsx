import { useLanguage } from '@context/LanguageContext'
import { Phone, MapPin, Clock, Send, Instagram, ArrowUpRight, Flame, Heart, ShieldCheck } from 'lucide-react'

export default function Footer() {
  const { lang } = useLanguage()
  const year = new Date().getFullYear()

  const quickLinks = [
    {
      name: lang === 'ru' ? 'Акции и комбо' : lang === 'en' ? 'Promotions & Combos' : 'Aksiyalar va kombolar',
      href: '#promo-section',
    },
    {
      name: lang === 'ru' ? 'Наше меню' : lang === 'en' ? 'Our Menu' : 'Bizning menyu',
      href: '#menu-section',
    },
    {
      name: lang === 'ru' ? 'О нас' : lang === 'en' ? 'About Us' : 'Biz haqimizda',
      href: '#about-section',
    },
    {
      name: lang === 'ru' ? 'Филиалы' : lang === 'en' ? 'Branches' : 'Filiallarimiz',
      href: '#branches-section',
    },
  ]

  const menuCategories = [
    { name: lang === 'ru' ? 'Свадебный плов' : lang === 'en' ? 'Wedding Plov' : 'To‘y oshi', href: '#menu-section' },
    { name: lang === 'ru' ? 'Чайханский плов' : lang === 'en' ? 'Chaykhana Plov' : 'Choyxona oshi', href: '#menu-section' },
    { name: lang === 'ru' ? 'Особая Девзира' : lang === 'en' ? 'Special Devzira' : 'Devzira maxsus osh', href: '#menu-section' },
    { name: lang === 'ru' ? 'Самаркандский плов' : lang === 'en' ? 'Samarkand Plov' : 'Samarqand oshi', href: '#menu-section' },
    { name: lang === 'ru' ? 'Казы и перепелиные яйца' : lang === 'en' ? 'Qazi & Quail Eggs' : 'Ot go‘shtli Qazi va tuxum', href: '#menu-section' },
    { name: lang === 'ru' ? 'Свежий Ачичук' : lang === 'en' ? 'Fresh Achichuk' : 'Achichuk salati', href: '#menu-section' },
  ]

  return (
    <footer className="bg-[#1F1A17] text-[#EDE6DC] relative overflow-hidden border-t-4 border-brand">
      {/* Hashamatli nozik fon nurlanishlari */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Asosiy yuqori CTA / Aloqa tasmasi */}
      <div className="border-b border-white/10 py-10 bg-black/20">
        <div className="pc-container flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white shadow-xl shadow-brand/20">
              <Phone size={26} className="animate-pulse" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-gold font-bold">
                {lang === 'ru' ? 'Единый колл-центр и доставка' : lang === 'en' ? 'Single Call Center & Delivery' : 'Yagona aloqa markazi va yetkazish'}
              </div>
              <a
                href="tel:+998712000000"
                className="text-2xl sm:text-3xl font-display font-black text-white hover:text-gold transition-colors tracking-tight"
              >
                +998 (71) 200-00-00
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Telegram tugmasi */}
            <a
              href="https://t.me/plovcity_uz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#229ED9] hover:bg-[#1E88E5] text-white font-bold text-sm shadow-lg shadow-[#229ED9]/25 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <Send size={18} />
              <span>Telegram Kanalimiz</span>
              <ArrowUpRight size={14} className="opacity-70" />
            </a>

            {/* Instagram tugmasi */}
            <a
              href="https://instagram.com/plovcity_uz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-900/25 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <Instagram size={18} />
              <span>Instagram</span>
              <ArrowUpRight size={14} className="opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* Asosiy bloklar */}
      <div className="pc-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* 1. Brend va Shior (4 ustun) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Plov City" className="w-12 h-12 rounded-full object-cover border-2 border-gold shadow-xl" />
              <div>
                <div className="font-display font-black text-2xl tracking-tight text-white flex items-center gap-1.5">
                  PLOV <span className="text-brand">CITY</span>
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-gold">
                  Taste The Heritage
                </div>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              {lang === 'ru'
                ? 'Plov City — это праздник настоящего вкуса в лучших традициях узбекского гостеприимства. Готовим на дровах, доставляем горячим, заботимся от всего сердца!'
                : lang === 'en'
                ? 'Plov City is a celebration of authentic taste honoring the finest Uzbek hospitality traditions. Cooked on firewood, delivered steaming hot, served with heart!'
                : "Plov City — o‘zbek mehmondo‘stligining oliy an’analarini o‘zida mujassam etgan milliy osh maskani. O‘tin olovida damlangan haqiqiy tansiq osh har kuni dasturxoningizda!"}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>100% Halol Sertifikati</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-300 font-semibold bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                <Clock size={15} className="text-gold" />
                <span>09:00 - 23:00</span>
              </div>
            </div>
          </div>

          {/* 2. Tezkor Menyu (3 ustun) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-display font-bold text-base uppercase tracking-wider text-gold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              {lang === 'ru' ? 'Популярный плов' : lang === 'en' ? 'Popular Plov' : 'Ommabop taomlar'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {menuCategories.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    className="text-stone-300 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200"
                  >
                    <span className="text-brand text-xs">&rsaquo;</span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Sayt bo'limlari (2 ustun) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-display font-bold text-base uppercase tracking-wider text-gold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              {lang === 'ru' ? 'Навигация' : lang === 'en' ? 'Navigation' : 'Bo‘limlar'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-stone-300 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200"
                  >
                    <span className="text-brand text-xs">&rsaquo;</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Filiallar va Aloqa (3 ustun) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-display font-bold text-base uppercase tracking-wider text-gold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              {lang === 'ru' ? 'Филиалы' : lang === 'en' ? 'Our Branches' : 'Filiallarimiz'}
            </h4>

            <div className="space-y-3 text-xs text-stone-300">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-bold text-white text-sm">1. Chilonzor Markazi</div>
                <div className="text-stone-400">Bunyodkor shoh ko'chasi 42 (Novza metro)</div>
                <div className="text-gold font-medium">+998 71 200-00-01</div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-bold text-white text-sm">2. Yunusobod</div>
                <div className="text-stone-400">Amir Temur shoh ko'chasi 108 (Shahriston metro)</div>
                <div className="text-gold font-medium">+998 71 200-00-02</div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-bold text-white text-sm">3. O'rikzor</div>
                <div className="text-stone-400">Uchtepa tumani, O'rikzor bozori bosh kirishi</div>
                <div className="text-gold font-medium">+998 71 200-00-03</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Pastki mualliflik huquqi va mini chiziq */}
      <div className="border-t border-white/10 py-6 bg-black/40">
        <div className="pc-container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span>&copy; {year} <span className="text-white font-bold">Plov City</span>. Barcha huquqlar himoyalangan.</span>
            <span className="text-stone-600">|</span>
            <a
              href="/admin"
              className="inline-flex items-center gap-1 text-stone-500 hover:text-gold transition-colors"
              title="Restoran ma'muriyati paneli (Faqat egasi uchun)"
            >
              <ShieldCheck size={13} />
              <span>Boshqaruv</span>
            </a>
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Dasturxoningizga mehr bilan tayyorlandi</span>
            <Heart size={14} className="text-red-500 fill-red-500 mx-1" />
            <span>Toshkent, O‘zbekiston</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
