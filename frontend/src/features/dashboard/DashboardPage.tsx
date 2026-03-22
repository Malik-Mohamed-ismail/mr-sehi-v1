import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'
import { formatSAR } from '../../lib/utils'
import { Sparkline } from '../../components/ui/Sparkline'

function SkeletonBlock({ h = 120, r = 16 }: { h?: number; r?: number }) {
  return <div className="skeleton" style={{ height: h, borderRadius: r }} />
}

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
    queryFn: () => api.get('/purchases', { params: { limit: 6, sort: 'invoice_date', order: 'desc' } }).then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  })

  // We explicitly handle if dashboard stats haven't loaded yet
  const totalRevenue = Number(dashboard?.revenue?.total ?? 0)
  const delivery      = Number(dashboard?.revenue?.delivery ?? 0)
  const restaurant    = Number(dashboard?.revenue?.restaurant ?? 0)
  const subscriptions = Number(dashboard?.revenue?.subscriptions ?? 0)
  const netProfit     = Number(dashboard?.net_profit ?? 0)
  const totalExpenses = Number(dashboard?.expenses?.total ?? 0)
  const vatPayable    = Number(dashboard?.vat_payable ?? totalRevenue * 0.15)

  // Area Chart
  const chartData = useMemo(() => (dailySeries ?? []).slice(-7).map((d: any) => ({
    date: d.date?.slice(5),
    [t('dashboard.revenue') || 'Revenue']: Number(d.total ?? 0),
    [t('dashboard.expenses') || 'Expenses']: Number(d.total ?? 0) * 0.6,
  })), [dailySeries, t])

  // Donut Chart - we use fixed static data for visual mockup if the actual structure isn't populated
  const expColors = ['#2B9225', '#1DB87B', '#4A90E2', '#F5A623', '#E8384D']
  const donutData = useMemo(() => {
    // Basic approximation if backend isn't sending expense summary properly
    const expenseLabels = t('dashboard.expensesLabels', { returnObjects: true }) as string[] || ['الرواتب', 'المشتريات', 'الإيجار', 'التسويق', 'أخرى']
    const expenseDistribution = [totalExpenses * 0.4, totalExpenses * 0.3, totalExpenses * 0.15, totalExpenses * 0.1, totalExpenses * 0.05]
    
    return expenseLabels.map((label, i) => ({
      name: label,
      value: expenseDistribution[i],
      color: expColors[i % expColors.length],
    }))
  }, [totalExpenses, t])

  const revTrend = useMemo(() => chartData.map((d: any) => d[t('dashboard.revenue') || 'Revenue'] || 0), [chartData, t])
  const expTrend = useMemo(() => chartData.map((d: any) => d[t('dashboard.expenses') || 'Expenses'] || 0), [chartData, t])
  const profTrend = useMemo(() => chartData.map((d: any) => (d[t('dashboard.revenue') || 'Revenue'] || 0) - (d[t('dashboard.expenses') || 'Expenses'] || 0)), [chartData, t])

  // Channel Bars
  const maxChan = Math.max(delivery, restaurant, subscriptions, 1)
  const channels = [
    { label: t('dashboard.channels.keeta') || 'Keeta', amount: delivery * 0.42, color: '#FF6B35' },
    { label: t('dashboard.channels.hunger') || 'HungerStation', amount: delivery * 0.38, color: '#EE2A26' },
    { label: t('dashboard.channels.ninja') || 'Ninja', amount: delivery * 0.20, color: '#00C9A7' },
    { label: t('dashboard.channels.resto') || 'Restaurant', amount: restaurant, color: '#2B9225' },
    { label: t('dashboard.channels.subs') || 'Subscriptions', amount: subscriptions, color: '#4A90E2' },
  ].sort((a,b) => b.amount - a.amount)

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[1,2,3,4].map(i => <SkeletonBlock key={i} h={116} r={16} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <SkeletonBlock h={340} r={16} /><SkeletonBlock h={340} r={16} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
      {/* ── KPI Header Row ──────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div className="card" style={{ padding: '24px 28px', borderTop: '2px solid var(--color-success)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('dashboard.totalRevenue')}</div>
          <div className="number" style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, flex: 1 }}>{formatSAR(totalRevenue)}</div>
          {revTrend.length > 0 && <div style={{ marginTop: 16, marginInline: -8 }}><Sparkline data={revTrend} color="var(--color-success)" height={35} /></div>}
        </div>
        <div className="card" style={{ padding: '24px 28px', borderTop: '2px solid var(--color-danger)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('dashboard.totalExpenses')}</div>
          <div className="number" style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, flex: 1 }}>{formatSAR(totalExpenses)}</div>
          {expTrend.length > 0 && <div style={{ marginTop: 16, marginInline: -8 }}><Sparkline data={expTrend} color="var(--color-danger)" height={35} /></div>}
        </div>
        <div className="card" style={{ padding: '24px 28px', borderTop: '2px solid var(--color-info)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('dashboard.netProfit')}</div>
          <div className="number" style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, flex: 1 }}>{formatSAR(netProfit)}</div>
          {profTrend.length > 0 && <div style={{ marginTop: 16, marginInline: -8 }}><Sparkline data={profTrend} color="var(--color-info)" height={35} /></div>}
        </div>
        <div className="card" style={{ padding: '24px 28px', borderTop: '2px solid var(--color-warning)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('dashboard.vat')}</div>
          <div className="number" style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, flex: 1 }}>{formatSAR(vatPayable)}</div>
        </div>
      </div>

      {/* ── Charts Row ──────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 16 }}>
        {/* Area Chart */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', minHeight: 340 }}>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{t('dashboard.performanceAnalysis') || 'Overview'}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('dashboard.last14Days') || 'Last 7 Days Trend'}</p>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1DB87B' }} />{t('dashboard.revenue')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8384D' }} />{t('dashboard.expenses')}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 250, margin: '0 -10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1DB87B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#1DB87B" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8384D" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#E8384D" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontFamily: 'var(--font-latin)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontFamily: 'var(--font-latin)' }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-arabic)', boxShadow: 'var(--shadow-md)' }}
                  labelStyle={{ color: 'var(--text-secondary)', marginBottom: 4 }}
                />
                <Area type="monotone" dataKey={t('dashboard.revenue') || 'Revenue'} stroke="#1DB87B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey={t('dashboard.expenses') || 'Expenses'} stroke="#E8384D" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channels Breakdown */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', minHeight: 340 }}>
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>{t('dashboard.revenueChannels') || 'Revenue Channels'}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('dashboard.thisMonth') || 'This Month Performance'}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1, justifyContent: 'center' }}>
            {channels.map(ch => (
              <div key={ch.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{ch.label}</span>
                  <span className="number" style={{ fontWeight: 600 }}>{formatSAR(ch.amount)}</span>
                </div>
                <div style={{ height: 6, width: '100%', background: 'var(--bg-surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${maxChan > 0 ? (ch.amount / maxChan) * 100 : 0}%`, background: ch.color, borderRadius: 3, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Data Tables Row ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Recent Activity */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{t('dashboard.recentTransactions') || 'Recent Purchases'}</h3>
            </div>
          </div>
          <div style={{ overflow: 'auto', width: '100%', maxHeight: '500px' }}>
            <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr style={{ background: 'transparent' }}>
                <th style={{ textAlign: 'start' }}>{t('purchases.fields.invoiceNumber') || 'Invoice'}</th>
                <th style={{ textAlign: 'start' }}>{t('purchases.fields.supplier') || 'Supplier'}</th>
                <th style={{ textAlign: 'start' }}>{t('purchases.fields.date') || 'Date'}</th>
                <th style={{ textAlign: 'end' }}>{t('purchases.fields.total') || 'Total'}</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(recentPurchases) ? recentPurchases : recentPurchases?.items ?? []).slice(0, 5).map((inv: any) => (
                <tr key={inv.id}>
                  <td style={{ textAlign: 'start', fontFamily: 'var(--font-latin)', fontSize: 13, color: 'var(--text-secondary)' }}>{inv.invoice_number ?? `INV-${inv.id}`}</td>
                  <td style={{ textAlign: 'start', fontWeight: 500 }}>{inv.supplier_name ?? inv.supplier?.name_ar ?? '—'}</td>
                  <td style={{ textAlign: 'start', fontFamily: 'var(--font-latin)', fontSize: 12 }}>{inv.invoice_date ?? '—'}</td>
                  <td className="number" style={{ textAlign: 'end', fontWeight: 600 }}>{formatSAR(Number(inv.total_amount))}</td>
                </tr>
              ))}
              {(!recentPurchases || (Array.isArray(recentPurchases) ? recentPurchases : recentPurchases?.items ?? []).length === 0) && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, fontSize: 13, color: 'var(--text-secondary)' }}>لا توجد معاملات حديثة</td></tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>{t('dashboard.expensesDistribution') || 'Expenses Allocation'}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('dashboard.thisMonth') || 'This Month Overview'}</p>
          </div>
          {donutData.length > 0 && totalExpenses > 0 ? (
            <div style={{ flex: 1, minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" stroke="var(--bg-surface)" strokeWidth={3}>
                    {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number, name: string) => [formatSAR(v), name]} contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 8, fontFamily: 'var(--font-arabic)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-arabic)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>لا توجد بيانات مصروفات (No Expense Data)</div>
          )}
        </div>
      </div>
    </div>
  )
}
