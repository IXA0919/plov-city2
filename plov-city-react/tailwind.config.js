/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {

      /* ═══════════════════════════════════════
         BRAND COLOR PALETTE
         Plov City — Terrakota × Oltin × Qaymoq
      ═══════════════════════════════════════ */
      colors: {

        /* — Fon renglari — */
        bg: {
          DEFAULT: '#FAF7F2',   /* issiq qaymoq — asosiy sahifa foni */
          warm:    '#F5EFE6',   /* bir oz to'qroq qaymoq */
          cool:    '#F0ECE6',   /* kulrang qaymoq */
        },

        /* — Surface (karta foni) — */
        surface: {
          DEFAULT: '#FFFFFF',
          warm:    '#FFFDF9',   /* juda nozik iliqlik */
          border:  '#EDE6DC',   /* nozik oltin-kulrang chiziq */
          hover:   '#FDF8F2',   /* hover foni */
        },

        /* — Asosiy brend: Olovrang-Terrakota — */
        brand: {
          50:  '#FEF0EB',
          100: '#FDDDD2',
          200: '#FBB8A0',
          300: '#F8906D',
          400: '#F46B40',
          500: '#E85820',
          600: '#D94E1F',   /* ★ asosiy brend rangi */
          700: '#B83D14',   /* hover holat */
          800: '#972F0E',
          900: '#7A2409',
          950: '#4A1205',
        },

        /* — Za'faron / Oltin — narxlar, yulduzlar, badge — */
        gold: {
          50:  '#FEFAE9',
          100: '#FDF3C4',
          200: '#FBE68A',
          300: '#F9D450',
          400: '#F4BF1A',
          500: '#E69D24',   /* ★ asosiy oltin */
          600: '#CC8415',
          700: '#A8680E',
          800: '#8A5110',
          900: '#72420F',
          950: '#422304',
        },

        /* — Zumrad yashil — Halol/Yangi belgilar — */
        emerald: {
          50:  '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#2E7D32',
          700: '#1B5E20',   /* ★ asosiy yashil */
          800: '#145214',
          900: '#0D3B0D',
          950: '#071F07',
        },

        /* — Asosiy matn: To'q shokolad/ko'mir — */
        ink: {
          DEFAULT: '#1F1A17',   /* ★ sarlavhalar, asosiy matn */
          light:   '#2D2521',
          soft:    '#3D342E',
        },

        /* — Ikkinchi darajali matn: Iliq kulrang-jigarrang — */
        muted: {
          DEFAULT: '#6B5E55',   /* ★ tavsiflar, label-lar */
          light:   '#8C7D74',
          lighter: '#B0A39B',
          border:  '#D4CAC3',
        },

        /* — Qo'shimcha neytral — */
        stone: {
          50:  '#FAFAF9',
          100: '#F5F5F3',
          200: '#E8E5E0',
          300: '#D4CFC8',
          400: '#B8B0A6',
          500: '#9A908A',
          600: '#7A706A',
          700: '#5C5450',
          800: '#3E3A37',
          900: '#262220',
          950: '#141210',
        },

        /* — Status renglari — */
        success: { DEFAULT: '#1B5E20', light: '#E8F5E9', text: '#1B5E20' },
        warning: { DEFAULT: '#E69D24', light: '#FEFAE9', text: '#8A5110' },
        error:   { DEFAULT: '#D94E1F', light: '#FEF0EB', text: '#7A2409' },
        info:    { DEFAULT: '#1565C0', light: '#E3F2FD', text: '#0D47A1' },
      },

      /* ═══════════════════════════════════════
         TYPOGRAPHY
      ═══════════════════════════════════════ */
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        sans:    ['"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs:    ['0.75rem',  { lineHeight: '1.125rem' }],
        sm:    ['0.875rem', { lineHeight: '1.375rem' }],
        base:  ['1rem',     { lineHeight: '1.625rem' }],
        lg:    ['1.125rem', { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',  { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
        '4xl': ['2.25rem',  { lineHeight: '2.75rem' }],
        '5xl': ['3rem',     { lineHeight: '3.5rem', letterSpacing: '-0.02em' }],
        '6xl': ['3.75rem',  { lineHeight: '4.25rem', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem',   { lineHeight: '5rem',    letterSpacing: '-0.04em' }],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter:  '-0.03em',
        tight:    '-0.01em',
        normal:   '0em',
        wide:     '0.025em',
        wider:    '0.06em',
        widest:   '0.12em',
        ultra:    '0.2em',
      },
      lineHeight: {
        none:     '1',
        tight:    '1.2',
        snug:     '1.375',
        normal:   '1.625',
        relaxed:  '1.75',
        loose:    '2',
      },

      /* ═══════════════════════════════════════
         SPACING
      ═══════════════════════════════════════ */
      spacing: {
        '4.5':  '1.125rem',
        '5.5':  '1.375rem',
        '6.5':  '1.625rem',
        '7.5':  '1.875rem',
        '13':   '3.25rem',
        '15':   '3.75rem',
        '17':   '4.25rem',
        '18':   '4.5rem',
        '19':   '4.75rem',
        '21':   '5.25rem',
        '22':   '5.5rem',
        '26':   '6.5rem',
        '30':   '7.5rem',
        '34':   '8.5rem',
        '38':   '9.5rem',
        '42':   '10.5rem',
        '46':   '11.5rem',
        '50':   '12.5rem',
        '54':   '13.5rem',
        '58':   '14.5rem',
        '62':   '15.5rem',
        '66':   '16.5rem',
        '68':   '17rem',
        '72':   '18rem',
        '76':   '19rem',
        '80':   '20rem',
        '84':   '21rem',
        '88':   '22rem',
        '92':   '23rem',
        '96':   '24rem',
        '100':  '25rem',
        '104':  '26rem',
        '112':  '28rem',
        '120':  '30rem',
        '128':  '32rem',
        '144':  '36rem',
      },

      /* ═══════════════════════════════════════
         BORDER RADIUS
      ═══════════════════════════════════════ */
      borderRadius: {
        none:   '0',
        sm:     '4px',
        DEFAULT:'8px',
        md:     '10px',
        lg:     '14px',
        xl:     '18px',
        '2xl':  '22px',
        '3xl':  '28px',
        '4xl':  '36px',
        '5xl':  '48px',
        full:   '9999px',
      },

      /* ═══════════════════════════════════════
         BOX SHADOWS — Warm Layered System
      ═══════════════════════════════════════ */
      boxShadow: {
        /* — Warm shadows (issiq yoqimli soyalar) — */
        'warm-xs':
          '0 1px 2px rgba(31, 26, 23, 0.04)',
        'warm-sm':
          '0 1px 3px rgba(31, 26, 23, 0.06), 0 1px 2px rgba(31, 26, 23, 0.04)',
        'warm':
          '0 2px 8px rgba(31, 26, 23, 0.06), 0 1px 3px rgba(31, 26, 23, 0.04)',
        'warm-md':
          '0 4px 16px rgba(31, 26, 23, 0.08), 0 2px 6px rgba(31, 26, 23, 0.05)',
        'warm-lg':
          '0 8px 28px rgba(31, 26, 23, 0.09), 0 4px 10px rgba(31, 26, 23, 0.06)',
        'warm-xl':
          '0 16px 48px rgba(31, 26, 23, 0.10), 0 8px 16px rgba(31, 26, 23, 0.07)',
        'warm-2xl':
          '0 24px 64px rgba(31, 26, 23, 0.12), 0 12px 24px rgba(31, 26, 23, 0.08)',

        /* — Brand (terrakota) shadows — */
        'brand-sm':
          '0 2px 8px rgba(217, 78, 31, 0.18)',
        'brand-md':
          '0 4px 16px rgba(217, 78, 31, 0.22), 0 2px 6px rgba(217, 78, 31, 0.12)',
        'brand-lg':
          '0 8px 28px rgba(217, 78, 31, 0.26), 0 4px 10px rgba(217, 78, 31, 0.14)',
        'brand-xl':
          '0 16px 48px rgba(217, 78, 31, 0.30), 0 8px 16px rgba(217, 78, 31, 0.16)',

        /* — Gold shadows — */
        'gold-sm':
          '0 2px 8px rgba(230, 157, 36, 0.22)',
        'gold-md':
          '0 4px 16px rgba(230, 157, 36, 0.28), 0 2px 6px rgba(230, 157, 36, 0.14)',

        /* — Inset shadows — */
        'inner-warm':
          'inset 0 1px 4px rgba(31, 26, 23, 0.07)',
        'inner-brand':
          'inset 0 2px 6px rgba(217, 78, 31, 0.12)',

        /* — Special UI shadows — */
        'card':
          '0 1px 3px rgba(31, 26, 23, 0.06), 0 2px 8px rgba(31, 26, 23, 0.04), 0 0 0 1px rgba(237, 230, 220, 0.8)',
        'card-hover':
          '0 4px 16px rgba(31, 26, 23, 0.10), 0 2px 6px rgba(31, 26, 23, 0.06), 0 0 0 1px rgba(217, 78, 31, 0.15)',
        'card-active':
          '0 2px 8px rgba(217, 78, 31, 0.15), 0 0 0 2px rgba(217, 78, 31, 0.25)',
        'navbar':
          '0 1px 0 rgba(237, 230, 220, 0.8), 0 2px 20px rgba(31, 26, 23, 0.06)',
        'drawer':
          '-4px 0 32px rgba(31, 26, 23, 0.14), -1px 0 0 rgba(237, 230, 220, 0.5)',
        'modal':
          '0 20px 60px rgba(31, 26, 23, 0.20), 0 8px 24px rgba(31, 26, 23, 0.12)',
        'dropdown':
          '0 4px 16px rgba(31, 26, 23, 0.10), 0 1px 4px rgba(31, 26, 23, 0.06), 0 0 0 1px rgba(237, 230, 220, 1)',
        'input-focus':
          '0 0 0 3px rgba(217, 78, 31, 0.15)',
        'btn-primary':
          '0 2px 8px rgba(217, 78, 31, 0.30), 0 1px 2px rgba(217, 78, 31, 0.20)',
        'btn-primary-hover':
          '0 4px 14px rgba(217, 78, 31, 0.35), 0 2px 4px rgba(217, 78, 31, 0.22)',
        'none':
          'none',
      },

      /* ═══════════════════════════════════════
         BACKGROUND IMAGES / GRADIENTS
      ═══════════════════════════════════════ */
      backgroundImage: {
        /* — Brand gradients — */
        'gradient-brand':
          'linear-gradient(135deg, #D94E1F 0%, #E85820 50%, #E69D24 100%)',
        'gradient-brand-soft':
          'linear-gradient(135deg, rgba(217,78,31,0.08) 0%, rgba(230,157,36,0.06) 100%)',
        'gradient-brand-dark':
          'linear-gradient(135deg, #B83D14 0%, #D94E1F 60%, #CC8415 100%)',
        'gradient-hero':
          'linear-gradient(140deg, #3D1A0A 0%, #7A2409 25%, #B83D14 55%, #D94E1F 75%, #E69D24 100%)',
        'gradient-hero-overlay':
          'linear-gradient(180deg, rgba(31,26,23,0) 0%, rgba(31,26,23,0.5) 60%, rgba(31,26,23,0.9) 100%)',

        /* — Surface gradients — */
        'gradient-surface':
          'linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%)',
        'gradient-warm':
          'linear-gradient(180deg, #FAF7F2 0%, #F5EFE6 100%)',

        /* — Card overlay — */
        'gradient-card':
          'linear-gradient(180deg, transparent 30%, rgba(31,26,23,0.75) 100%)',
        'gradient-card-hover':
          'linear-gradient(180deg, transparent 20%, rgba(31,26,23,0.85) 100%)',

        /* — Decorative patterns — */
        'pattern-dots':
          'radial-gradient(circle, rgba(217,78,31,0.12) 1.5px, transparent 1.5px)',
        'pattern-grid':
          'linear-gradient(rgba(237,230,220,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(237,230,220,0.6) 1px, transparent 1px)',
        'pattern-noise':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",

        /* — Gold shimmer — */
        'shimmer':
          'linear-gradient(90deg, transparent 0%, rgba(230,157,36,0.15) 50%, transparent 100%)',
        'shimmer-white':
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },

      /* ═══════════════════════════════════════
         ANIMATIONS & KEYFRAMES
      ═══════════════════════════════════════ */
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-left': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-right': {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.90)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'scale-spring': {
          '0%':   { transform: 'scale(0.85)' },
          '60%':  { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(100%)' },
        },
        'slide-up-fade': {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'pulse-brand': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(217, 78, 31, 0.5)' },
          '50%':      { boxShadow: '0 0 0 14px rgba(217, 78, 31, 0)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(230, 157, 36, 0.5)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(230, 157, 36, 0)' },
        },
        'shimmer': {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'cart-add': {
          '0%':   { transform: 'scale(1)' },
          '30%':  { transform: 'scale(1.35)' },
          '70%':  { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%':      { transform: 'rotate(-8deg)' },
          '75%':      { transform: 'rotate(8deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'count-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in':        'fade-in 0.4s ease-out both',
        'fade-up':        'fade-up 0.5s ease-out both',
        'fade-down':      'fade-down 0.4s ease-out both',
        'fade-left':      'fade-left 0.4s ease-out both',
        'fade-right':     'fade-right 0.4s ease-out both',
        'scale-in':       'scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) both',
        'scale-spring':   'scale-spring 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'slide-in-right': 'slide-in-right 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-out-right':'slide-out-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up-fade':  'slide-up-fade 0.3s cubic-bezier(0.4, 0, 0.2, 1) both',
        'bounce-soft':    'bounce-soft 2.5s ease-in-out infinite',
        'pulse-brand':    'pulse-brand 2s ease-in-out infinite',
        'pulse-gold':     'pulse-gold 2s ease-in-out infinite',
        'shimmer':        'shimmer 2.2s linear infinite',
        'spin-slow':      'spin-slow 10s linear infinite',
        'cart-add':       'cart-add 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'wiggle':         'wiggle 0.5s ease-in-out',
        'float':          'float 3s ease-in-out infinite',
        'count-up':       'count-up 0.3s ease-out both',
      },

      /* ═══════════════════════════════════════
         TRANSITIONS
      ═══════════════════════════════════════ */
      transitionTimingFunction: {
        'spring':       'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth':       'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out-expo':'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'bounce':       'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '350': '350ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '800': '800ms',
        '1000':'1000ms',
      },

      /* ═══════════════════════════════════════
         SCREENS
      ═══════════════════════════════════════ */
      screens: {
        xs:   '480px',
        sm:   '640px',
        md:   '768px',
        lg:   '1024px',
        xl:   '1280px',
        '2xl':'1440px',
        '3xl':'1800px',
      },

      /* ═══════════════════════════════════════
         Z-INDEX
      ═══════════════════════════════════════ */
      zIndex: {
        '-1': '-1',
        '0':  '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100':'100',
      },

      /* ═══════════════════════════════════════
         MISC
      ═══════════════════════════════════════ */
      backdropBlur: {
        xs: '2px',
        sm: '6px',
        md: '12px',
        lg: '20px',
        xl: '32px',
      },
      aspectRatio: {
        '4/3':   '4 / 3',
        '3/2':   '3 / 2',
        '16/10': '16 / 10',
        '21/9':  '21 / 9',
        'food':  '4 / 3',
        'hero':  '16 / 7',
      },
      gridTemplateColumns: {
        'menu-sm': 'repeat(2, minmax(0, 1fr))',
        'menu-md': 'repeat(3, minmax(0, 1fr))',
        'menu-lg': 'repeat(4, minmax(0, 1fr))',
        'footer':  '2fr 1fr 1fr 1.2fr',
      },
    },
  },
  plugins: [],
}
