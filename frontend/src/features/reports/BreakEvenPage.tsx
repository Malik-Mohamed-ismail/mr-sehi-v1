import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { RefreshCw, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { api } from '../../lib/api'
import { PageTransition } from '../../components/ui/PageTransition'
import { DateRangePicker } from '../../components/ui/DateRangePicker'
import { AnimatedNumber } from '../../components/ui/AnimatedNumber'
import { staggerContainer, staggerItem } from '../../lib/animations'

const toDay = new Date().toISOString().split('T')[0]
const fromDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

export default function BreakEvenPage() {
  const { t } = useTranslation()
  const [from, setFrom] = useState(fromDay)
  const [to, setTo]     = useState(toDay)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['breakeven', from, to],
    queryFn: async () => {
      const res = await api.get('/reports/breakeven', { params: { from, to } })
      return res.data.data
    },
  })

  const isBeyond = data?.isBeyondBreakEven

  return (
    <PageTransition>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{t('pages.breakeven')}</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('reports.breakevenDesc')}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <DateRangePicker from={from} to={to} onChange={(f, tr) => { setFrom(f); setTo(tr) }} />
            <button className="btn btn-ghost btn-sm" onClick={() => refetch()}><RefreshCw size={14} /></button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />)}
          </div>
        ) : data ? (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" style={{ display: 'grid', gap: 20 }}>
            {/* Status Banner */}
            <motion.div variants={staggerItem} style={{
              padding: 20, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16,
              background: isBeyond ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
              border: `1.5px solid ${isBeyond ? 'rgba(29,184,123,0.3)' : 'rgba(232,56,77,0.3)'}`,
            }}>
              <Target size={28} color={isBeyond ? 'var(--color-success)' : 'var(--color-danger)'} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: isBeyond ? 'var(--color-success)' : 'var(--color-danger)', marginBottom: 4 }}>
                  {isBeyond ? t('breakeven.aboveBreakeven') : t('breakeven.belowBreakeven')}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {isBeyond ? t('breakeven.profitableDesc') : t('breakeven.lossDesc')}
                </div>
              </div>
            </motion.div>

            {/* KPI Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { label: t('breakeven.currentRevenue'),  value: data.currentRevenue,  color: 'var(--color-primary)' },
                { label: t('breakeven.breakevenSales'),  value: data.breakEvenSales,  color: isBeyond ? 'var(--color-success)' : 'var(--color-danger)' },
                { label: t('breakeven.fixedCosts'),      value: data.fixedCosts,      color: 'var(--color-warning)' },
                { label: t('breakeven.safetyMargin'),    value: data.safetyMarginSAR, color: data.safetyMarginSAR >= 0 ? 'var(--color-success)' : 'var(--color-danger)' },
              ].map(kpi => (
                <motion.div key={kpi.label} variants={staggerItem} className="card" style={{ borderTop: `3px solid ${kpi.color}` }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{kpi.label}</div>
                  <AnimatedNumber value={Number(kpi.value ?? 0)} suffix="" />
                </motion.div>
              ))}
              <motion.div variants={staggerItem} className="card" style={{ borderTop: '3px solid var(--color-info)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{t('breakeven.grossMargin')}</div>
                <AnimatedNumber value={Number(data.grossMarginPct ?? 0) * 100} suffix="%" decimals={1} />
              </motion.div>
              <motion.div variants={staggerItem} className="card" style={{ borderTop: '3px solid var(--color-primary)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{t('breakeven.safetyPct')}</div>
                <AnimatedNumber value={Number(data.safetyMarginPct ?? 0) * 100} suffix="%" decimals={1} />
              </motion.div>
            </div>

            {/* Progress to break-even */}
            <motion.div variants={staggerItem} className="card">
              <h3 style={{ fontWeight: 600, marginBottom: 16 }}>{t('breakeven.progress')}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                <span>0</span>
                <span>{t('breakeven.breakeven')}: {Number(data.breakEvenSales ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                <span>{t('breakeven.current')}: {Number(data.currentRevenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
              </div>
              <div style={{ height: 20, borderRadius: 10, background: 'var(--bg-surface-2)', overflow: 'hidden', position: 'relative' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (data.currentRevenue / data.breakEvenSales) * 100)}%` }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    height: '100%', borderRadius: 10,
                    background: isBeyond ? 'var(--gradient-success)' : 'var(--gradient-danger)',
                  }}
                />
              </div>
              <div style={{ textAlign: 'center', fontSize: 13, marginTop: 8, color: 'var(--text-secondary)' }}>
                {((data.currentRevenue / data.breakEvenSales) * 100).toFixed(1)}% {t('breakeven.ofBreakeven')}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>{t('common.noData')}</div>
        )}
      </div>
    </PageTransition>
  )
}
