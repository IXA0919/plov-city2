import { useState } from 'react'
import { MapPin, Phone, Clock, Navigation, ExternalLink, Compass, CheckCircle2, ChevronRight } from 'lucide-react'
import { branches, isBranchOpen, getBranchName, getBranchAddress, getBranchLandmark } from '@data/branchesData'
import { useLanguage } from '@context/LanguageContext'

export default function Branches() {
  const { lang } = useLanguage()
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0].id)

  const activeBranch = branches.find((b) => b.id === selectedBranchId) || branches[0]

  return (
    <section id="branches-section" className="py-20 bg-cream-50 relative border-t border-surface-border">
      <div className="pc-container">
        
        {/* Sarlavha bloki */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin size={14} className="text-brand" />
            <span>
              {lang === 'ru' ? 'Сеть филиалов' : lang === 'en' ? 'Branch Network' : 'Filiallar tarmog‘i'}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-bold text-ink tracking-tight mb-4">
            {lang === 'ru'
              ? 'Наши филиалы в Ташкенте'
              : lang === 'en'
              ? 'Our Branches in Tashkent'
              : 'Toshkentdagi filiallarimiz'}
          </h2>

          <p className="text-muted text-base leading-relaxed">
            {lang === 'ru'
              ? 'Выберите удобный филиал для самовывоза или посетите нас с семьей. Горячий плов ждет вас каждый день с 09:00 до 23:00.'
              : lang === 'en'
              ? 'Pick the most convenient branch for self-pickup or dine in with your family. Fresh hot plov awaits every day from 09:00 to 23:00.'
              : 'O‘zingizga eng qulay filialni tanlang yoki oilangiz bilan tashrif buyuring. Har kuni 09:00 dan 23:00 gacha issiqina osh tayyor!'}
          </p>
        </div>

        {/* 2 Ustunli Katta Tuzilma: Chapda Kartochkalar, O'ngda Interaktiv Xarita/Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Chap ustun: 3 ta filial kartochkasi */}
          <div className="lg:col-span-7 space-y-4">
            {branches.map((b) => {
              const isSelected = b.id === selectedBranchId
              const isOpen = isBranchOpen(b)

              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBranchId(b.id)}
                  className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? 'bg-white border-brand shadow-warm-lg ring-2 ring-brand/10 -translate-y-0.5'
                      : 'bg-white/80 hover:bg-white border-surface-border shadow-warm hover:shadow-warm-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    
                    {/* Chap ma'lumotlar */}
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 rounded-2xl bg-brand-light/60">{b.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-ink group-hover:text-brand transition-colors">
                              {getBranchName(b, lang)}
                            </h3>
                            {b.isMain && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                {lang === 'ru' ? 'Главный' : lang === 'en' ? 'Main' : 'Asosiy'}
                              </span>
                            )}
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold mt-0.5 ${
                              isOpen ? 'text-emerald-700' : 'text-red-600'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                            {isOpen
                              ? (lang === 'ru' ? 'Сейчас открыто' : lang === 'en' ? 'Open Now' : 'Hozir ochiq')
                              : (lang === 'ru' ? 'Закрыто' : lang === 'en' ? 'Closed' : 'Yopiq')}
                            {' '}&bull; {b.hours}
                          </span>
                        </div>
                      </div>

                      {/* Manzil va Mo'ljal */}
                      <div className="space-y-1.5 text-sm pl-1">
                        <div className="flex items-start gap-2 text-ink font-medium">
                          <MapPin size={16} className="text-brand flex-shrink-0 mt-0.5" />
                          <span>{getBranchAddress(b, lang)}</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-muted">
                          <Compass size={15} className="text-gold flex-shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-ink/80">{lang === 'ru' ? 'Ориентир:' : lang === 'en' ? 'Landmark:' : 'Mo‘ljal:'}</strong>{' '}
                            {getBranchLandmark(b, lang)}
                          </span>
                        </div>
                      </div>

                      {/* Telefon */}
                      <div className="flex items-center gap-4 text-xs pt-1">
                        <a
                          href={`tel:${b.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 font-bold text-ink hover:text-brand transition-colors bg-cream-200/80 px-2.5 py-1.5 rounded-xl border border-surface-border"
                        >
                          <Phone size={13} className="text-brand" />
                          <span>{b.phone}</span>
                        </a>
                        <span className="text-muted">
                          {lang === 'ru' ? 'Ежедневно: 09:00 - 23:00' : lang === 'en' ? 'Daily: 09:00 - 23:00' : 'Har kuni: 09:00 - 23:00'}
                        </span>
                      </div>
                    </div>

                    {/* O'ng taraf: Tanlash / Ko'rish belgisi */}
                    <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-2 pt-2 sm:pt-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? 'bg-brand text-white shadow-brand-sm' : 'bg-cream-200 text-muted group-hover:text-ink'
                      }`}>
                        <ChevronRight size={18} className={`transition-transform duration-200 ${isSelected ? 'rotate-90 sm:rotate-0' : ''}`} />
                      </div>
                    </div>

                  </div>

                  {/* Qulayliklar teglari */}
                  <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-surface-border/60">
                    {b.features.map((feat, fi) => (
                      <span key={fi} className="inline-flex items-center gap-1 text-[11px] font-medium text-muted bg-cream-100 px-2.5 py-0.5 rounded-lg border border-surface-border/40">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        {feat}
                      </span>
                    ))}
                  </div>

                </div>
              )
            })}
          </div>

          {/* O'ng ustun: Stilizatsiya qilingan Interaktiv Xarita / Lokatsiya paneli */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="sticky top-28 rounded-3xl bg-white border border-surface-border shadow-warm-lg overflow-hidden flex flex-col h-full min-h-[460px]">
              
              {/* Vizual xarita mockup qismi */}
              <div className="relative h-64 sm:h-72 bg-gradient-to-br from-amber-50 via-orange-50 to-cream-200 overflow-hidden flex items-center justify-center border-b border-surface-border">
                {/* Geometrik xarita chiziqlari (SVG grid) */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D94E1F" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                  </svg>
                </div>

                {/* Simulated Map Roads & Accents */}
                <div className="absolute inset-0">
                  <div className="absolute w-[180%] h-3 bg-white/70 rotate-12 top-20 -left-20 shadow-sm" />
                  <div className="absolute w-[180%] h-4 bg-white/70 -rotate-45 top-32 -left-20 shadow-sm" />
                  <div className="absolute w-28 h-28 rounded-full border-4 border-white/80 bg-emerald-100/40 top-10 right-10" />
                </div>

                {/* Markaziy Pin (Active Branch) */}
                <div className="relative z-10 flex flex-col items-center animate-bounce">
                  <div className="px-3 py-1.5 rounded-full bg-ink text-white text-xs font-bold shadow-2xl flex items-center gap-1.5 mb-1.5 border border-white/20">
                    <span>{activeBranch.emoji}</span>
                    <span>{getBranchName(activeBranch, lang)}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center shadow-2xl shadow-brand/50 ring-4 ring-white">
                    <MapPin size={24} className="fill-white" />
                  </div>
                  <div className="w-4 h-1.5 bg-black/20 rounded-full blur-[2px] mt-1" />
                </div>

                {/* Tepada info overlay */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-surface-border text-xs font-bold text-ink shadow-sm flex items-center gap-1.5">
                    <Clock size={12} className="text-brand" />
                    <span>09:00 - 23:00</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 z-20">
                  <div className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm">
                    {lang === 'ru' ? 'Активный филиал' : lang === 'en' ? 'Active Branch' : 'Tanlangan filial'}
                  </div>
                </div>

              </div>

              {/* Tanlangan filial tafsilotlari va Xarita tugmalari */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5 bg-white">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-brand mb-1">
                    {lang === 'ru' ? 'Информация о локации' : lang === 'en' ? 'Location Details' : 'Manzil tafsiloti'}
                  </div>
                  <h4 className="text-xl font-bold text-ink mb-2">
                    {getBranchName(activeBranch, lang)}
                  </h4>
                  <p className="text-sm text-ink font-medium mb-1">
                    {getBranchAddress(activeBranch, lang)}
                  </p>
                  <p className="text-xs text-muted mb-4">
                    <strong>{lang === 'ru' ? 'Ориентир:' : lang === 'en' ? 'Landmark:' : 'Mo‘ljal:'}</strong> {getBranchLandmark(activeBranch, lang)}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-cream-100 border border-surface-border text-xs text-ink/80 flex items-center justify-between">
                    <span className="font-medium">{lang === 'ru' ? 'Телефон филиала:' : lang === 'en' ? 'Branch Phone:' : 'Filial telefoni:'}</span>
                    <a href={`tel:${activeBranch.phone}`} className="font-bold text-brand hover:underline">
                      {activeBranch.phone}
                    </a>
                  </div>
                </div>

                {/* Yandex Maps va Google Maps tugmalari */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={activeBranch.yandexMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-bold text-xs transition-all shadow-sm hover:shadow"
                  >
                    <Navigation size={14} className="text-red-600" />
                    <span>Yandex Maps</span>
                    <ExternalLink size={12} className="opacity-70" />
                  </a>

                  <a
                    href={activeBranch.googleMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-bold text-xs transition-all shadow-sm hover:shadow"
                  >
                    <Navigation size={14} className="text-sky-600" />
                    <span>Google Maps</span>
                    <ExternalLink size={12} className="opacity-70" />
                  </a>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
