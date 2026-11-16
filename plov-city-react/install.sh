#!/bin/bash
# ============================================================
#  Plov City — Server Install Script
#  Vite + React loyihasini serverga o'rnatish
#  Qo'llab-quvvatlanadigan: Ubuntu 20.04 / 22.04 / 24.04
# ============================================================

set -e  # Xato bo'lsa darhol to'xta

# ───────── RANGLAR ─────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ───────── O'ZGARUVCHILAR ─────────
APP_NAME="plov-city"
APP_DIR="/var/www/plov-city"
NGINX_CONF="/etc/nginx/sites-available/plov-city"
NGINX_ENABLED="/etc/nginx/sites-enabled/plov-city"
NODE_VERSION="20"       # Node.js LTS versiyasi

# ─── DOMENNI SOZLASH ───
# install.sh ni ishlatishda: ./install.sh plovcity.uz
DOMAIN="${1:-plovcity.uz}"
WWW_DOMAIN="www.${DOMAIN}"

# ═══════════════════════════════════════
print_banner() {
  echo -e "${CYAN}"
  echo "╔═══════════════════════════════════════════╗"
  echo "║   🍲  PLOV CITY — O'rnatish Skripti       ║"
  echo "║       Vite React + Nginx + SSL             ║"
  echo "╚═══════════════════════════════════════════╝"
  echo -e "${NC}"
}

print_step() {
  echo -e "\n${BLUE}${BOLD}▶ $1${NC}"
}

print_ok() {
  echo -e "  ${GREEN}✅ $1${NC}"
}

print_warn() {
  echo -e "  ${YELLOW}⚠️  $1${NC}"
}

print_error() {
  echo -e "  ${RED}❌ $1${NC}"
  exit 1
}
# ═══════════════════════════════════════

print_banner

# ───── ROOT tekshirish ─────
if [ "$EUID" -ne 0 ]; then
  print_error "Iltimos, root yoki sudo bilan ishga tushiring:\n  sudo bash install.sh ${DOMAIN}"
fi

echo -e "${CYAN}🌐 Domen: ${BOLD}${DOMAIN}${NC}"
echo -e "${CYAN}📂 O'rnatish papkasi: ${BOLD}${APP_DIR}${NC}"
echo ""

# ═══════════════════════════════════════
# 1. TIZIM YANGILASH
# ═══════════════════════════════════════
print_step "1/8 — Tizim paketlarini yangilash"
apt-get update -qq && apt-get upgrade -y -qq
apt-get install -y -qq curl wget git unzip ufw
print_ok "Tizim paketlari yangilandi"

# ═══════════════════════════════════════
# 2. NODE.JS O'RNATISH (NVM orqali)
# ═══════════════════════════════════════
print_step "2/8 — Node.js ${NODE_VERSION} o'rnatish"

if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - > /dev/null 2>&1
  apt-get install -y -qq nodejs
  print_ok "Node.js $(node -v) o'rnatildi"
else
  CURRENT_NODE=$(node -v)
  print_ok "Node.js allaqachon o'rnatilgan: ${CURRENT_NODE}"
fi

# pnpm o'rnatish
if ! command -v pnpm &> /dev/null; then
  npm install -g pnpm --quiet
  print_ok "pnpm o'rnatildi: $(pnpm -v)"
else
  print_ok "pnpm allaqachon mavjud: $(pnpm -v)"
fi

# PM2 o'rnatish (agar Node server kerak bo'lsa)
if ! command -v pm2 &> /dev/null; then
  npm install -g pm2 --quiet
  print_ok "PM2 o'rnatildi"
else
  print_ok "PM2 allaqachon mavjud"
fi

# ═══════════════════════════════════════
# 3. NGINX O'RNATISH
# ═══════════════════════════════════════
print_step "3/8 — Nginx o'rnatish va sozlash"

if ! command -v nginx &> /dev/null; then
  apt-get install -y -qq nginx
  print_ok "Nginx o'rnatildi: $(nginx -v 2>&1)"
