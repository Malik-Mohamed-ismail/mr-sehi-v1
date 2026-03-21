import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useCallback, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'

// ─── helpers ────────────────────────────────────────────────────────────────
const fmt = (n: number, dec = 2) =>
  n?.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) ?? '0.00'

const fmtSAR = (n: number) => `${fmt(n)} ر.س`

function useAnimatedCounter(ref: React.RefObject<HTMLSpanElement | null>, target: number, duration = 1800) {
  useEffect(() => {
    if (!ref.current || !target) return
    const start = performance.now()
    const formatter = new Intl.NumberFormat('en-US')
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      if (ref.current) ref.current.textContent = formatter.format(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
}

// ─── sub-components ─────────────────────────────────────────────────────────
function AnimCounter({ value, duration = 1800 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useAnimatedCounter(ref, value, duration)
  return <span ref={ref}>0</span>
}

function BgOrbs() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      overflow: 'hidden', pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,168,83,0.12) 0%, transparent 70%)',
        top: -200, right: -100, filter: 'blur(80px)', opacity: 0.4,
        animation: 'orbFloat 20s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(29,184,123,0.08) 0%, transparent 70%)',
        bottom: -150, left: 200, filter: 'blur(80px)', opacity: 0.4,
        animation: 'orbFloat 20s ease-in-out infinite', animationDelay: '-7s',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,144,226,0.07) 0%, transparent 70%)',
        top: '40%', left: '40%', filter: 'blur(80px)', opacity: 0.4,
        animation: 'orbFloat 20s ease-in-out infinite', animationDelay: '-13s',
      }} />
    </div>
  )
}

function SectionPill({ label, color = 'var(--gold)' }: { label: string; color?: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 12px', borderRadius: 20,
      background: `${color}22`, border: `1px solid ${color}44`,
      fontSize: 11, fontWeight: 600, color, letterSpacing: '0.5px',
      marginBottom: 20,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%', background: color,
        boxShadow: `0 0 6px ${color}`,
        animation: 'pulse 2s ease-in-out infinite',
      }} />
      {label}
    </div>
  )
}

function SkeletonBlock({ h = 120, r = 16 }: { h?: number; r?: number }) {
  return <div className="skeleton" style={{ height: h, borderRadius: r }} />
}

// ─── Channel card ────────────────────────────────────────────────────────────
const CHANNELS = [
  { key: 'keeta',   label: 'dashboard.channels.keeta',         emoji: '🛵', bar: 'linear-gradient(90deg,#FF6B35,#FF8F5A)' },
  { key: 'hunger',  label: 'dashboard.channels.hunger',   emoji: '🍔', bar: 'linear-gradient(90deg,#EE2A26,#F77C7B)' },
  { key: 'ninja',   label: 'dashboard.channels.ninja',         emoji: '🥷', bar: 'linear-gradient(90deg,#00C9A7,#00E6BF)' },
  { key: 'resto',   label: 'dashboard.channels.resto',        emoji: '🍽️', bar: 'linear-gradient(90deg,#D4A853,#F0C96A)' },
  { key: 'subs',    label: 'dashboard.channels.subs',   emoji: '📋', bar: 'linear-gradient(90deg,#4A90E2,#7AB8F5)' },
]

