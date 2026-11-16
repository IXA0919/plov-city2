# Plov City — React Loyihasi

**Besh Qozon uslubidagi zamonaviy milliy osh markazi**

---

## ⚡ Tez ishga tushirish

```bash
# 1. Node.js o'rnating: https://nodejs.org (LTS versiyasi)

# 2. Papkaga kiring
cd plov-city-react

# 3. Paketlarni o'rnating
npm install

# 4. .env fayl yarating
cp .env.example .env
# .env faylida VITE_TELEGRAM_BOT_TOKEN va VITE_TELEGRAM_CHAT_ID ni to'ldiring

# 5. Dev server ishga tushiring
npm run dev
```

Brauzeringizda **http://localhost:5173** ochiladi.

## Admin panel

Admin panel Supabase Auth, Database va Storage orqali ishlaydi. Sayt internetda statik hostingda turganda foydalanuvchilarga alohida Node.js serveri kerak emas. `file:///...` manzili esa hosting o'rnini bosa olmaydi: u faqat bitta kompyuterdagi faylni ochadi va boshqa mehmonlar haqidagi statistikani yig'maydi.

Sozlash:

1. Supabase'da loyiha yarating va SQL Editor'da `supabase-setup.sql` faylini ishga tushiring.
2. Supabase Auth'da o'zingiz uchun email/parol foydalanuvchisini yarating. Uning user UUID'sini SQL Editor'da `insert into public.admin_users (user_id) values ('USER-UUID');` so'rovi bilan ruxsat etilgan admin qiling.
3. `public/config.example.js` faylini `public/config.js` deb nusxalang. Supabase Project URL hamda anon/public key'ni yozing. Bu kalit ommaviy bo'ladi; jadval va fayllarni himoyalash RLS siyosatlari bilan bajariladi.
4. Saytni HTTPS statik hostingga joylashtiring. `/admin` manzili shu hosting orqali ochiladi.

Saytni statik hostingga (masalan, Netlify, Vercel yoki Cloudflare Pages) joylashtirish mumkin; sayt ishlayotganda alohida Node.js server talab qilinmaydi. React loyihasini yig'ish uchun esa Node.js build muhitida ishlatiladi.

---

## 🏗️ Loyiha strukturasi

```
plov-city-react/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx        ✅ Tayyor
│   │   │   └── Footer.jsx        ✅ Tayyor
│   │   ├── home/
│   │   │   ├── Hero.jsx          🔧 Placeholder
│   │   │   ├── Promotions.jsx    🔧 Placeholder
│   │   │   ├── AboutSection.jsx  🔧 Placeholder
│   │   │   └── Branches.jsx      🔧 Placeholder
│   │   ├── menu/
│   │   │   ├── MenuSection.jsx   🔧 Placeholder
│   │   │   ├── FoodCard.jsx      🔧 Placeholder
│   │   │   └── FoodModal.jsx     🔧 Placeholder
│   │   └── cart/
│   │       ├── CartDrawer.jsx    ✅ Tayyor
│   │       ├── CheckoutModal.jsx 🔧 Placeholder
│   │       └── OrderSuccessModal.jsx 🔧 Placeholder
│   ├── context/
│   │   ├── CartContext.jsx       ✅ Tayyor (useReducer)
│   │   └── LanguageContext.jsx   ✅ Tayyor (uz/ru/en)
│   ├── data/
│   │   ├── menuData.js           ✅ 30 ta taom, 11 kategoriya
│   │   └── branchesData.js       ✅ 3 filial
│   ├── hooks/
│   │   └── index.js              ✅ 6 ta custom hook
│   ├── locales/
│   │   └── translations.js       ✅ uz, ru, en
│   ├── services/
│   │   └── telegramService.js    ✅ Telegram buyurtma yuborish
│   ├── utils/
│   │   └── index.js              ✅ cn, formatPrice, debounce
│   ├── App.jsx                   ✅ Tayyor
│   ├── main.jsx                  ✅ Tayyor
│   └── index.css                 ✅ Tailwind + custom classes
├── .env.example                  ✅ Telegram token namunasi
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js            ✅ To'liq brend konfiguratsiya
└── vite.config.js                ✅ Path aliases
```

---

## 🎨 Brend ranglari

| Token         | Qiymat    | Ishlatilishi         |
|---------------|-----------|----------------------|
| `primary-700` | `#C8392B` | Asosiy (plov-qizil)  |
| `amber-600`   | `#F4A623` | Ikkilamchi (oltin)   |
| `cream-100`   | `#FFF8F0` | Sahifa foni          |
| `earth-500`   | `#C47B35` | Dekorativ            |

---

## 📦 O'rnatilgan kutubxonalar

| Kutubxona       | Vazifasi                    |
|-----------------|-----------------------------|
| `react`         | UI framework                |
| `vite`          | Build tool                  |
| `tailwindcss`   | Utility-first CSS           |
| `framer-motion` | Animatsiyalar               |
| `lucide-react`  | Ikonkalar                   |
| `clsx`          | Conditional classnames      |
| `tailwind-merge`| TW class conflict resolver  |

---

## 🌐 Ko'p tillilik

`uz` (O'zbek) | `ru` (Русский) | `en` (English)

```js
const { t } = useLang()
t('nav.menu')       // → "Menyu" / "Меню" / "Menu"
t('cart.title')     // → "Savatingiz" / "Ваша корзина" / "Your Cart"
```

---

## 🛒 Cart State Management

`useReducer` + Context API asosida:
- `addItem`, `removeItem`, `increment`, `decrement`
- `clearCart`, `toggleDrawer`, `setNote`
- `totalItems`, `totalPrice`, `isInCart`, `itemCount`

---

## 📱 Telegram Buyurtma

`.env` fayliga token va chat_id kiriting, keyin:
```js
import { sendOrderToTelegram } from '@services/telegramService'
await sendOrderToTelegram(orderData)
```