else
  print_ok "Nginx allaqachon mavjud: $(nginx -v 2>&1)"
fi

systemctl enable nginx > /dev/null 2>&1
systemctl start nginx
print_ok "Nginx ishga tushirildi"

# ═══════════════════════════════════════
# 4. LOYIHANI PAPKAGA NUSXALASH
# ═══════════════════════════════════════
print_step "4/8 — Loyiha fayllarini joylashtirish"

# Papka yaratish
mkdir -p "${APP_DIR}"

# Agar git repo bo'lsa:
# git clone https://github.com/YOUR_USERNAME/plov-city.git "${APP_DIR}"

# Yoki mavjud papkadan nusxalash (agar skript loyiha ichida bo'lsa):
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "${SCRIPT_DIR}/package.json" ]; then
  print_warn "Loyiha fayllarini ${APP_DIR} ga nusxalash..."
  rsync -a --exclude='node_modules' --exclude='dist' --exclude='.git' \
    "${SCRIPT_DIR}/" "${APP_DIR}/"
  print_ok "Fayllar nusxalandi: ${APP_DIR}"
else
  print_warn "Loyiha fayllarini qo'lda ${APP_DIR} ga nusxalang, so'ng davom eting."
fi

# ═══════════════════════════════════════
# 5. .ENV YARATISH
# ═══════════════════════════════════════
print_step "5/8 — .env faylini sozlash"

cd "${APP_DIR}"

if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    # Domenni .env ga yozish
    sed -i "s|VITE_APP_URL=.*|VITE_APP_URL=https://${DOMAIN}|g" .env
    print_warn ".env fayli yaratildi — Telegram token va boshqa qiymatlarni to'ldiring:"
    print_warn "  nano ${APP_DIR}/.env"
  else
    cat > .env << EOF
# Plov City — Environment Variables
VITE_TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
VITE_TELEGRAM_CHAT_ID=YOUR_CHAT_ID_HERE
VITE_APP_NAME=Plov City
VITE_APP_URL=https://${DOMAIN}
VITE_APP_PHONE=+998712345678
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_MULTILANG=true
VITE_FREE_DELIVERY_THRESHOLD=100000
EOF
    print_warn ".env fayli yaratildi — nano ${APP_DIR}/.env — ni tahrirlang"
  fi
else
  print_ok ".env allaqachon mavjud"
fi

# ═══════════════════════════════════════
# 6. LOYIHANI BUILD QILISH
# ═══════════════════════════════════════
print_step "6/8 — Loyihani build qilish (pnpm install + build)"

cd "${APP_DIR}"

echo "  📦 pnpm install..."
pnpm install --frozen-lockfile 2>&1 | tail -3

echo "  🏗️  pnpm build..."
pnpm build 2>&1 | tail -5

if [ -d "${APP_DIR}/dist" ]; then
  print_ok "Build muvaffaqiyatli: ${APP_DIR}/dist"
  DIST_SIZE=$(du -sh "${APP_DIR}/dist" | cut -f1)
  print_ok "dist papkasi hajmi: ${DIST_SIZE}"
else
  print_error "Build muvaffaqiyatsiz — dist papkasi topilmadi!"
fi

# Ruxsatlarni sozlash
chown -R www-data:www-data "${APP_DIR}/dist"
chmod -R 755 "${APP_DIR}/dist"
print_ok "Fayl ruxsatlari sozlandi (www-data)"

# ═══════════════════════════════════════
# 7. NGINX KONFIGURATSIYASI
# ═══════════════════════════════════════
print_step "7/8 — Nginx konfiguratsiyasini yozish"

# Default site ni o'chirish
if [ -f "/etc/nginx/sites-enabled/default" ]; then
  rm -f /etc/nginx/sites-enabled/default
  print_ok "Default nginx site o'chirildi"
fi

# Nginx config yozish
cat > "${NGINX_CONF}" << NGINX_EOF
# ============================================================
#  Plov City — Nginx Configuration
#  Domen: ${DOMAIN}
#  Generatsiya: $(date '+%Y-%m-%d %H:%M:%S')
# ============================================================

