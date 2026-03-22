import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import { Activity, TrendingUp, DollarSign } from 'lucide-react'
import { api } from '../../lib/api'
import { formatSAR } from '../../lib/utils'
import { useTranslation } from 'react-i18next'
import i18n from '../../lib/i18n'
import { PageTransition } from '../../components/ui/PageTransition'

export default function PerformancePage() {
  const { t } = useTranslation()
  const [dateRange, setDateRange] = useState(() => {
    const d = new Date()
    return {
      to: d.toISOString().split('T')[0],
      from: new Date(d.getFullYear(), d.getMonth() - 1, 1).toISOString().split('T')[0], // last month
    }
  })

  // 1. Fetch dashboard totals
  const { data: totals, isLoading: isTotalsLoading } = useQuery({
    queryKey: ['dashboard-totals', dateRange],
    queryFn: () => api.get('/reports/dashboard', { params: dateRange }).then(r => r.data.data),
  })

  // 2. Fetch performance trends
  const { data: trends, isLoading: isTrendsLoading } = useQuery({
    queryKey: ['performance-trends', dateRange],
    queryFn: () => api.get('/reports/performance-trends', { params: dateRange }).then(r => r.data.data),
  })

  const isLoading = isTotalsLoading || isTrendsLoading

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={24} color="var(--color-primary)"/> تقييم الأداء المالي
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{t('performance.pageSubtitle')}</p>
        </div>
        
        <div className="card" style={{ display: 'flex', gap: 12, padding: '8px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('performance.filter.from')}</span>
            <input type="date" className="form-input" style={{ padding: '4px 8px', minHeight: 32 }}
                   value={dateRange.from} onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('performance.filter.to')}</span>
            <input type="date" className="form-input" style={{ padding: '4px 8px', minHeight: 32 }}
                   value={dateRange.to} onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />)}
          <div className="skeleton" style={{ gridColumn: '1 / -1', height: 400, borderRadius: 12, marginTop: 24 }} />
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)' }}>
                <div style={{ padding: 8, borderRadius: 8, background: 'rgba(52, 211, 153, 0.1)', color: '#34d399' }}><DollarSign size={20}/></div>
                <span style={{ fontWeight: 600 }}>{t('performance.kpi.totalRevenue')}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-latin)' }}>
                {formatSAR(totals?.revenue?.total ?? 0)}
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)' }}>
                <div style={{ padding: 8, borderRadius: 8, background: 'rgba(248, 113, 113, 0.1)', color: '#f87171' }}><TrendingUp size={20} style={{ transform: 'scaleY(-1)' }}/></div>
                <span style={{ fontWeight: 600 }}>{t('performance.kpi.totalExpenses')}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-latin)' }}>
                 {formatSAR((totals?.total_expenses ?? 0) + (totals?.cogs ?? 0))}
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'linear-gradient(135deg, rgba(43,146,37,0.08) 0%, rgba(43,146,37,0.03) 100%)', border: '1px solid rgba(43,146,37,0.20)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-primary)' }}>
                <div style={{ padding: 8, borderRadius: 8, background: 'rgba(43,146,37,0.15)', color: 'var(--color-primary)' }}><Activity size={20}/></div>
                <span style={{ fontWeight: 700 }}>{t('performance.kpi.netProfit')}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-latin)', color: 'var(--color-primary)' }}>
                {formatSAR(totals?.net_profit ?? 0)}
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginRight: 10, display: 'inline-block' }}>
                  {t('performance.kpi.margin')} {((totals?.net_margin ?? 0) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Area Chart */}
          <div className="card" style={{ height: 450, padding: '24px 24px 40px 24px', marginBottom: 24 }} dir="ltr" /* chart stays LTR often, but wait, if it's LTR it might be ok, let's keep it LTR or change to i18n.dir() */>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, textAlign: 'right' }}>{t('performance.chart.title')}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2B9225" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2B9225" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fontFamily: 'var(--font-latin)', fontSize: 12 }} />
                <YAxis stroke="var(--text-secondary)" tick={{ fontFamily: 'var(--font-latin)', fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 8, fontFamily: 'var(--font-latin)' }}
                  itemStyle={{ fontFamily: 'var(--font-latin)' }}
                />
                <Legend wrapperStyle={{ paddingTop: 20, fontFamily: i18n.dir() === 'rtl' ? 'var(--font-arabic)' : 'var(--font-latin)' }} />
                <Area type="monotone" dataKey="revenue" name={t('performance.chart.revenue')} stroke="#34d399" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                <Area type="monotone" dataKey="expenses" name={t('performance.chart.expenses')} stroke="#f87171" fillOpacity={1} fill="url(#colorExp)" strokeWidth={3} />
                <Area type="monotone" dataKey="profit" name={t('performance.chart.profit')} stroke="#2B9225" fillOpacity={1} fill="url(#colorProf)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </PageTransition>
  )
}