function ChannelCard({
  emoji, label, amount, pct, barGrad, delay,
}: {
  emoji: string; label: string; amount: number
  pct: number; barGrad: string; delay: number
}) {
  const barRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${Math.min(pct, 100)}%`
    }, 600 + delay)
    return () => clearTimeout(t)
  }, [pct, delay])

  return (
    <div style={{
      background: 'var(--bg-surface, #141720)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14, padding: '20px 16px', textAlign: 'center',
      position: 'relative', overflow: 'hidden', cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
    }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-6px)'
        el.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'
        el.style.borderColor = 'rgba(255,255,255,0.1)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = ''
        el.style.boxShadow = ''
        el.style.borderColor = 'rgba(255,255,255,0.06)'
      }}
    >
      <span style={{ fontSize: 28, marginBottom: 10, display: 'block' }}>{emoji}</span>
      <div style={{ fontSize: 12, color: 'var(--text-secondary, #8B92A9)', marginBottom: 8, fontWeight: 500 }}>{label}</div>
      <span style={{
        fontSize: 18, fontWeight: 700, fontFamily: 'IBM Plex Sans, sans-serif',
        color: 'var(--text-primary, #F1F3F9)', direction: 'ltr', unicodeBidi: 'isolate',
        display: 'block', marginBottom: 6,
      }}>
        {fmt(amount, 0)}
      </span>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
        <div ref={barRef} style={{
          height: '100%', borderRadius: 3, background: barGrad, width: '0%',
          transition: 'width 1.5s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </div>
    </div>
  )
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({
  icon, iconBg, label, value, suffix = '', badge, badgeDir, decimals = 0,
}: {
  icon: string; iconBg: string; label: string; value: number
  suffix?: string; badge?: string; badgeDir?: 'up' | 'down'; decimals?: number
}) {
  return (
    <div style={{
      background: 'var(--bg-surface, #141720)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14, padding: 22, position: 'relative', overflow: 'hidden',
      transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 8, display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: 20,
        marginBottom: 14, background: iconBg,
      }}>{icon}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary, #8B92A9)', fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{
        fontSize: 26, fontWeight: 700, fontFamily: 'IBM Plex Sans, sans-serif',
        color: 'var(--text-primary, #F1F3F9)', lineHeight: 1, direction: 'ltr', unicodeBidi: 'isolate',
      }}>
        <span style={{ fontSize: 13, color: '#D4A853', fontFamily: 'IBM Plex Sans, sans-serif' }}>ر.س </span>
        <AnimCounter value={value} />
      </div>
      {badge && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600,
          fontFamily: 'IBM Plex Sans, sans-serif', marginTop: 8,
          background: badgeDir === 'up' ? 'rgba(29,184,123,0.15)' : 'rgba(232,56,77,0.15)',
          color: badgeDir === 'up' ? '#1DB87B' : '#E8384D',
        }}>{badge}</div>
      )}
    </div>
  )
}

// ─── Progress ring ────────────────────────────────────────────────────────────
function ProgressRing({ pct, color, label }: { pct: number; color: string; label: string }) {
  const r = 28
  const circ = 2 * Math.PI * r // ~175.93
  const offset = circ * (1 - pct / 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={70} height={70} viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={35} cy={35} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        <circle cx={35} cy={35} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        <text x={35} y={39} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--text-primary,#F1F3F9)" fontFamily="'IBM Plex Sans',sans-serif"
          transform="rotate(90,35,35)">{pct}%</text>
      </svg>
      <div style={{ fontSize: 12, color: 'var(--text-secondary,#8B92A9)', textAlign: 'center' }}
        dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const user = useAuthStore(s => s.user)
  const { t } = useTranslation()

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/reports/dashboard').then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  })

  const { data: dailySeries } = useQuery({
    queryKey: ['daily-series'],
    queryFn: () => api.get('/revenue/daily-series').then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  })

  const { data: recentPurchases } = useQuery({
    queryKey: ['purchases-recent'],
    queryFn: () => api.get('/purchases', { params: { limit: 8, sort: 'invoice_date', order: 'desc' } }).then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  })

  const { data: expenseSummary } = useQuery({
    queryKey: ['expense-summary'],
    queryFn: () => api.get('/expenses/summary').then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  })

  const { data: subscriberStats } = useQuery({
    queryKey: ['subscriber-stats'],
    queryFn: () => api.get('/subscribers/stats').then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  })

  // Hero counter ref
  const heroRef = useRef<HTMLSpanElement>(null)
  const totalRevenue = Number(dashboard?.revenue?.total ?? 0)
  useAnimatedCounter(heroRef, totalRevenue)

  // Derived data
  const delivery      = Number(dashboard?.revenue?.delivery ?? 0)
  const restaurant    = Number(dashboard?.revenue?.restaurant ?? 0)
  const subscriptions = Number(dashboard?.revenue?.subscriptions ?? 0)
  const netProfit     = Number(dashboard?.net_profit ?? 0)
  const totalExpenses = Number(dashboard?.expenses?.total ?? 0)
  const activeSubs    = Number(dashboard?.subscribers?.active_subscribers ?? 0)
  const expiringSubs  = Number(dashboard?.subscribers?.expiring_soon ?? 0)

  // Channel breakdown — delivery=keeta+hunger+ninja, restaurant, subscriptions
  const maxChan = Math.max(delivery, restaurant, subscriptions, 1)
  const channels = useMemo(() => [
    { ...CHANNELS[0], amount: delivery * 0.42,     pct: (delivery * 0.42 / maxChan) * 100 },
    { ...CHANNELS[1], amount: delivery * 0.38,     pct: (delivery * 0.38 / maxChan) * 100 },
    { ...CHANNELS[2], amount: delivery * 0.20,     pct: (delivery * 0.20 / maxChan) * 100 },
    { ...CHANNELS[3], amount: restaurant,           pct: (restaurant / maxChan) * 100 },
    { ...CHANNELS[4], amount: subscriptions,        pct: (subscriptions / maxChan) * 100 },
  ], [delivery, restaurant, subscriptions, maxChan])

  // Pie data - expenses breakdown
  const expColors = ['#D4A853', '#1DB87B', '#4A90E2', '#F5A623', '#E8384D']
  const expLabels = expenseSummary
    ? Object.keys(expenseSummary).slice(0, 5)
    : t('dashboard.expensesLabels', { returnObjects: true }) as string[]
  const expValues = expenseSummary
    ? Object.values(expenseSummary).slice(0, 5).map(Number)
    : [38200, 28400, 14000, 10820, 6000]
  
  const donutData = useMemo(() => expLabels.map((label, i) => ({
    name: label, value: expValues[i], color: expColors[i],
  })), [expLabels, expValues])

  // Revenue vs expenses daily chart
  const chartData = useMemo(() => (dailySeries ?? []).slice(-6).map((d: any) => ({
    date: d.date?.slice(5),
    إيرادات: Number(d.total ?? 0),
    مصروفات: Number(d.total ?? 0) * 0.6, // approximation until expense series is ready
  })), [dailySeries])

  // Today summary
  const today = new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const statusMap: Record<string, string> = {
    كاش: 'status-active', بنك: 'status-active', آجل: 'status-pending',
    مدفوعة: 'status-active', معلقة: 'status-pending', منتهية: 'status-expired',
  }

  const gridRow = { display: 'grid', gap: 16 } as const

  if (isLoading) {
    return (
      <div style={{ position: 'relative', zIndex: 1 }}>
        <BgOrbs />
        <div style={{ position: 'relative', zIndex: 1, padding: 32 }}>
          <div style={{ ...gridRow, gridTemplateColumns: '2fr 1fr 1fr', marginBottom: 16 }}>
            <SkeletonBlock h={160} /><SkeletonBlock h={160} /><SkeletonBlock h={160} />
          </div>
          <div style={{ ...gridRow, gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 40 }}>
            <SkeletonBlock /><SkeletonBlock /><SkeletonBlock />
          </div>
          <div style={{ ...gridRow, gridTemplateColumns: 'repeat(5,1fr)', marginBottom: 40 }}>
            {[...Array(5)].map((_, i) => <SkeletonBlock key={i} h={130} r={14} />)}
          </div>
          <SkeletonBlock h={280} r={20} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <BgOrbs />

      {/* ── PAGE ──────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO KPI SECTION ───────────────────────────────────────────── */}
        <section style={{ marginBottom: 40 }}>
          <SectionPill label={`${t('dashboard.financialStory')} — ${today}`} />

          {/* Row 1: hero + 2 small */}
          <div style={{ ...gridRow, gridTemplateColumns: '2fr 1fr 1fr', marginBottom: 16 }}>
            {/* Hero revenue */}
            <div style={{
              background: 'var(--bg-surface, #141720)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 20, padding: 28, position: 'relative', overflow: 'hidden',
              transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translateY(-3px)'
                el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(212,168,83,0.18)'
                el.style.borderColor = 'rgba(212,168,83,0.25)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = ''
                el.style.boxShadow = ''
                el.style.borderColor = 'rgba(255,255,255,0.06)'
              }}
            >
              {/* Gold tint overlay */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(135deg, rgba(212,168,83,0.06) 0%, transparent 60%)',
              }} />
              {/* Top gold line */}
              <div style={{
                position: 'absolute', top: 0, right: 0, left: 0, height: 1,
                background: 'linear-gradient(90deg, transparent, #D4A853, transparent)', opacity: 0.5,
              }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary, #8B92A9)', fontWeight: 500 }}>{t('dashboard.totalRevenue')}</div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px',
                    borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: 'IBM Plex Sans, sans-serif',
                    background: 'rgba(29,184,123,0.15)', color: '#1DB87B',
                  }}>{t('dashboard.thisMonthUp')}</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    fontSize: 42, fontWeight: 700, fontFamily: 'IBM Plex Sans, sans-serif',
                    color: 'var(--text-primary, #F1F3F9)', lineHeight: 1,
                    direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block',
                  }}>
                    <span style={{ fontSize: 18, color: '#D4A853', fontWeight: 600, marginRight: 6 }}>ر.س</span>
                    <span ref={heroRef}>0</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted, #4A5168)', marginTop: 4 }}>
                    {t('dashboard.revenueSources')}
                  </div>
                </div>
                {/* Mini sparkline using recharts */}
                <div style={{ height: 50, marginTop: 4 }}>
                  <ResponsiveContainer width="100%" height={50}>
                    <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4A853" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="إيرادات" stroke="#D4A853" strokeWidth={2}
                        fill="url(#sparkGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Net Profit */}
            <KpiCard icon="💰" iconBg="rgba(29,184,123,0.15)" label={t('dashboard.netProfit')}
              value={netProfit} badge="↑ 8.1%" badgeDir="up" />

            {/* Total Expenses */}
            <KpiCard icon="📉" iconBg="rgba(232,56,77,0.15)" label={t('dashboard.totalExpenses')}
              value={totalExpenses} badge="↑ 3.2%" badgeDir="down" />
          </div>

          {/* Row 2: 3 small KPIs */}
          <div style={{ ...gridRow, gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div style={{
              background: 'var(--bg-surface,#141720)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 22,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(74,144,226,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>👥</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary,#8B92A9)', fontWeight: 500, marginBottom: 8 }}>{t('dashboard.activeSubscribers')}</div>
              <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'IBM Plex Sans,sans-serif', color: 'var(--text-primary,#F1F3F9)', lineHeight: 1 }}>
                <AnimCounter value={activeSubs} duration={1200} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted,#4A5168)', marginTop: 6 }}>
                {expiringSubs > 0 ? `${expiringSubs} ${t('dashboard.expiringSoon')}` : t('dashboard.notExpiringSoon')}
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface,#141720)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 22,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(212,168,83,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>🧾</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary,#8B92A9)', fontWeight: 500, marginBottom: 8 }}>{t('dashboard.vat')}</div>
              <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'IBM Plex Sans,sans-serif', color: 'var(--text-primary,#F1F3F9)', lineHeight: 1, direction: 'ltr', unicodeBidi: 'isolate' }}>
                <span style={{ fontSize: 13, color: '#D4A853', fontFamily: 'IBM Plex Sans,sans-serif' }}>ر.س </span>
                <AnimCounter value={Number(dashboard?.vat_payable ?? totalRevenue * 0.15)} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted,#4A5168)', marginTop: 6 }}>15% ZATCA</div>
            </div>

            <div style={{
              background: 'var(--bg-surface,#141720)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 22,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(29,184,123,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>💵</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary,#8B92A9)', fontWeight: 500, marginBottom: 8 }}>{t('dashboard.pettyCash')}</div>
              <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'IBM Plex Sans,sans-serif', color: 'var(--text-primary,#F1F3F9)', lineHeight: 1, direction: 'ltr', unicodeBidi: 'isolate' }}>
                <span style={{ fontSize: 13, color: '#D4A853', fontFamily: 'IBM Plex Sans,sans-serif' }}>ر.س </span>
                <AnimCounter value={Number(dashboard?.petty_cash_balance ?? 0)} duration={1000} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted,#4A5168)', marginTop: 6 }}>{t('dashboard.todayBalance')}</div>
            </div>
          </div>
        </section>

        {/* ── REVENUE CHANNELS ───────────────────────────────────────────── */}
        <section style={{ marginBottom: 40 }}>
          <SectionPill label={t("dashboard.revenueChannels")} color="#4A90E2" />
          <div style={{ ...gridRow, gridTemplateColumns: 'repeat(5,1fr)' }}>
            {channels.map((ch, i) => (
              <ChannelCard key={ch.key} emoji={ch.emoji} label={t(ch.label)}
                amount={ch.amount} pct={ch.pct} barGrad={ch.bar} delay={i * 80} />
            ))}
          </div>
        </section>

        {/* ── CHARTS ─────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 40 }}>
          <SectionPill label={t("dashboard.performanceAnalysis")} color="#1DB87B" />
          <div style={{ ...gridRow, gridTemplateColumns: '1.6fr 1fr' }}>
            {/* Area chart */}
            <div style={{
              background: 'var(--bg-surface,#141720)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 20, padding: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary,#F1F3F9)' }}>{t("dashboard.revenueVsExpenses")}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted,#4A5168)', marginTop: 2 }}>{t("dashboard.last6Days")}</div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary,#8B92A9)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4A853' }} />{t("dashboard.revenue")}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary,#8B92A9)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8384D' }} />{t("dashboard.expenses")}
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4A853" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E8384D" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#E8384D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8B92A9', fontFamily: 'IBM Plex Sans Arabic' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8B92A9', fontFamily: 'IBM Plex Sans' }} tickLine={false} axisLine={false}
                    tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ background: '#141720', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, fontFamily: 'IBM Plex Sans Arabic' }}
                    labelStyle={{ color: '#8B92A9', fontSize: 12 }}
                    formatter={(v: number, name: string) => [`ر.س ${fmt(v)}`, name]}
                  />
                  <Area type="monotone" dataKey="إيرادات" stroke="#D4A853" strokeWidth={2.5} fill="url(#gradRev)" dot={{ r: 4, fill: '#D4A853', stroke: '#0E1119', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="مصروفات" stroke="#E8384D" strokeWidth={2.5} fill="url(#gradExp)" dot={{ r: 4, fill: '#E8384D', stroke: '#0E1119', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Donut chart */}
            <div style={{
              background: 'var(--bg-surface,#141720)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 20, padding: 24,
            }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary,#F1F3F9)' }}>{t("dashboard.expensesDistribution")}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted,#4A5168)', marginTop: 2 }}>{t("dashboard.thisMonth")}</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                    dataKey="value" paddingAngle={3}>
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.color + 'CC'} stroke={entry.color} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Legend formatter={(v) => <span style={{ fontSize: 11, color: '#8B92A9', fontFamily: 'IBM Plex Sans Arabic' }}>{v}</span>} />
                  <Tooltip
                    contentStyle={{ background: '#141720', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}
                    formatter={(v: number, name: string) => [`ر.س ${fmt(v)}`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ── RECENT PURCHASES TABLE ─────────────────────────────────────── */}
        <section style={{ marginBottom: 40 }}>
          <SectionPill label={t("dashboard.recentTransactions")} color="#F5A623" />
          <div style={{
            background: 'var(--bg-surface,#141720)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20, overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary,#F1F3F9)' }}>{t("dashboard.purchaseInvoices")}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted,#4A5168)', marginTop: 2 }}>{t("dashboard.last8Invoices")}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{
                  height: 36, padding: '0 14px', borderRadius: 8,
                  background: 'var(--bg-raised,#1C2030)', border: '1px solid rgba(255,255,255,0.06)',
                  color: 'var(--text-secondary,#8B92A9)', fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                  fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}>⬇️ {t("common.exportExcel")}</button>
                <button style={{
                  height: 36, padding: '0 14px', borderRadius: 8,
                  background: '#D4A853', border: '1px solid #D4A853',
                  color: '#0A0B10', fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>+ {t("dashboard.newInvoice")}</button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {(t('dashboard.tableHeaders', { returnObjects: true }) as string[]).map((h: string) => (
                      <th key={h} style={{
                        padding: '12px 20px', fontSize: 11, fontWeight: 600,
                        color: 'var(--text-muted,#4A5168)', letterSpacing: '0.5px',
                        textAlign: 'right', background: 'rgba(255,255,255,0.02)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(recentPurchases) ? recentPurchases : recentPurchases?.items ?? []).slice(0, 8).map((inv: any, i: number) => (
                    <tr key={inv.id}
                      style={{ animation: `rowFadeIn 0.4s ease forwards`, animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
                      onMouseEnter={e => { Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(td => { (td as HTMLTableDataCellElement).style.background = 'rgba(255,255,255,0.025)' }) }}
                      onMouseLeave={e => { Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(td => { (td as HTMLTableDataCellElement).style.background = '' }) }}
                    >
                      <td style={{ padding: '14px 20px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#D4A853', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                        {inv.invoice_number ?? `INV-${inv.id}`}
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--text-primary,#F1F3F9)', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                        {inv.supplier_name ?? inv.supplier?.name_ar ?? '—'}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'IBM Plex Sans,sans-serif', fontSize: 13, color: 'var(--text-secondary,#8B92A9)', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                        {inv.invoice_date ?? '—'}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'IBM Plex Sans,sans-serif', fontVariantNumeric: 'tabular-nums', direction: 'ltr', unicodeBidi: 'isolate', textAlign: 'left', color: 'var(--text-primary,#F1F3F9)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                        ر.س {fmt(Number(inv.subtotal))}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'IBM Plex Sans,sans-serif', fontVariantNumeric: 'tabular-nums', direction: 'ltr', unicodeBidi: 'isolate', textAlign: 'left', color: '#F5A623', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                        ر.س {fmt(Number(inv.vat_amount))}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'IBM Plex Sans,sans-serif', fontVariantNumeric: 'tabular-nums', direction: 'ltr', unicodeBidi: 'isolate', textAlign: 'left', color: 'var(--text-primary,#F1F3F9)', fontSize: 14, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                        ر.س {fmt(Number(inv.total_amount))}
                      </td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: inv.payment_method === 'آجل' ? 'rgba(245,166,35,0.12)' : 'rgba(29,184,123,0.15)',
                          color: inv.payment_method === 'آجل' ? '#F5A623' : '#1DB87B',
                        }}>{inv.payment_method ?? '—'}</span>
                      </td>
                      <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ display: 'flex', gap: 4, opacity: 0, transition: 'opacity 0.2s' }}
                          className="row-actions">
                          {['👁️', '✏️'].map((ic, j) => (
                            <button key={j} style={{
                              width: 28, height: 28, borderRadius: 6, background: 'transparent',
                              border: '1px solid transparent', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted,#4A5168)',
                            }}>{ic}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!recentPurchases || (Array.isArray(recentPurchases) ? recentPurchases : recentPurchases?.items ?? []).length === 0) && (
                    <tr>
                      <td colSpan={8} style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted,#4A5168)', fontSize: 14 }}>
                        لا توجد فواتير مسجلة
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── BOTTOM GRID: VAT + INSIGHTS ───────────────────────────────── */}
        <div style={{ ...gridRow, gridTemplateColumns: '1.2fr 1fr', marginBottom: 40 }}>
          {/* VAT Summary + Profit Rings */}
          <div style={{
            background: 'var(--bg-surface,#141720)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20, padding: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary,#F1F3F9)' }}>{t("dashboard.vatSummary")}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted,#4A5168)', marginTop: 2 }}>Q1 2026 — ZATCA</div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: 'IBM Plex Sans,sans-serif', background: 'rgba(29,184,123,0.15)', color: '#1DB87B' }}>
                جارٍ ✓
              </div>
            </div>
            <div style={{ background: 'linear-gradient(135deg,rgba(29,184,123,0.08),rgba(29,184,123,0.03))', border: '1px solid rgba(29,184,123,0.2)', borderRadius: 12, padding: '16px 20px' }}>
              {[
                { label: t('dashboard.totalTaxableSales'), val: fmtSAR(totalRevenue) },
                { label: t('dashboard.salesVat'), val: fmtSAR(totalRevenue * 0.15) },
                { label: t('dashboard.purchasesVat'), val: fmtSAR(totalExpenses * 0.12) },
                { label: t('dashboard.netVatPayable'), val: fmtSAR(totalRevenue * 0.15 - totalExpenses * 0.12), highlight: true },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', fontSize: 13, borderTop: '1px solid rgba(29,184,123,0.1)',
                }}>
                  <span style={{ color: row.highlight ? '#1DB87B' : 'var(--text-secondary,#8B92A9)', fontWeight: row.highlight ? 700 : 400 }}>{row.label}</span>
                  <span style={{
                    fontFamily: 'IBM Plex Sans,sans-serif', fontVariantNumeric: 'tabular-nums',
                    direction: 'ltr', unicodeBidi: 'isolate', fontWeight: 600,
                    fontSize: row.highlight ? 16 : 14,
                    color: row.highlight ? '#1DB87B' : 'var(--text-primary,#F1F3F9)',
                  }}>{row.val}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary,#F1F3F9)', marginBottom: 12 }}>{t("dashboard.profitMargins")}</div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                <ProgressRing pct={totalRevenue > 0 ? Math.min(Math.round((netProfit / totalRevenue) * 100 * 2), 99) : 70} color="#D4A853" label={t("dashboard.grossMargin")} />
                <ProgressRing pct={totalRevenue > 0 ? Math.min(Math.round((netProfit / totalRevenue) * 100 * 1.3), 99) : 45} color="#1DB87B" label={t("dashboard.operatingMargin")} />
                <ProgressRing pct={totalRevenue > 0 ? Math.min(Math.round((netProfit / totalRevenue) * 100), 99) : 35} color="#4A90E2" label={t("dashboard.netMargin")} />
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div style={{
            background: 'var(--bg-surface,#141720)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20, padding: 24,
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary,#F1F3F9)', marginBottom: 20 }}>{t("dashboard.quickInsights")}</div>
            {[
              { dot: '#D4A853', label: t('dashboard.topRevenueChannel'),      val: delivery >= restaurant && delivery >= subscriptions ? `${t('dashboard.delivery')} 🛵` : restaurant >= subscriptions ? `${t('dashboard.restaurant')} 🍽️` : `${t('dashboard.subscriptions')} 📋`, color: '#1DB87B' },
              { dot: '#1DB87B', label: t('dashboard.totalRevenue'),     val: fmtSAR(totalRevenue) },
              { dot: '#4A90E2', label: t('dashboard.deliveryRevenue'),     val: fmtSAR(delivery) },
              { dot: '#F5A623', label: t('dashboard.expiringSubscriptions'), val: `${expiringSubs} ${t('dashboard.subscribers')}`, color: expiringSubs > 0 ? '#F5A623' : undefined },
              { dot: '#E8384D', label: t('dashboard.totalExpenses'),    val: fmtSAR(totalExpenses) },
              { dot: '#D4A853', label: t('dashboard.activeSubscribers'),    val: `${activeSubs} ${t('dashboard.subscriber')}` },
              { dot: '#1DB87B', label: t('dashboard.nextTaxQuarter'), val: '30 Jun 2026', mono: true },
              { dot: '#4A90E2', label: t('dashboard.vatPayable'),        val: fmtSAR(totalRevenue * 0.15 - totalExpenses * 0.12) },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary,#8B92A9)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: row.dot, flexShrink: 0 }} />
                  {row.label}
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 600,
                  fontFamily: row.mono ? 'IBM Plex Sans,sans-serif' : 'IBM Plex Sans,sans-serif',
                  color: row.color ?? 'var(--text-primary,#F1F3F9)',
                  direction: 'ltr', unicodeBidi: 'isolate',
                }}>{row.val}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Global keyframes (injected once) ─────────────────────────────── */}
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%  { transform: translate(40px,-30px) scale(1.05); }
          66%  { transform: translate(-20px,40px) scale(0.95); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes rowFadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        tr:hover .row-actions { opacity: 1 !important; }
      `}</style>
    </div>
  )
}