# HTTP → HTTPS yo'naltirish
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} ${WWW_DOMAIN};

    # Let's Encrypt SSL tekshiruvi uchun
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files \$uri =404;
    }

    # Hamma narsani HTTPSga yo'naltirish
    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS asosiy server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN} ${WWW_DOMAIN};

    # ── SSL Sertifikat (Certbot to'ldiradi) ──
    ssl_certificate     /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    # ── SSL Xavfsizlik ──
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # ── Root papka (Vite build) ──
    root ${APP_DIR}/dist;
    index index.html;

    # ── Xavfsizlik sarlavhalari ──
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # ── Gzip siqish ──
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        image/svg+xml
        font/woff
        font/woff2;

    # ── Vite build fayllari (assets) — uzoq muddatli kesh ──
    location ~* ^/assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        try_files \$uri =404;
    }

    # ── Statik rasmlar va media ──
    location ~* \.(jpg|jpeg|png|gif|ico|webp|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
        try_files \$uri =404;
    }

    # ── JS va CSS fayllari ──
    location ~* \.(js|css|map)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
        access_log off;
        try_files \$uri =404;
    }

    # ── SPA routing (React Router) ──
    # Barcha so'rovlarni index.html ga yo'naltirish
    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # ── Logo va favicon ──
    location = /logo.jpg {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        try_files \$uri =404;
    }

    location = /favicon.ico {
        expires 30d;
        access_log off;
        try_files \$uri =404;
    }

    # ── Admin panel himoyasi (opsional) ──
    # location /admin {
    #     auth_basic "Admin Panel";
    #     auth_basic_user_file /etc/nginx/.htpasswd;
    #     try_files \$uri \$uri/ /index.html;
    # }

    # ── Xato sahifalar ──
    error_page 404 /index.html;
    error_page 500 502 503 504 /index.html;

    # ── Log fayllar ──
    access_log /var/log/nginx/plov-city-access.log;
    error_log  /var/log/nginx/plov-city-error.log warn;

    # ── Fayl hajmi chegarasi (upload) ──
    client_max_body_size 10M;
}
NGINX_EOF

print_ok "Nginx config yozildi: ${NGINX_CONF}"

# Symlink yaratish
ln -sf "${NGINX_CONF}" "${NGINX_ENABLED}"
print_ok "Nginx site enabled"

# Nginx config tekshirish
if nginx -t 2>&1 | grep -q "syntax is ok"; then
  print_ok "Nginx konfiguratsiyasi to'g'ri ✅"
  systemctl reload nginx
  print_ok "Nginx qayta yuklandi"
else
  nginx -t
  print_error "Nginx konfiguratsiyasida xato!"
fi

# ═══════════════════════════════════════
# 8. SSL SERTIFIKAT (Certbot / Let's Encrypt)
# ═══════════════════════════════════════
print_step "8/8 — SSL sertifikat o'rnatish (Let's Encrypt)"

if ! command -v certbot &> /dev/null; then
  apt-get install -y -qq certbot python3-certbot-nginx
  print_ok "Certbot o'rnatildi"
fi

# Domen resolvatsiyasini tekshirish
SERVER_IP=$(hostname -I | awk '{print $1}')
echo -e "  ${YELLOW}⚠️  Domen tekshiruvi:${NC}"
echo -e "  ${CYAN}Server IP: ${SERVER_IP}${NC}"
echo -e "  ${CYAN}Domen: ${DOMAIN} → DNS ni server IPga to'g'rirlang!${NC}"
echo ""

read -t 10 -p "  SSL sertifikat olish uchun tayyor? (y/N): " SSL_READY || SSL_READY="n"

if [[ "$SSL_READY" =~ ^[Yy]$ ]]; then
  certbot --nginx \
    -d "${DOMAIN}" \
    -d "${WWW_DOMAIN}" \
    --non-interactive \
    --agree-tos \
    --email "admin@${DOMAIN}" \
    --redirect
  print_ok "SSL sertifikat o'rnatildi!"
  
  # Avtomatik yangilash
  systemctl enable certbot.timer > /dev/null 2>&1 || \
    echo "0 0,12 * * * root certbot renew --quiet" > /etc/cron.d/certbot
  print_ok "SSL avtomatik yangilash sozlandi"
