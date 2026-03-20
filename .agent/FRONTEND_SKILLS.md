# 🌟 SKILLS.md — مطعم مستر صحي | Mr. Sehi Restaurant System
## Premium UI/UX Redesign + Complete Fullstack Reference

> **THE ONE FILE** to read before writing any code.
> This document upgrades the original FULLSTACK_SKILLS.md with a world-class
> Awwwards-caliber UI system — while preserving 100% of backend logic, API structure,
> and business rules. Design only. Architecture untouched.

---

# ══════════════════════════════════════════════════════
# PART 0 — 🎯 REDESIGN PHILOSOPHY & CREATIVE DIRECTION
# ══════════════════════════════════════════════════════

## 0.1 The Vision: "Arabian Night Finance"

This is NOT a dashboard. It is a **financial storytelling experience** built for a Saudi restaurant owner who deserves software that feels as premium as the product they serve.

**Aesthetic Identity**: *Editorial luxury fintech* — think Stripe's precision, Apple's restraint, Awwwards' daring, wrapped in a Saudi gold-and-night palette.

**The one thing users remember**: *"This doesn't feel like software. It feels like a living financial journal."*

**Creative anchors:**
- 🌙 Deep night backgrounds with luminous gold accents
- 📖 Magazine-style editorial layout with generous whitespace
- ✨ Everything breathes — scroll reveals, hover lifts, number countups
- 🔮 Glassmorphism cards floating over dark gradients
- 🎯 Data is storytelling, not tables

**What we are NOT doing:**
- ❌ Rebuilding backend logic or API contracts
- ❌ Breaking RTL — Arabic remains first-class throughout
- ❌ Replacing any business rules or accounting calculations
- ❌ Generic "dark mode blue gradient" SaaS clichés

---

## 0.2 Aesthetic Decision Matrix

| Dimension | Old System | New System |
|-----------|-----------|------------|
| Layout | Fixed sidebar + content | Floating glass sidebar + scroll sections |
| KPIs | Static white cards | Glowing editorial blocks with live sparklines |
| Tables | Standard rows | Cinematic rows with expand animations |
| Forms | Grid inputs | Floating-label premium inputs with group steps |
| Charts | Basic Recharts | Animated, gradient-filled, story-driven |
| Colors | Functional palette | Drama — deep navy, gold glow, amber warmth |
| Motion | Minimal | Intentional: page transitions, scroll reveals, counters |
| Mood | Professional | Premium · Alive · Trusted · Beautiful |

---

# ══════════════════════════════════════════════════════
# PART A — 🎨 DESIGN SYSTEM (REDESIGNED)
# ══════════════════════════════════════════════════════

---

## A1. Design Direction: "Arabian Night Finance"

**Aesthetic**: Cinematic editorial luxury — trust through beauty, data through drama.

- ❌ NOT generic dashboard-blue
- ❌ NOT loud restaurant branding
- ❌ NOT Western fintech template
- ✅ IS: Deep navy night sky, warm breathing gold, editorial typography, alive with motion

---

## A2. Color Palette — Upgraded

```css
:root {
  /* ── BRAND (UNCHANGED FUNCTIONAL) ── */
  --color-primary:        #D4A853;   /* Warm gold — all primary actions */
  --color-primary-hover:  #C4953F;
  --color-primary-light:  #FDF3DC;

  /* ── SEMANTIC (UNCHANGED) ── */
  --color-success:        #1DB87B;
  --color-success-bg:     #E8FBF3;
  --color-danger:         #E8384D;
  --color-danger-bg:      #FDECED;
  --color-warning:        #F5A623;
  --color-warning-bg:     #FEF6E4;
  --color-info:           #4A90E2;
  --color-info-bg:        #EBF4FF;

  /* ── PREMIUM LIGHT MODE ── */
  --bg-page:              #F4F3EF;   /* Warm ivory — not cold white */
  --bg-surface:           #FFFFFF;
  --bg-surface-2:         #F0EFE9;   /* Warm tint */
  --bg-sidebar:           #0D0F1A;   /* Deeper night than original */
  --text-primary:         #0D0F1A;
  --text-secondary:       #7A7670;   /* Warmer grey */
  --text-inverse:         #FFFFFF;
  --border-color:         #E4E2DC;   /* Warm border */
  --shadow-sm:            0 1px 3px rgba(13,15,26,0.06);
  --shadow-md:            0 4px 20px rgba(13,15,26,0.10);
  --shadow-lg:            0 12px 40px rgba(13,15,26,0.14);
  --shadow-gold:          0 0 30px rgba(212,168,83,0.25);  /* ✨ NEW */
  --shadow-glow-success:  0 0 20px rgba(29,184,123,0.20); /* ✨ NEW */
  --shadow-glow-danger:   0 0 20px rgba(232,56,77,0.20);  /* ✨ NEW */

  /* ── PREMIUM DARK MODE TOKENS ── */
  --dark-bg-page:         #07080F;   /* Deeper black */
  --dark-bg-surface:      #0D0F1A;   /* Rich navy */
  --dark-bg-surface-2:    #151829;   /* Slightly lifted navy */
  --dark-bg-surface-3:    #1C2038;   /* Card surfaces */
  --dark-text-primary:    #EDE9E0;   /* Warm white */
  --dark-text-secondary:  #8A8880;
  --dark-border-color:    #1E2235;
  --dark-shadow-gold:     0 0 40px rgba(212,168,83,0.30);

  /* ── GRADIENTS ── */
  --gradient-gold:        linear-gradient(135deg, #D4A853 0%, #F5C842 50%, #C4953F 100%);
  --gradient-gold-glow:   linear-gradient(135deg, rgba(212,168,83,0.15) 0%, rgba(245,200,66,0.05) 100%);
  --gradient-hero:        linear-gradient(160deg, #0D0F1A 0%, #151829 40%, #1A1030 100%);
  --gradient-success:     linear-gradient(135deg, #1DB87B 0%, #0FA063 100%);
  --gradient-danger:      linear-gradient(135deg, #E8384D 0%, #C4253A 100%);

  /* ── GLASS EFFECT ── */
  --glass-bg:             rgba(255,255,255,0.06);
  --glass-border:         rgba(255,255,255,0.10);
  --glass-blur:           blur(20px);
  --glass-bg-light:       rgba(255,255,255,0.72);
  --glass-border-light:   rgba(212,168,83,0.15);
}

/* Dark mode: swap all tokens */
[data-theme="dark"] {
  --bg-page:        var(--dark-bg-page);
  --bg-surface:     var(--dark-bg-surface);
  --bg-surface-2:   var(--dark-bg-surface-2);
  --text-primary:   var(--dark-text-primary);
  --text-secondary: var(--dark-text-secondary);
  --border-color:   var(--dark-border-color);
  --shadow-sm:      0 1px 3px rgba(0,0,0,0.5);
  --shadow-md:      0 4px 20px rgba(0,0,0,0.5);
  --shadow-gold:    var(--dark-shadow-gold);
  --glass-bg:       rgba(255,255,255,0.04);
  --glass-bg-light: rgba(13,15,26,0.80);
}
```

