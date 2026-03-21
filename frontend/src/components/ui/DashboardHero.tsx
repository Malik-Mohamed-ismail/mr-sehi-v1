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
        background: 'linear-gradient(160deg, #0D0F1A 0%, #151829 40%, #1A1030 100%)',
      }}
    >
      {/* Animated glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(212,168,83,0.13) 0%, transparent 70%)',
        animation: 'heroPulse 4s ease-in-out infinite alternate',
        pointerEvents: 'none',
      }}/>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <motion.div variants={staggerItem} initial="initial" animate="animate">
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(212,168,83,0.75)', marginBottom: 6 }}>
              {t('dashboard.financialReport')} · {from} — {to}
            </p>
            <h2 style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
              {t('dashboard.totalRevenue')}
            </h2>
            {isLoading ? (
              <div className="skeleton" style={{ height: 56, width: 200, borderRadius: 8 }}/>
            ) : (
              <div style={{ fontSize: 52, fontFamily: 'var(--font-display)', fontWeight: 400, color: '#F5E8C8', letterSpacing: '-0.02em', lineHeight: 1 }}>
                <AnimatedNumber value={totalRevenue} suffix=" ر.س" decimals={2} />
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
                  <AnimatedNumber value={netProfit} suffix=" ر.س" decimals={2} />
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
