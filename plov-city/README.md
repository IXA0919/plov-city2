# Plov City

## Ishga tushirish

1. Node.js 20 yoki yangirog‘ini o‘rnating.
2. Loyiha ichidagi tayyor `.env` faylida egasi uchun maxfiy login va parol sozlangan.
3. `.env` ichidagi ADMIN_USERNAME va ADMIN_PASSWORD qiymatlarini o‘zingiznikiga almashtiring. Parol kamida 10 belgidan iborat bo‘lsin.
4. Loyiha papkasida `node --env-file=.env server.mjs` buyrug‘ini bajaring.
5. Saytni http://localhost:3000 manzilida oching.

Admin menyu o‘zgarishlari, buyurtmalar va parol serverdagi `data/store.json` faylida saqlanadi. Saytni ommaga internetga joylashtirsangiz, Node.js serverini ishga tushiradigan hosting va doimiy saqlanadigan disk kerak bo‘ladi. HTTPS ni yoqing; ishlab chiqarish muhitida NODE_ENV=production qo‘ying. Faqat HTML faylini statik hostingga yuklash umumiy saqlashni yoqmaydi.