---

## A3. Typography — Premium Upgrade

```css
/* KEEP: IBM Plex Sans Arabic (self-hosted) */
@font-face {
  font-family: 'IBMPlexArabic';
  src: url('/fonts/IBMPlexSansArabic-Regular.woff2') format('woff2');
  font-weight: 400; font-display: swap;
}
@font-face {
  font-family: 'IBMPlexArabic';
  src: url('/fonts/IBMPlexSansArabic-SemiBold.woff2') format('woff2');
  font-weight: 600; font-display: swap;
}
@font-face {
  font-family: 'IBMPlexArabic';
  src: url('/fonts/IBMPlexSansArabic-Bold.woff2') format('woff2');
  font-weight: 700; font-display: swap;
}

/* ✨ NEW: Editorial display font for hero KPIs & section titles */
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

:root {
  --font-arabic:  'IBMPlexArabic', sans-serif;   /* Body + UI (unchanged) */
  --font-latin:   'IBM Plex Sans', sans-serif;    /* Numbers (unchanged) */
  --font-display: 'Instrument Serif', serif;      /* ✨ Hero headings, editorial moments */
}

body {
  font-family: var(--font-arabic);
  font-size: 14px;
  line-height: 1.6;
}

/* CRITICAL: Numbers always Latin digits (unchanged) */
.number, td.amount, .kpi-value, .col-amount {
  font-family: var(--font-latin);
  font-variant-numeric: tabular-nums;
  direction: ltr;
  unicode-bidi: isolate;
}

/* ✨ NEW: Editorial/hero text moments */
.display-text, .hero-kpi-value, .section-editorial-title {
  font-family: var(--font-display);
  letter-spacing: -0.02em;
}
```

**Extended Type Scale:**
| Token | Size | Weight | Font | Usage |
|-------|------|--------|------|-------|
| `--text-xs` | 11px | 400 | Arabic | Badges, micro-labels |
| `--text-sm` | 13px | 400 | Arabic | Table cells, helper text |
| `--text-base` | 14px | 400 | Arabic | Body, form inputs |
| `--text-md` | 16px | 500 | Arabic | Card titles, section headers |
| `--text-lg` | 20px | 600 | Arabic | Page titles |
| `--text-xl` | 28px | 700 | Latin | KPI values |
| `--text-2xl` | 36px | 700 | Latin | Secondary hero numbers |
| `--text-3xl` | 56px | 400 | **Display** | ✨ Hero dashboard editorial KPI |
| `--text-4xl` | 72px | 400 | **Display** | ✨ Full-screen section moments |

---

## A4. Animation System — NEW

```typescript
// /src/lib/animations.ts
// Central animation config — use with Framer Motion

export const spring = {
  gentle: { type: 'spring', stiffness: 120, damping: 20 },
  snappy: { type: 'spring', stiffness: 300, damping: 28 },
  bouncy: { type: 'spring', stiffness: 400, damping: 25 },
}

export const easing = {
  smooth: [0.22, 1, 0.36, 1],
  out:    [0, 0, 0.2, 1],
  in:     [0.4, 0, 1, 1],
}

// ── PAGE TRANSITIONS ──
export const pageVariants = {
  initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
  animate: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.5, ease: easing.smooth }
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
}

// ── STAGGER CHILDREN ──
export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
}
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easing.smooth } }
}

// ── CARD HOVER ──
export const cardHover = {
  rest: { y: 0, boxShadow: 'var(--shadow-sm)', scale: 1 },
  hover: {
    y: -4, scale: 1.01,
    boxShadow: 'var(--shadow-lg)',
    transition: spring.gentle
  }
}

// ── SCROLL REVEAL ──
// Use with Intersection Observer (see useScrollReveal hook)
export const scrollReveal = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing.smooth } }
}

// ── SIDEBAR SLIDE ──
export const sidebarVariants = {
  open:   { x: 0,    opacity: 1, transition: spring.gentle },
  closed: { x: '100%', opacity: 0, transition: { duration: 0.25 } },  // RTL: right side
}

// ── NUMBER COUNTER (for KPIs) ──
// Component: see AnimatedNumber.tsx
```