else
  print_warn "SSL keyinroq o'rnating: sudo certbot --nginx -d ${DOMAIN} -d ${WWW_DOMAIN}"
  
  # SSL'siz HTTP konfiguratsiya
  cat > "${NGINX_CONF}" << HTTP_NGINX_EOF
# Plov City — HTTP Only (SSL keyinroq qo'shiladi)
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} ${WWW_DOMAIN};

    root ${APP_DIR}/dist;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types text/plain text/css text/javascript application/javascript application/json image/svg+xml;

    location ~* ^/assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|webp|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
        try_files \$uri =404;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    error_page 404 /index.html;
    access_log /var/log/nginx/plov-city-access.log;
    error_log  /var/log/nginx/plov-city-error.log warn;
    client_max_body_size 10M;
}
HTTP_NGINX_EOF

  nginx -t && systemctl reload nginx
  print_ok "HTTP konfiguratsiyasi yuklandi (SSL o'rnatilmagan)"
fi

# ═══════════════════════════════════════
# FIREWALL SOZLASH
# ═══════════════════════════════════════
print_step "🔥 Firewall (UFW) sozlash"

ufw allow OpenSSH    > /dev/null 2>&1
ufw allow 'Nginx Full' > /dev/null 2>&1
ufw --force enable   > /dev/null 2>&1
print_ok "UFW: SSH, HTTP (80), HTTPS (443) ochildi"

# ═══════════════════════════════════════
# BUILD YANGILASH SKRIPTI
# ═══════════════════════════════════════
print_step "🔄 deploy.sh (yangilash skripti) yaratish"

cat > "${APP_DIR}/deploy.sh" << 'DEPLOY_EOF'
#!/bin/bash
# Plov City — Tez yangilash skripti
set -e

APP_DIR="/var/www/plov-city"
cd "$APP_DIR"

echo "📦 Paketlarni yangilash..."
pnpm install --frozen-lockfile

echo "🏗️  Build..."
pnpm build

echo "🔒 Ruxsatlar..."
chown -R www-data:www-data dist/

echo "🔄 Nginx reload..."
nginx -t && systemctl reload nginx

echo "✅ Deploy muvaffaqiyatli!"
echo "🕐 $(date '+%Y-%m-%d %H:%M:%S')"
DEPLOY_EOF

chmod +x "${APP_DIR}/deploy.sh"
print_ok "deploy.sh yaratildi: ${APP_DIR}/deploy.sh"

# ═══════════════════════════════════════
# YAKUNIY HISOBOT
# ═══════════════════════════════════════
echo ""
echo -e "${GREEN}${BOLD}"
echo "╔══════════════════════════════════════════════════╗"
echo "║   🎉  O'rnatish muvaffaqiyatli yakunlandi!      ║"
echo "╚══════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${CYAN}📂 Loyiha papkasi:${NC}  ${APP_DIR}"
echo -e "${CYAN}🌐 Sayt manzili:${NC}    http://${DOMAIN}  (yoki https:// SSL keyin)"
echo -e "${CYAN}📄 Nginx config:${NC}    ${NGINX_CONF}"
echo -e "${CYAN}📝 Log fayllar:${NC}     /var/log/nginx/plov-city-*.log"
echo -e "${CYAN}🔄 Yangilash:${NC}       sudo bash ${APP_DIR}/deploy.sh"
echo ""
echo -e "${YELLOW}📋 Keyingi qadamlar:${NC}"
echo -e "  1. nano ${APP_DIR}/.env  — Telegram token va boshqa qiymatlarni to'ldiring"
echo -e "  2. sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}  — SSL o'rnating"
echo -e "  3. http://${DOMAIN}  — saytni oching"
echo ""
echo -e "${GREEN}✅ Plov City serverda ishlashga tayyor!${NC}"

