import { motion } from 'framer-motion'
import { AnimatedNumber } from './AnimatedNumber'
import { staggerItem } from '../../lib/animations'
import { useTranslation } from 'react-i18next'
import { DateRangePicker } from './DateRangePicker'

interface DashboardHeroProps {
  totalRevenue: number
  netProfit: number
  from: string
  to: string
  onRangeChange: (from: string, to: string) => void
  isLoading?: boolean
}

export function DashboardHero({ totalRevenue, netProfit, from, to, onRangeChange, isLoading }: DashboardHeroProps) {
  const { t } = useTranslation()
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        borderRadius: 20, padding: '36px 40px', marginBottom: 28,
        position: 'relative', overflow: 'hidden', minHeight: 200,
        background: 'linear-gradient(160deg, #132E11 0%, #1A3D18 40%, #2B6B27 100%)',
      }}
    >
      {/* Animated glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(196,122,60,0.15) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 20% 50%, rgba(43,146,37,0.10) 0%, transparent 60%)',
        animation: 'heroPulse 4s ease-in-out infinite alternate',
        pointerEvents: 'none',
      }}/>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <motion.div variants={staggerItem} initial="initial" animate="animate">
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(196,122,60,0.85)', marginBottom: 6 }}>
              {t('dashboard.financialReport')} · {from} — {to}
            </p>
            <h2 style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
              {t('dashboard.totalRevenue')}
            </h2>
            {isLoading ? (
              <div className="skeleton" style={{ height: 56, width: 200, borderRadius: 8 }}/>
            ) : (
              <div style={{ fontSize: 52, fontFamily: 'var(--font-display)', fontWeight: 400, color: '#E8F5E7', letterSpacing: '-0.02em', lineHeight: 1 }}>
                <AnimatedNumber value={totalRevenue} suffix="" decimals={2} />
              </div>
            )}
          </motion.div>
          <DateRangePicker from={from} to={to} onChange={onRangeChange}/>
        </div>

        {/* Secondary stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 2 }}>{t('dashboard.netProfit')}</span>
            {isLoading
              ? <div className="skeleton" style={{ height: 22, width: 100, borderRadius: 4 }}/>
              : <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-latin)', color: netProfit >= 0 ? 'rgba(29,184,123,0.9)' : 'rgba(232,56,77,0.9)', direction: 'ltr' }}>
                  <AnimatedNumber value={netProfit} suffix="" decimals={2} />
                </div>
            }
          </div>
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.1)' }}/>
          <div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 2 }}>{t('dashboard.profitMargin')}</span>
            {isLoading
              ? <div className="skeleton" style={{ height: 22, width: 60, borderRadius: 4 }}/>
              : <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-latin)', color: margin >= 20 ? 'rgba(29,184,123,0.9)' : margin >= 10 ? 'rgba(245,166,35,0.9)' : 'rgba(232,56,77,0.9)', direction: 'ltr' }}>
                  <AnimatedNumber value={margin} suffix="%" decimals={1} />
                </div>
            }
          </div>
        </div>
      </div>
    </motion.section>
  )
}
