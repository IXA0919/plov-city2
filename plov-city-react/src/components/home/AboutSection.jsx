import { Flame, Sparkles, ShieldCheck, Truck, Award, Users, Clock3 } from 'lucide-react'
import { useLanguage } from '@context/LanguageContext'

export default function AboutSection() {
  const { lang } = useLanguage()

  const advantages = [
    {
      id: 1,
      icon: Flame,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      badge: lang === 'ru' ? 'Традиция' : lang === 'en' ? 'Tradition' : "An'ana",
      title: {
        uz: "O'choqda o'tin olovida pishiriladi",
        ru: "Готовится в казане на дровяном огне",
        en: "Cooked in a cauldron over wood fire",
      },
      desc: {
        uz: "Gazda emas, tog' archasi va o'rik o'tinida qizdirilgan cho'yan qozonlarda damlanadi. Aynan shu sababli oshimiz xushbo'y dud va betakror mazaga ega.",
        ru: "Томится в чугунных казанах на дровах арчи и урюка, а не на газе. Именно это дарит плову неповторимый аромат натурального дымка.",
        en: "Simmered in cast-iron cauldrons over juniper and apricot wood, never gas. This infuses every grain with an authentic smoky aroma.",
      },
      stat: "100%",
      statLabel: {
        uz: "Haqiqiy o'tin olovi",
        ru: "Настоящий дровяной огонь",
        en: "Real wood fire",
      },
    },
    {
      id: 2,
      icon: Sparkles,
      color: 'from-amber-400 to-yellow-600',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: lang === 'ru' ? 'Премиум рис' : lang === 'en' ? 'Premium Rice' : 'Oliy nav',
      title: {
        uz: "Saralangan Devzira va Lazer guruch",
        ru: "Отборный рис Девзира и Лазер",
        en: "Selected Devzira & Laser Rice",
      },
      desc: {
        uz: "Farg'ona vodiysining asl qizil Devzirasi va Xorazmning saralangan Lazer guruchi maxsus tozalash va saralash bosqichlaridan o'tkaziladi.",
        ru: "Оригинальная ферганская Девзира и отборный хорезмский рис Лазер проходят строгий контроль очистки и калибровки.",
        en: "Authentic Fergana Devzira and premium Khorezm Laser rice, meticulously cleaned and calibrated for royal texture.",
      },
      stat: "0%",
      statLabel: {
        uz: "Singan donlar yo'q",
        ru: "Без битого зерна",
        en: "Zero broken grains",
      },
    },
    {
      id: 3,
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-700',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: lang === 'ru' ? '100% Халяль' : lang === 'en' ? '100% Halal' : '100% Halol',
      title: {
        uz: "100% Halol va yangi go'sht",
        ru: "100% Халяль и свежее мясо",
        en: "100% Halal & Fresh Meat",
      },
      desc: {
        uz: "Muzlatilgan go'sht ishlatilmaydi! Har kuni ertalab qabul qilinadigan yangi so'yilgan yosh qo'zichoq va buzoq go'shti, sifat sertifikati bilan.",
        ru: "Никакой заморозки! Только свежее мясо молодых барашков и телятины ежедневного утреннего забоя с сертификатом качества.",
        en: "Zero frozen meat! Freshly slaughtered local lamb and young beef delivered every morning with strict Halal certification.",
      },
      stat: "Halol",
      statLabel: {
        uz: "Har kuni yangi so'yish",
        ru: "Свежий утренний забой",
        en: "Fresh daily supply",
      },
    },
    {
      id: 4,
      icon: Truck,
      color: 'from-red-500 to-rose-600',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      badge: lang === 'ru' ? 'Термо-доставка' : lang === 'en' ? 'Thermo Delivery' : 'Issiq yetkazish',
      title: {
        uz: "Termo-idishlarda issiq yetkazish",
        ru: "Горячая доставка в термо-боксах",
        en: "Hot Delivery in Thermo Boxes",
      },
      desc: {
        uz: "Maxsus issiqlikni saqlovchi termo-sumkalar va ekologik zich yopiluvchi idishlar. Osh dasturxoningizga xuddi qozondan yangi suzilgandek issiq yetib boradi.",
        ru: "Профессиональные термо-боксы и герметичные эко-контейнеры. Плов приедет горячим, словно только что из-под крышки казана.",
        en: "Heavy-duty thermal boxes and sealed eco-containers. Your plov arrives steaming hot, as if dished directly from the kettle.",
      },
      stat: "35-45",
      statLabel: {
        uz: "Daqiqada manzilingizda",
        ru: "Минут по Ташкенту",
        en: "Minutes across Tashkent",
      },
    },
  ]

  const stats = [
    { value: '25+', label: { uz: "Yillik osh an'anasi", ru: "Лет традиций плова", en: "Years of tradition" }, icon: Award },
    { value: '1,500 kg', label: { uz: "Kunlik tayyorlanadigan osh", ru: "Плова готовится ежедневно", en: "Plov cooked daily" }, icon: Flame },
    { value: '50,000+', label: { uz: "Mamnun doimiy mijozlar", ru: "Довольных постоянных гостей", en: "Happy regular guests" }, icon: Users },
    { value: '35 min', label: { uz: "O'rtacha yetkazish vaqti", ru: "Среднее время доставки", en: "Average delivery time" }, icon: Clock3 },
  ]

  return (
    <section id="about-section" className="py-20 bg-gradient-to-b from-cream-100 via-white to-cream-100/60 relative overflow-hidden">
      {/* Orqa fondagi naqshlar va yorug'lik */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="pc-container relative z-10">
        {/* Bo'lim sarlavhasi */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-wider mb-4">
            <Flame size={14} className="text-brand animate-pulse" />
            <span>
              {lang === 'ru' ? 'Наши преимущества' : lang === 'en' ? 'Our Advantages' : "Bizning afzalliklarimiz"}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-bold text-ink tracking-tight mb-5">
            {lang === 'ru' ? (
              <>Почему именно <span className="text-brand">Plov City</span>?</>
            ) : lang === 'en' ? (
              <>Why Choose <span className="text-brand">Plov City</span>?</>
            ) : (
              <>Nega aynan <span className="text-brand">Plov City</span>?</>
            )}
          </h2>

          <p className="text-muted text-base md:text-lg leading-relaxed">
            {lang === 'ru'
              ? 'Мы сохранили многовековые рецепты великих узбекских ошпазов и объединили их с европейскими стандартами сервиса и быстрой доставки.'
              : lang === 'en'
              ? 'We honor centuries-old recipes of master Uzbek chefs, combined with modern European standards of cleanliness, hospitality, and fast delivery.'
              : "Buyuk o'zbek oshpazlarining asriy an'analarini zamonaviy tozalik, mehmondo'stlik va tezkor yetkazib berish xizmati bilan uyg'unlashtirdik."}
          </p>
        </div>

        {/* 4 ta asosiy ustunlik kartochkalari */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {advantages.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-3xl p-7 border border-surface-border shadow-warm hover:shadow-warm-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Tepada nozik gradient chiziq */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div>
                  {/* Ikonka va Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <Icon size={26} strokeWidth={2.2} />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Sarlavha */}
                  <h3 className="text-lg font-bold text-ink mb-3 group-hover:text-brand transition-colors duration-200 leading-snug">
                    {item.title[lang] || item.title.uz}
                  </h3>

                  {/* Tavsif */}
                  <p className="text-sm text-muted leading-relaxed mb-6">
                    {item.desc[lang] || item.desc.uz}
                  </p>
                </div>

                {/* Pastki statistika ko'rsatkichi */}
                <div className="pt-4 border-t border-surface-border/60 flex items-baseline justify-between mt-auto">
                  <span className="text-xs text-muted font-medium">
                    {item.statLabel[lang] || item.statLabel.uz}
                  </span>
                  <span className="text-lg font-black text-ink font-mono">
                    {item.stat}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Ishonch ko'rsatkichlari (Stats bar) */}
        <div className="rounded-3xl bg-ink text-white p-8 md:p-10 shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {stats.map((s, idx) => {
              const SIcon = s.icon
              return (
                <div key={idx} className={`flex items-center gap-4 ${idx !== 0 ? 'sm:pl-6' : ''} pt-4 sm:pt-0`}>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-gold flex-shrink-0">
                    <SIcon size={24} />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-black font-display text-white tracking-tight">
                      {s.value}
                    </div>
                    <div className="text-xs text-muted-light/80 font-medium">
                      {s.label[lang] || s.label.uz}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