```typescript
// /src/components/ui/AnimatedNumber.tsx
import { useSpring, animated } from '@react-spring/web'

interface Props {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
}

export function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 2 }: Props) {
  const { val } = useSpring({
    from: { val: 0 },
    to: { val: value },
    config: { mass: 1, tension: 60, friction: 20 },
    delay: 200,
  })

  return (
    <animated.span className="number kpi-value">
      {val.to(v => `${prefix}${v.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`)}
    </animated.span>
  )
}
```

```tsx
// /src/hooks/useScrollReveal.ts
import { useEffect, useRef } from 'react'
import { useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export function useScrollReveal(threshold = 0.15) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold, triggerOnce: true })

  useEffect(() => {
    if (inView) controls.start('animate')
  }, [inView, controls])

  return { ref, controls }
}
```

**Animation rules:**
1. **Page enter**: Always fade+slide+blur (see `pageVariants`)
2. **Card grids**: Always stagger children with 70ms delay
3. **KPI numbers**: Always count up on first render (`AnimatedNumber`)
4. **Tables**: Rows fade+slide in as list, 40ms stagger
5. **Sidebar**: Slide from direction (RTL: right, LTR: left)
6. **Forms**: Fields reveal top-to-bottom on focus-within of section
7. **Hover**: Cards lift 4px, scale 1.01 — ONLY on desktop (media query)
8. **NEVER**: Jarring bounces, infinite loops on business data, slow > 600ms transitions

---

## A5. Buttons — Upgraded

```css
/* BASE — same height rules, new visual language */
.btn {
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;        /* Slightly softer than 8px */
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-arabic);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  white-space: nowrap;
  direction: inherit;
  position: relative;
  overflow: hidden;
}

/* ✨ Shimmer on hover for primary */
.btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.4s ease;
}
.btn-primary:hover::after { transform: translateX(100%); }

.btn:disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
.btn .icon    { width: 18px; height: 18px; flex-shrink: 0; }

/* VARIANTS */
.btn-primary {
  background: var(--gradient-gold);
  color: #0D0F1A;                        /* Dark text on gold for contrast */
  border-color: transparent;
  box-shadow: 0 2px 12px rgba(212,168,83,0.40);
}
.btn-primary:hover { box-shadow: 0 4px 20px rgba(212,168,83,0.55); transform: translateY(-1px); }

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border-color: var(--border-color);
  backdrop-filter: blur(4px);
}
.btn-secondary:hover { background: var(--bg-surface-2); border-color: var(--color-primary); color: var(--color-primary); }

.btn-danger  { background: var(--gradient-danger); color: white; box-shadow: 0 2px 12px rgba(232,56,77,0.30); }
.btn-success { background: var(--gradient-success); color: white; box-shadow: 0 2px 12px rgba(29,184,123,0.30); }

.btn-ghost   { background: transparent; color: var(--text-secondary); border-color: transparent; padding: 0 8px; }
.btn-ghost:hover { color: var(--color-primary); background: var(--color-primary-light); }

/* SIZES (unchanged) */
.btn-sm { height: 32px; padding: 0 12px; font-size: 13px; }
.btn-lg { height: 48px; padding: 0 24px; font-size: 15px; border-radius: 12px; }
```

**Usage Rules (unchanged from original):**
- Only ONE `btn-primary` per form or card section
- Export to Excel: always `btn-secondary` + `<Download />` icon
- Delete actions: always `btn-danger` → confirmation dialog first
- Table row actions: always `btn-ghost`
- Loading state: spinner inside, no layout shift

---

## A6. Forms — Premium Floating Label Experience

```css
/* ✨ NEW: Floating label pattern replaces static label-above */
.form-field {
  position: relative;
  margin-bottom: 20px;
}

/* Floating label */
.form-field label {
  position: absolute;
  top: 50%;
  inset-inline-start: 14px;
  transform: translateY(-50%);
  font-size: 14px;
  color: var(--text-secondary);
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
  background: var(--bg-surface);
  padding: 0 4px;
  border-radius: 4px;
}

/* Label floats up when filled or focused */
.form-field:focus-within label,
.form-field.has-value label {
  top: 0;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-primary);
  letter-spacing: 0.4px;
}

/* Input base (all types) */
.form-input, .form-select, .form-textarea {
  height: 48px;                          /* Slightly taller: more premium feel */
  padding: 0 14px;
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  font-size: 14px;
  font-family: var(--font-arabic);
  color: var(--text-primary);
  background: var(--bg-surface);
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  direction: rtl;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(212,168,83,0.12), 0 2px 8px rgba(212,168,83,0.08);
}

.form-input.is-error { border-color: var(--color-danger); box-shadow: 0 0 0 4px rgba(232,56,77,0.10); }
.form-input.is-valid { border-color: var(--color-success); }

/* Readonly computed fields */
.form-input[readonly] {
  background: var(--bg-surface-2);
  cursor: default;
  color: var(--color-success);
  font-weight: 700;
  font-family: var(--font-latin);
  border-color: transparent;
}

/* ✨ NEW: Form section group header (for step-based forms) */
.form-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}
.form-section-number {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--gradient-gold);
  color: #0D0F1A;
  font-size: 13px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.form-section-title { font-size: 16px; font-weight: 600; color: var(--text-primary); }
```

**FormCard Wrapper — Updated:**
```
┌─────────────────────────────────────────────────────────────┐
│  ✦ [Gold dot]  Arabic Title  •  English subtitle (muted)    │  ← Header with accent
├─────────────────────────────────────────────────────────────┤
│  ① Section Label ─────────────────────────────────────────  │
│                                                             │
│  [Floating Label Input]    [Floating Label Input]           │
│  [Floating Label Input]    [Floating Label Input]           │
│                                                             │
│  ② Section Label ─────────────────────────────────────────  │
│                                                             │
│  [Read-only: Subtotal]  [Read-only: VAT 15%]  [Total]      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [إلغاء btn-secondary]              [💾 حفظ btn-primary]   │
└─────────────────────────────────────────────────────────────┘
```

---

## A7. Alerts & Notifications (Updated)

```tsx
// Toast: unchanged library (sonner), but themed for dark premium
import { Toaster } from 'sonner'

// In App root:
<Toaster
  position="top-center"
  richColors
  toastOptions={{
    style: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      fontFamily: 'var(--font-arabic)',
      direction: 'rtl',
      borderRadius: '12px',
      boxShadow: 'var(--shadow-lg)',
    }
  }}
/>

// Usage (unchanged):
toast.success('تم حفظ الفاتورة بنجاح', {
  description: 'تم إنشاء القيد المحاسبي تلقائياً',
  icon: <CheckCircle size={18} />
})
```

```tsx
// ✨ NEW: Animated Alert Banner
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: 'auto', opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  className="alert-banner alert-banner--warning"
>
  <AlertTriangle size={16} />
  <span>3 مشتركين تنتهي اشتراكاتهم قبل 2026/03/19 — </span>
  <a href="/subscribers?filter=expiring">عرض التفاصيل ←</a>
  <button className="alert-dismiss" onClick={dismiss}><X size={14} /></button>
</motion.div>
```

---

## A8. Bilingual Support & Number Rendering (UNCHANGED)

```html
<!-- Arabic (default) -->
<html lang="ar" dir="rtl">
<!-- English (on toggle) -->
<html lang="en" dir="ltr">
```

```typescript
// ALL RULES UNCHANGED — English digits always
const formatSAR = (amount: number): string =>
  `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`

const formatDate = (date: Date | string): string =>
  new Date(date).toLocaleDateString('en-GB') // → "01/03/2026"

const formatPct = (n: number): string => `${(n * 100).toFixed(2)}%`
```

```css
/* RTL/LTR layout — UPDATED for floating sidebar */
[dir="rtl"] .sidebar       { right: 0; left: auto; }
[dir="rtl"] .main-content  { margin-right: 80px; margin-left: 0; }   /* collapsed width */
[dir="ltr"] .sidebar       { left: 0; right: auto; }
[dir="ltr"] .main-content  { margin-left: 80px; margin-right: 0; }

/* Expanded state */
[dir="rtl"] .sidebar.expanded ~ .main-content { margin-right: 280px; }
[dir="ltr"] .sidebar.expanded ~ .main-content { margin-left: 280px; }

/* Amounts always LTR-isolated (UNCHANGED) */
.col-amount { text-align: left !important; direction: ltr; unicode-bidi: isolate; font-family: var(--font-latin); }
```

---

## A9. Dark Mode — The Jewel of the Experience

```tsx
// useTheme.ts — UNCHANGED implementation, upgraded experience
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'dark'  // Default: dark
  )
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  return { theme, toggle, isDark: theme === 'dark' }
}
```

**Dark mode design rules:**
1. Background `#07080F` — near-black with blue undertone (not grey, not pure black)
2. Surfaces rise in luminance: page → surface → surface-2 → surface-3
3. Gold glows `rgba(212,168,83,0.25)` — perceptible but not aggressive
4. Text: warm white `#EDE9E0` — never pure `#FFFFFF` (too harsh)
5. Borders: barely-there `#1E2235` — structure without weight
6. Success = emerald glow, Danger = ruby glow on dark backgrounds
7. Charts: filled with semi-transparent gradients, grid lines barely visible

```tsx
// Chart colors — UPDATED with gradient fills for dark mode
const useChartColors = () => {
  const { isDark } = useTheme()
  return {
    keeta:            '#D4A853',
    hungerStation:    '#4A90E2',
    ninja:            '#1DB87B',
    chartBg:          isDark ? 'transparent' : '#FFFFFF',
    gridColor:        isDark ? 'rgba(255,255,255,0.04)' : '#E5E7EB',
    labelColor:       isDark ? '#8A8880' : '#6B7280',
    fillKeetaGrad:    isDark
      ? ['rgba(212,168,83,0.3)', 'rgba(212,168,83,0)']
      : ['rgba(212,168,83,0.15)', 'rgba(212,168,83,0)'],
    fillHungerGrad:   isDark
      ? ['rgba(74,144,226,0.3)', 'rgba(74,144,226,0)']
      : ['rgba(74,144,226,0.15)', 'rgba(74,144,226,0)'],
  }
}
```

---

## A10. Icons (Unchanged)

**Library: `lucide-react`** — unchanged. Consistent 1.5px stroke.

```tsx
import {
  LayoutDashboard, TrendingUp, BarChart2, FileText,
  Truck, UtensilsCrossed, Package,
  ShoppingCart, Briefcase, Wallet,
  Users, UserCheck, Factory,
  BookOpen, BookMarked, Scale, DollarSign,
  Bell, Search, Download, Plus, Edit2, Trash2,
  ChevronRight, ChevronDown, X, Check,
  Sun, Moon, Globe, Settings, LogOut,
  AlertTriangle, Info, CheckCircle, XCircle,
  Sparkles, Zap, TrendingDown,           // ✨ Added for editorial moments
} from 'lucide-react'
```

---

## A11. Layout Architecture — REDESIGNED

### App Shell — New Structure

```
┌───────────────────────────────────────────────────────────────────┐
│  TOPBAR 56px — glass blur, sticky                                 │
│  [🍽️ Logo]  [Animated Page Title]         [🔔 Bell] [AR|EN] [☀️] [👤] │
├────────┬──────────────────────────────────────────────────────────┤
│        │                                                           │
│  SIDE  │   MAIN CONTENT — scroll container                        │
│  BAR   │                                                           │
│        │  ▓▓▓ HERO SECTION (full-width, editorial) ▓▓▓            │
│  80px  │  [Page title large] [Subtitle] [Date Range picker]       │
│  icon  │                                                           │
│  only  │  ▓▓▓ KPI STORY GRID ▓▓▓                                  │
│  (col- │  4 glowing glass cards — AnimatedNumber inside          │
│  lapsd)│                                                           │
│        │  ▓▓▓ CHART SECTION ▓▓▓                                   │
│  280px │  Large gradient area chart + channel donut               │
│  text  │                                                           │
│  (exp- │  ▓▓▓ TABLE SECTION ▓▓▓                                   │
│  anded)│  Elevated card with animated rows                        │
│        │                                                           │
└────────┴──────────────────────────────────────────────────────────┘
```

### Topbar — Updated

```tsx
// /src/components/layout/Topbar.tsx
<motion.header
  className="topbar"
  initial={{ y: -56 }}
  animate={{ y: 0 }}
  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
>
  <div className="topbar-start">
    <button className="sidebar-toggle" onClick={toggleSidebar}>
      <MenuIcon size={20} />
    </button>
    <AnimatePresence mode="wait">
      <motion.h1
        key={pageTitle}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="topbar-title"
      >
        {pageTitle}
      </motion.h1>
    </AnimatePresence>
  </div>

  <div className="topbar-end">
    <NotificationBell />
    <LanguageToggle />
    <ThemeToggle />
    <UserMenu />
  </div>
</motion.header>
```

```css
.topbar {
  height: 56px;
  position: fixed;
  top: 0;
  inset-inline-start: 0;
  inset-inline-end: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--glass-bg-light);
  backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--glass-border-light);
  box-shadow: var(--shadow-sm);

  /* Offset for sidebar */
  padding-inline-start: calc(80px + 24px);      /* collapsed sidebar */
  transition: padding 0.3s cubic-bezier(0.22,1,0.36,1);
}
.topbar.sidebar-expanded {
  padding-inline-start: calc(280px + 24px);
}
```

### Sidebar — Glassmorphism Floating Design

```tsx
// /src/components/layout/Sidebar.tsx
<motion.aside
  className="sidebar"
  animate={{ width: expanded ? 280 : 80 }}
  transition={{ type: 'spring', stiffness: 200, damping: 30 }}
>
  {/* Logo area */}
  <div className="sidebar-logo">
    <SvgLogo className="logo-icon" />
    <AnimatePresence>
      {expanded && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          className="sidebar-logo-text"
        >
          مستر صحي
        </motion.span>
      )}
    </AnimatePresence>
  </div>

  {/* Nav items */}
  <nav className="sidebar-nav">
    {navSections.map(section => (
      <NavSection key={section.key} section={section} expanded={expanded} />
    ))}
  </nav>

  {/* Expand toggle at bottom */}
  <button className="sidebar-expand-btn" onClick={toggle}>
    <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
      <ChevronRight size={16} />
    </motion.div>
  </button>
</motion.aside>
```

```css
.sidebar {
  position: fixed;
  top: 0;
  inset-inline-end: 0;           /* RTL: right side */
  height: 100vh;
  z-index: 200;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /* Glassmorphism */
  background: rgba(13, 15, 26, 0.85);
  backdrop-filter: blur(24px) saturate(180%);
  border-inline-start: 1px solid rgba(255,255,255,0.06);

  /* Subtle gold top accent line */
  border-top: 2px solid var(--color-primary);
}

.sidebar-logo {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.nav-section-title {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255,255,255,0.25);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 20px 20px 6px;
  white-space: nowrap;
  overflow: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  margin: 2px 8px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
  position: relative;
}

.nav-item:hover {
  color: rgba(255,255,255,0.90);
  background: rgba(255,255,255,0.07);
}

.nav-item.active {
  color: #D4A853;
  background: rgba(212,168,83,0.12);
  font-weight: 600;
}

/* Gold left bar on active (RTL: right bar) */
.nav-item.active::before {
  content: '';
  position: absolute;
  inset-inline-end: 0;
  top: 20%;
  height: 60%;
  width: 3px;
  background: var(--color-primary);
  border-radius: 2px;
}

/* Icon wrapper — keeps consistent size in both states */
.nav-item-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Sidebar Nav sections (UNCHANGED content) */
/* لوحة المتابعة الرئيسية, تقييم الأداء, الإيرادات, المصروفات, الإدارة, المحاسبة */
```

### KPI Cards — Editorial Glow Cards

```tsx
// /src/components/ui/KPICard.tsx

interface KPICardProps {
  title: string
  value: number
  suffix?: string
  prefix?: string
  trend?: { value: number; direction: 'up' | 'down' }
  icon: ReactNode
  variant: 'success' | 'warning' | 'danger' | 'gold' | 'info'
  sparklineData?: number[]    // ✨ NEW: mini trend line inside card
  isHero?: boolean            // ✨ NEW: large editorial style
}

export function KPICard({ title, value, suffix, trend, icon, variant, sparklineData, isHero }: KPICardProps) {
  const { ref, controls } = useScrollReveal()

  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      initial="initial"
      animate={controls}
      whileHover={window.innerWidth > 768 ? cardHover.hover : undefined}
      className={`kpi-card kpi-card--${variant} ${isHero ? 'kpi-card--hero' : ''}`}
    >
      <div className="kpi-card-header">
        <div className={`kpi-icon-circle kpi-icon-circle--${variant}`}>{icon}</div>
        <span className="kpi-title">{title}</span>
      </div>

      <div className="kpi-card-body">
        <AnimatedNumber
          value={value}
          suffix={suffix ? ` ${suffix}` : ''}
          className={isHero ? 'kpi-value-hero' : 'kpi-value'}
        />

        {trend && (
          <span className={`kpi-trend kpi-trend--${trend.direction}`}>
            {trend.direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend.value).toFixed(1)}%
          </span>
        )}
      </div>

      {sparklineData && (
        <div className="kpi-sparkline">
          <Sparkline data={sparklineData} color={variantColors[variant]} />
        </div>
      )}
    </motion.div>
  )
}
```

```css
.kpi-card {
  background: var(--bg-surface);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  cursor: default;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
}

/* ✨ Glow based on variant (dark mode) */
[data-theme="dark"] .kpi-card--success { box-shadow: var(--shadow-glow-success); border-color: rgba(29,184,123,0.15); }
[data-theme="dark"] .kpi-card--danger  { box-shadow: var(--shadow-glow-danger);  border-color: rgba(232,56,77,0.15);  }
[data-theme="dark"] .kpi-card--gold,
[data-theme="dark"] .kpi-card--warning { box-shadow: var(--shadow-gold);         border-color: rgba(212,168,83,0.15); }

/* ✨ Subtle gradient overlay inside card */
.kpi-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-gold-glow);
  opacity: 0;
  transition: opacity 0.3s;
}
.kpi-card:hover::before { opacity: 1; }

/* ✨ Hero card — editorial layout */
.kpi-card--hero {
  padding: 28px;
  grid-column: span 2;
}
.kpi-card--hero .kpi-value {
  font-size: 56px;
  font-family: var(--font-display);
  letter-spacing: -0.02em;
  line-height: 1;
}

.kpi-icon-circle {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.kpi-icon-circle--success { background: var(--color-success-bg); color: var(--color-success); }
.kpi-icon-circle--warning { background: var(--color-warning-bg); color: var(--color-warning); }
.kpi-icon-circle--danger  { background: var(--color-danger-bg);  color: var(--color-danger); }
.kpi-icon-circle--gold    { background: rgba(212,168,83,0.15);   color: var(--color-primary); }

.kpi-value {
  font-size: 32px; font-weight: 700;
  font-family: var(--font-latin);
  direction: ltr; unicode-bidi: isolate;
  line-height: 1.1;
}

.kpi-trend {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 600;
  padding: 2px 8px; border-radius: 20px;
}
.kpi-trend--up   { color: var(--color-success); background: var(--color-success-bg); }
.kpi-trend--down { color: var(--color-danger);  background: var(--color-danger-bg); }

/* Sparkline container */
.kpi-sparkline {
  margin-top: 12px;
  height: 40px;
  opacity: 0.7;
}
```

---

## A12. Data Tables — Cinematic Row Experience

```css
/* Wrapper */
.data-table-wrapper {
  background: var(--bg-surface);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

/* Sticky blurred header */
.data-table thead {
  background: var(--bg-surface-2);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
}

.data-table th {
  font-size: 11px; font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 14px 16px;
  white-space: nowrap;
}

/* ✨ Row animation on mount (use Framer Motion) */
/* TableRow is wrapped in motion.tr with staggerItem variant */
.data-table td {
  padding: 14px 16px;
  font-size: 14px;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.15s ease;
}
.data-table tr:last-child td { border-bottom: none; }

/* ✨ Hover row highlight */
.data-table tbody tr { cursor: default; }
.data-table tbody tr:hover td {
  background: var(--color-primary-light);
}
[data-theme="dark"] .data-table tbody tr:hover td {
  background: rgba(212,168,83,0.06);
}

/* Amount cells (UNCHANGED) */
.col-amount {
  font-family: var(--font-latin);
  font-weight: 600;
  text-align: left;
  direction: ltr;
  unicode-bidi: isolate;
}

/* Status badges (UNCHANGED) */
.badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge-success { background: var(--color-success-bg); color: var(--color-success); }
.badge-danger  { background: var(--color-danger-bg);  color: var(--color-danger); }
.badge-warning { background: var(--color-warning-bg); color: var(--color-warning); }
.badge-info    { background: var(--color-info-bg);    color: var(--color-info); }

/* ✨ NEW: Expandable row trigger */
.row-expand-trigger { cursor: pointer; }
.row-expand-content {
  background: var(--bg-surface-2);
  border-top: 1px dashed var(--border-color);
}

/* Subscriber row coloring (UNCHANGED) */
.row-active   { border-inline-end: 3px solid var(--color-success); }
.row-expired  { border-inline-end: 3px solid var(--color-danger);  background: rgba(232,56,77,0.03); }
.row-expiring { border-inline-end: 3px solid var(--color-warning); background: rgba(245,166,35,0.04); }
```

```tsx
// ✨ Animated table rows
import { motion, AnimatePresence } from 'framer-motion'

function AnimatedTableBody({ rows }) {
  return (
    <AnimatePresence mode="popLayout">
      {rows.map((row, i) => (
        <motion.tr
          key={row.id}
          variants={staggerItem}
          initial="initial"
          animate="animate"
          exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
          custom={i}
          transition={{ delay: i * 0.04 }}
          layout
        >
          {/* cells */}
        </motion.tr>
      ))}
    </AnimatePresence>
  )
}
```

### Table Toolbar (UNCHANGED logic, visual upgrade)

```tsx
<div className="table-toolbar">
  <SearchInput placeholder="بحث..." value={search} onChange={setSearch} />
  <DateRangePicker from={from} to={to} onChange={setRange} />
  <FilterDropdown options={filterOptions} value={filter} onChange={setFilter} />
  <div style={{ flex: 1 }} />
  <Button variant="secondary" onClick={handleExport}><Download size={16} /> تصدير Excel</Button>
  <Button variant="primary"  onClick={openAddForm}><Plus size={16} /> إضافة جديد</Button>
</div>
```

```css
.table-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
}
```

---

## A13. Dashboard Hero Section — Financial Story

```tsx
// /src/features/dashboard/DashboardHero.tsx
// The first thing users see: editorial, alive, dramatic

export function DashboardHero({ totalRevenue, netProfit, date }) {
  return (
    <motion.section
      className="dashboard-hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated gradient background */}
      <div className="hero-bg" aria-hidden />

      <div className="hero-content">
        <motion.p
          className="hero-eyebrow"
          {...staggerItem}
        >
          التقرير المالي · {formatDate(date)}
        </motion.p>

        <motion.h2
          className="hero-main-label"
          {...staggerItem}
        >
          إجمالي الإيرادات
        </motion.h2>

        <AnimatedNumber
          value={totalRevenue}
          suffix="ر.س"
          className="hero-main-value display-text"
        />

        <div className="hero-secondary-stats">
          <div className="hero-stat">
            <span className="hero-stat-label">صافي الربح</span>
            <AnimatedNumber value={netProfit} suffix="ر.س" className="hero-stat-value" />
          </div>
          <div className="hero-divider" />
          <div className="hero-stat">
            <span className="hero-stat-label">هامش الربح</span>
            <AnimatedNumber value={netProfit / totalRevenue * 100} suffix="%" decimals={1} className="hero-stat-value" />
          </div>
        </div>
      </div>

      {/* Quick date presets */}
      <DateRangePresets />
    </motion.section>
  )
}
```

```css
.dashboard-hero {
  border-radius: 20px;
  padding: 40px 48px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  min-height: 220px;

  /* Cinematic gradient */
  background: var(--gradient-hero);
}

[data-theme="light"] .dashboard-hero {
  background: linear-gradient(160deg, #0D0F1A 0%, #1a1030 100%);
}

/* Animated radial glow in background */
.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(212,168,83,0.15) 0%, transparent 70%);
  animation: heroPulse 4s ease-in-out infinite alternate;
}
@keyframes heroPulse {
  from { opacity: 0.6; transform: scale(1); }
  to   { opacity: 1;   transform: scale(1.05); }
}

.hero-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(212,168,83,0.7);
  margin-bottom: 8px;
}

.hero-main-label {
  font-size: 16px;
  color: rgba(255,255,255,0.55);
  margin-bottom: 4px;
}

.hero-main-value {
  font-size: 64px;
  font-family: var(--font-display);
  font-weight: 400;
  color: #F5E8C8;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 24px;
}

.hero-secondary-stats {
  display: flex;
  align-items: center;
  gap: 28px;
}
.hero-stat-label { font-size: 12px; color: rgba(255,255,255,0.45); margin-bottom: 4px; display: block; }
.hero-stat-value { font-size: 22px; font-weight: 700; font-family: var(--font-latin); color: rgba(255,255,255,0.90); direction: ltr; }
.hero-divider    { width: 1px; height: 36px; background: rgba(255,255,255,0.10); }
```

---

## A14. Skeleton Loaders — Animated Shimmer

```css
/* ✨ Premium shimmer skeleton */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-surface-2) 25%,
    var(--bg-surface)   50%,
    var(--bg-surface-2) 75%
  );
  background-size: 400% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0%   { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

/* Skeleton variants */
.skeleton-text   { height: 14px; width: 60%; }
.skeleton-title  { height: 20px; width: 40%; }
.skeleton-kpi    { height: 100px; border-radius: 16px; }
.skeleton-row    { height: 48px; border-radius: 4px; margin-bottom: 1px; }
.skeleton-chart  { height: 240px; border-radius: 16px; }
```

---

## A15. Mobile Experience

```css
@media (max-width: 768px) {
  /* Hide desktop sidebar */
  .sidebar { display: none; }

  /* Full-width content */
  .main-content { margin-inline-start: 0 !important; }

  /* ✨ Bottom nav bar */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0; right: 0;
    height: 64px;
    background: var(--glass-bg-light);
    backdrop-filter: var(--glass-blur);
    border-top: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-around;
    z-index: 300;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .bottom-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    color: var(--text-secondary);
    padding: 8px 12px;
    border-radius: 12px;
    transition: all 0.15s;
  }
  .bottom-nav-item.active { color: var(--color-primary); }

  /* Cards instead of tables on mobile */
  .table-mobile-card {
    background: var(--bg-surface);
    border-radius: 12px;
    padding: 16px;
    border: 1px solid var(--border-color);
    margin-bottom: 12px;
    box-shadow: var(--shadow-sm);
  }

  /* 2-col KPI grid on tablet */
  .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
  /* 1-col on phone */
  @media (max-width: 480px) {
    .kpi-grid { grid-template-columns: 1fr !important; }
    .kpi-card--hero { grid-column: span 1 !important; }
  }

  /* Main content bottom padding for bottom nav */
  .main-content { padding-bottom: 80px; }
}
```

**Bottom Nav tabs (mobile):**
```
🏠 الرئيسية | 📊 الإيرادات | 🛒 المصروفات | 📋 التقارير | 👤 الحساب
```

---

## A16. JSON Data Architecture

```
/frontend/src/data/          ← ✨ NEW: static JSON for mock + fallback
  dashboard.json             ← KPI totals, date range, trend data
  revenue.json               ← Channel breakdown (Keeta/Hunger/Ninja/Restaurant/Subs)
  charts/
    revenueDaily.json        ← Daily series for area chart
    channelShare.json        ← Donut chart data
    expenseBreakdown.json    ← Bar chart categories
```

```json
// dashboard.json example
{
  "period": { "from": "2026-03-01", "to": "2026-03-31", "label": "مارس 2026" },
  "kpis": [
    {
      "id": "total_revenue",
      "title": "إجمالي الإيرادات",
      "value": 22747.78,
      "suffix": "ر.س",
      "trend": { "value": 12.3, "direction": "up" },
      "variant": "gold",
      "sparkline": [180, 210, 195, 240, 220, 280, 260, 310, 290, 320]
    },
    {
      "id": "net_profit",
      "title": "صافي الربح",
      "value": 8247.22,
      "suffix": "ر.س",
      "trend": { "value": 8.7, "direction": "up" },
      "variant": "success",
      "sparkline": [60, 75, 70, 90, 80, 105, 95, 115, 105, 120]
    },
    {
      "id": "total_expenses",
      "title": "إجمالي المصروفات",
      "value": 14500.56,
      "suffix": "ر.س",
      "trend": { "value": 3.2, "direction": "up" },
      "variant": "warning",
      "sparkline": [120, 135, 125, 150, 140, 175, 165, 195, 185, 200]
    },
    {
      "id": "profit_margin",
      "title": "هامش الربح",
      "value": 36.25,
      "suffix": "%",
      "trend": { "value": 1.4, "direction": "down" },
      "variant": "info",
      "sparkline": [38, 37, 38, 36, 37, 35, 36, 37, 36, 36]
    }
  ]
}
```

---

## A17. Excel Export (UNCHANGED)

```typescript
// /src/hooks/useExport.ts — identical to original FULLSTACK_SKILLS.md A10
// All business logic preserved exactly as specified
```

| Screen | Filename | Sheet |
|--------|----------|-------|
| إيرادات التوصيل | `delivery_revenue` | إيرادات التوصيل |
| إيرادات المطعم | `restaurant_revenue` | إيرادات المطعم |
| إيرادات الاشتراكات | `subscription_revenue` | الاشتراكات |
| المشتريات | `purchases` | فواتير المشتريات |
| المصروفات | `expenses` | المصروفات |
| متابعة الاشتراكات | `subscribers` | قائمة المشتركين |
| الأستاذ العام | `general_ledger` | الأستاذ العام |
| ميزان المراجعة | `trial_balance` | ميزان المراجعة |
| قائمة الدخل | `income_statement` | قائمة الدخل |
| تقارير الموردين | `supplier_ledger` | كشف المورد |

---

## A18. Frontend Tech Stack — Updated

| Layer | Library | Version | Reason |
|-------|---------|---------|--------|
| Framework | React + TypeScript | 18.x | Unchanged |
| Build | Vite | 5.x | Unchanged |
| Styling | TailwindCSS + CSS Variables | v3 | Unchanged |
| **Animation** | **Framer Motion** | **latest** | ✨ Page transitions, scroll reveals, hover |
| **Number Anim** | **@react-spring/web** | **latest** | ✨ KPI number countup |
| **Intersection** | **react-intersection-observer** | **latest** | ✨ Scroll reveal triggers |
| Data Fetching | TanStack Query | v5 | Unchanged |
| Forms | React Hook Form + Zod | latest | Unchanged |
| Charts | Recharts | latest | Unchanged |
| Icons | lucide-react | 0.383.0 | Unchanged |
| Excel | SheetJS (xlsx) | latest | Unchanged |
| PDF | Backend (Puppeteer) | — | Unchanged |
| Toasts | sonner | latest | Unchanged |
| Date Picker | react-day-picker | v8 | Unchanged |
| Table | TanStack Table | v8 | Unchanged |
| Router | React Router | v6 | Unchanged |
| i18n | react-i18next | latest | Unchanged |
| State | Zustand | latest | Unchanged |
| HTTP | Axios | latest | Unchanged |

---

## A19. Frontend File Structure — Updated

```
/frontend/src
  /assets
    /fonts            ← IBM Plex Sans Arabic woff2 (self-hosted, UNCHANGED)
    /icons            ← Logo SVG
  /data               ← ✨ NEW: JSON data files
    dashboard.json
    revenue.json
    /charts
      revenueDaily.json
      channelShare.json
  /components
    /ui               ← Shared design system
      Button.tsx
      Input.tsx              ← Updated: floating label variant
      Select.tsx
      Textarea.tsx
      Badge.tsx
      Card.tsx
      DataTable.tsx          ← Updated: animated rows
      TableToolbar.tsx
      FormCard.tsx           ← Updated: section grouping
      KPICard.tsx            ← Updated: glow + sparkline + AnimatedNumber
      AlertBanner.tsx        ← Updated: animated dismiss
      ConfirmDialog.tsx
      EmptyState.tsx
      Skeleton.tsx           ← Updated: shimmer animation
      ThemeToggle.tsx
      LanguageToggle.tsx
      Breadcrumb.tsx
      NotificationBell.tsx
      AnimatedNumber.tsx     ← ✨ NEW
      Sparkline.tsx          ← ✨ NEW
      PageTransition.tsx     ← ✨ NEW
    /layout
      AppShell.tsx
      Sidebar.tsx            ← Updated: glassmorphism, expand/collapse
      Topbar.tsx             ← Updated: glass, animated title
      PageHeader.tsx
      BottomNav.tsx          ← ✨ NEW (mobile)
  /features           ← One folder per domain (UNCHANGED structure)
    /dashboard
      DashboardHero.tsx      ← ✨ NEW: editorial hero section
      DashboardKPIGrid.tsx
      DashboardCharts.tsx
    /revenue
      /delivery
      /restaurant
      /subscriptions
    /purchases
    /expenses
    /petty-cash
    /subscribers
    /production
    /accounting
      /journal
      /ledger
      /trial-balance
      /income-statement
      /balance-sheet
      /cash-flow
    /suppliers
    /reports
    /auth
  /hooks
    useTheme.ts
    useLanguage.ts
    useAuth.ts
    useExport.ts
    useDebounce.ts
    useScrollReveal.ts       ← ✨ NEW
    useAnimatedCounter.ts    ← ✨ NEW
  /lib
    api.ts
    queryClient.ts
    utils.ts                 ← formatSAR, formatDate, formatPct (UNCHANGED)
    i18n.ts
    animations.ts            ← ✨ NEW: all Framer Motion variants
  /store
    authStore.ts
  /workers
    excelExport.worker.ts
  /types
    api.types.ts
    domain.types.ts
```

---

## A20. Role-Based UI (UNCHANGED)

```tsx
// IDENTICAL to original — business logic untouched
const PERMISSIONS = {
  admin:      { canViewAll: true,  canWrite: true,  canDelete: true,  canManageUsers: true },
  accountant: { canViewAll: true,  canWrite: true,  canDelete: false, canManageUsers: false },
  cashier:    { canViewAll: false, canWrite: true,  canDelete: false, canManageUsers: false },
}

{role !== 'cashier' && <AccountingNavSection />}
<Button variant="danger" disabled={!can('delete')}>حذف</Button>
<ProtectedRoute allowedRoles={['admin', 'accountant']} redirectTo="/dashboard" />
```

---

## A21. Sidebar Nav Sections (UNCHANGED)

```
🏠  لوحة المتابعة الرئيسية
📊  تقييم الأداء المالي
📋  التقارير والتحليلات

── الإيرادات ──────────────
🚗  إيرادات التوصيل
🍽️  إيرادات المطعم
📦  إيرادات الاشتراكات

── المصروفات ──────────────
🛒  إدخال المشتريات
💼  إدخال المصروفات
💰  العهدة (الصندوق)

── الإدارة ────────────────
👥  الموردين
📋  متابعة الاشتراكات
🏭  متابعة الإنتاج والتالف

── المحاسبة ───────────────
📖  دليل الحسابات
📝  قيود اليومية
📚  الأستاذ العام
⚖️  ميزان المراجعة
💰  قائمة الدخل
🏦  المركز المالي
💧  التدفقات النقدية
```

---

# ══════════════════════════════════════════════════════
# PART B — 🗄️ BACKEND (100% UNCHANGED)
# ══════════════════════════════════════════════════════

> **The entire backend is preserved exactly as in the original FULLSTACK_SKILLS.md.**
> No logic, API contract, schema, validation, or business rule has been modified.
> All sections B1–B14 from FULLSTACK_SKILLS.md apply unchanged.
> Only reference the original for backend specifications.

**Backend stack summary (for convenience):**
- Runtime: Node.js 20 LTS + TypeScript strict
- Framework: Express.js 4.x
- ORM: Drizzle ORM (type-safe, schema-as-code)
- Database: PostgreSQL 16
- Auth: JWT + bcrypt + HttpOnly cookie refresh tokens
- Validation: Zod (shared schemas with frontend)
- PDF: Puppeteer (server-side Arabic font embedding)
- Logging: Pino (structured JSON)
- Testing: Vitest + Supertest
- Cron: node-cron (Asia/Riyadh timezone)

**Key API modules (unchanged):**
`/api/v1/` → auth, accounts, suppliers, purchases, revenue (delivery/restaurant/subscriptions), expenses, petty-cash, production, subscribers, journal, reports, audit-log

**Business rules (unchanged):**
- VAT rate: 15% (ZATCA)
- Double-entry accounting enforced (debit === credit)
- All monetary amounts: decimal(12, 4)
- Number display: en-US locale (English digits)
- Timezone: Asia/Riyadh

---

# ══════════════════════════════════════════════════════
# PART C — 📋 CHANGES SUMMARY (UPDATED)
# ══════════════════════════════════════════════════════

## C1. Frontend — UI Redesign Additions

| # | Type | Description |
|---|------|-------------|
| 1 | ✨ New | **Animation system** — Framer Motion page transitions, stagger reveals |
| 2 | ✨ New | **AnimatedNumber** — KPI values count up on first render (@react-spring/web) |
| 3 | ✨ New | **Floating labels** — premium input UX replacing static labels |
| 4 | ✨ New | **Glassmorphism sidebar** — floating, blur, collapsible icon-only mode |
| 5 | ✨ New | **Dashboard Hero** — full-width editorial section with glowing gradient |
| 6 | ✨ New | **KPI card sparklines** — mini trend line inside each KPI card |
| 7 | ✨ New | **KPI glow effects** — success/danger/gold glows in dark mode |
| 8 | ✨ New | **Animated table rows** — staggered fade+slide on data load |
| 9 | ✨ New | **Expandable rows** — inline detail expansion with animation |
| 10 | ✨ New | **Scroll reveal** — sections animate in as user scrolls |
| 11 | ✨ New | **Hero KPI** — editorial-sized `display-text` first KPI block |
| 12 | ✨ New | **Form section grouping** — numbered steps, section headers |
| 13 | ✨ New | **Shimmer skeletons** — gradient animation replace static grey |
| 14 | ✨ New | **BottomNav** — mobile bottom navigation bar |
| 15 | ✨ New | **JSON data layer** — /data/*.json files for KPIs and charts |
| 16 | ✨ New | **Instrument Serif** — display font for editorial moments only |
| 17 | ✨ New | **Dark mode as default** — `localStorage('theme') ?? 'dark'` |
| 18 | ✨ New | **Warm ivory light mode** — #F4F3EF page bg instead of cold white |
| 19 | ✨ New | **Gold shimmer on btn-primary** — hover sweeping light effect |
| 20 | ✨ New | **Topbar glass** — backdrop blur, animated page title transitions |

## C2. Frontend — All Original Additions Preserved (from original FULLSTACK_SKILLS.md C1)

| # | Feature |
|---|---------|
| 1 | Dashboard date range picker with quick presets |
| 2 | Auto-save form drafts to sessionStorage every 30s |
| 3 | Keyboard shortcuts: Alt+N / Alt+S / Alt+E / Esc |
| 4 | Skeleton loading states |
| 5 | Breadcrumb navigation |
| 6 | Notifications bell |
| 7 | Supplier quick-stats card |
| 8 | Mobile responsive |
| 9 | Print stylesheet |
| 10 | Excel Web Worker export |
| 11 | AR/EN language toggle |
| 12 | Light/Dark mode toggle |
| 13 | VAT display: 3 readonly rows |
| 14 | Journal real-time balance |
| 15 | English digits throughout |
| 16 | LTR-isolated amount columns |
| 17 | Accessibility (aria-label, role="alert") |
| 18 | Route lazy-loading |

## C3. Backend — Unchanged (All from original FULLSTACK_SKILLS.md C2)

All 26 backend additions and fixes from the original FULLSTACK_SKILLS.md are preserved identically. See original document sections B3–B12.

## C4. Architecture Decisions (Unchanged + New)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Excel Export | **Frontend (SheetJS)** | Unchanged |
| PDF Export | **Backend (Puppeteer)** | Unchanged |
| ORM | **Drizzle ORM** | Unchanged |
| Logger | **Pino** | Unchanged |
| Test Framework | **Vitest** | Unchanged |
| Token Delivery | **HttpOnly Cookie** | Unchanged |
| Number Display | **English digits always** | Unchanged |
| Body Font | **IBM Plex Sans Arabic** | Unchanged |
| Display Font | **Instrument Serif** | ✨ NEW: editorial hero moments only |
| Animation | **Framer Motion** | ✨ NEW: page transitions + reveals |
| Number Animation | **@react-spring/web** | ✨ NEW: KPI countup |
| Default Theme | **Dark mode** | ✨ NEW: luxury first-impression |
| Sidebar | **Floating glass, collapsible** | ✨ NEW: 80px icon → 280px expanded |
| Cron Timezone | **Asia/Riyadh** | Unchanged |

---

# ══════════════════════════════════════════════════════
# PART D — 🛠️ IMPLEMENTATION CHECKLIST
# ══════════════════════════════════════════════════════

## D1. Quick Start — New Developer Onboarding

```bash
# 1. Read this file completely before touching any code
# 2. Backend setup (unchanged from original):
cd backend && npm install && cp .env.example .env && npm run db:migrate && npm run db:seed && npm run dev

# 3. Frontend setup (updated):
cd frontend && npm install
# Install new animation deps:
npm install framer-motion @react-spring/web react-intersection-observer
# Fonts: copy IBM Plex Sans Arabic woff2 files to /frontend/public/fonts/
npm run dev
```

## D2. Component Priority Order

Build in this order for fastest visual impact:

1. `Sidebar.tsx` — glass effect, collapse/expand animation
2. `Topbar.tsx` — glass blur, animated title
3. `animations.ts` — central animation config
4. `AnimatedNumber.tsx` — KPI countup
5. `KPICard.tsx` — glow + sparkline + hover
6. `DashboardHero.tsx` — editorial hero section
7. `PageTransition.tsx` — wrap all routes
8. `DataTable.tsx` — animated rows
9. All form inputs — floating labels
10. `BottomNav.tsx` — mobile tab bar
11. Skeleton shimmer updates

## D3. Design QA Checklist

Before shipping any page:
- [ ] Dark mode: glows visible, no harsh whites, gold accents glow
- [ ] Light mode: warm ivory bg, not cold white
- [ ] RTL: sidebar on right, text right-aligned, amounts LTR-isolated
- [ ] Arabic: font renders correctly, no Latin fallback on Arabic text
- [ ] Numbers: all amounts in Latin font, `en-US` locale, `direction: ltr`
- [ ] Animations: page enter, card hover lift, table row stagger
- [ ] KPI: numbers count up on page load
- [ ] Mobile (< 768px): bottom nav visible, tables replaced by cards
- [ ] Print: sidebar hidden, clean layout
- [ ] Keyboard: Alt+N / Alt+S / Alt+E / Esc work
- [ ] Accessibility: all icon buttons have `aria-label`

---

*This SKILLS.md is the single source of truth for the complete مطعم مستر صحي system.*
*It supersedes FULLSTACK_SKILLS.md for UI/UX decisions.*
*Backend architecture, API contracts, and all business logic remain as specified in FULLSTACK_SKILLS.md.*
*Last updated: 2026-03-20*
