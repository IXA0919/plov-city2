export const branches = [
  {
    id: 1,
    name: 'Plov City — Chilonzor Markazi',
    nameRu: 'Plov City — Чиланзар Центр',
    nameEn: 'Plov City — Chilanzar Center',
    address: "Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko'chasi 42",
    addressRu: 'г. Ташкент, Чиланзарский р-н, просп. Бунёдкор 42',
    addressEn: 'Tashkent, Chilanzar district, Bunyodkor Ave 42',
    landmark: "Novza metrosi va Milliy stadion yaqinida",
    landmarkRu: "Рядом с метро Новза и стадионом Миллий",
    landmarkEn: "Near Novza metro station and Milliy Stadium",
    phone: '+998 71 200-00-01',
    phone2: '+998 90 123-45-67',
    lat: 41.2858,
    lng: 69.2045,
    hours: '09:00 - 23:00',
    yandexMapUrl: 'https://yandex.com/maps/?text=41.2858,69.2045',
    googleMapUrl: 'https://maps.google.com/?q=41.2858,69.2045',
    isMain: true,
    emoji: '🔥',
    features: ['Zal (120 kishi)', 'Yetkazib berish', 'Olib ketish', 'Avtoturargoh'],
  },
  {
    id: 2,
    name: 'Plov City — Yunusobod',
    nameRu: 'Plov City — Юнусабад',
    nameEn: 'Plov City — Yunusabad',
    address: "Toshkent sh., Yunusobod tumani, Amir Temur shoh ko'chasi 108",
    addressRu: 'г. Ташкент, Юнусабадский р-н, просп. Амира Темура 108',
    addressEn: 'Tashkent, Yunusabad district, Amir Temur Ave 108',
    landmark: "Shahriston metrosi, Mega Planet ro'parasi",
    landmarkRu: "Метро Шахристон, напротив Mega Planet",
    landmarkEn: "Shakhriston metro, opposite Mega Planet",
    phone: '+998 71 200-00-02',
    phone2: '+998 90 234-56-78',
    lat: 41.3642,
    lng: 69.2882,
    hours: '09:00 - 23:00',
    yandexMapUrl: 'https://yandex.com/maps/?text=41.3642,69.2882',
    googleMapUrl: 'https://maps.google.com/?q=41.3642,69.2882',
    isMain: false,
    emoji: '🏢',
    features: ['Zal (80 kishi)', 'Yetkazib berish', 'Olib ketish', 'Bolalar xonasi'],
  },
  {
    id: 3,
    name: "Plov City — O'rikzor",
    nameRu: 'Plov City — Урикзор',
    nameEn: 'Plov City — Urikzor',
    address: "Toshkent sh., Uchtepa tumani, O'rikzor bozori bosh kirish yo'li",
    addressRu: 'г. Ташкент, Учтепинский р-н, главный вход рынка Урикзор',
    addressEn: 'Tashkent, Uchtepa district, main entrance of Urikzor market',
    landmark: "O'rikzor savdo majmuasi 1-darvoza yonida",
    landmarkRu: "Рядом с 1-ми воротами торгового комплекса Урикзор",
    landmarkEn: "Near Gate 1 of Urikzor trade center",
    phone: '+998 71 200-00-03',
    phone2: '+998 90 345-67-89',
    lat: 41.2880,
    lng: 69.1350,
    hours: '09:00 - 23:00',
    yandexMapUrl: 'https://yandex.com/maps/?text=41.2880,69.1350',
    googleMapUrl: 'https://maps.google.com/?q=41.2880,69.1350',
    isMain: false,
    emoji: '🍲',
    features: ['Katta ayvon', 'Tezkor yetkazish', 'Katta qozon shousi'],
  },
]

export function isBranchOpen(branch) {
  const now = new Date()
  const hours = now.getHours()
  return hours >= 9 && hours < 23
}

export function getBranchName(branch, lang = 'uz') {
  if (lang === 'ru' && branch.nameRu) return branch.nameRu
  if (lang === 'en' && branch.nameEn) return branch.nameEn
  return branch.name
}

export function getBranchAddress(branch, lang = 'uz') {
  if (lang === 'ru' && branch.addressRu) return branch.addressRu
  if (lang === 'en' && branch.addressEn) return branch.addressEn
  return branch.address
}

export function getBranchLandmark(branch, lang = 'uz') {
  if (lang === 'ru' && branch.landmarkRu) return branch.landmarkRu
  if (lang === 'en' && branch.landmarkEn) return branch.landmarkEn
  return branch.landmark
}
